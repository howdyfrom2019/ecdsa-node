import React, { useEffect, useState } from "react";
import server from "./server";

// This is non-sense, because there are no projects serving private key to the client side.
export default function CreateWalletInfo() {
  const [balances, setBalances] = useState([]);

  const fetchBalanceInfo = async () => {
    const { data } = await server.get("/balance");
    setBalances(data);
  };

  useEffect(() => {
    fetchBalanceInfo();
  }, []);

  return (
    <div>
      {balances.map((data, i) => (
        <div key={i}>
          <h3>{data.address}</h3>
          <p>{data.balance}</p>
        </div>
      ))}
    </div>
  );
}
