const express = require("express");
const app = express();
const cors = require("cors");
const AddressService = require("./service/address.service");
const port = 3042;

app.use(cors());
app.use(express.json());

const address = new AddressService();

const balances = address.getAddress();

app.get("/balance", (req, res) => {
  const balance = Object.entries(balances).map(([addr, balance]) => ({
    address: addr,
    balance: balance,
  }));

  res.send(balance);
});

app.get("/private-key", (req, res) => {
  res.send(address.getPrivateKey());
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
