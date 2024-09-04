const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

class AddressService {
  address = {};
  pk = [];

  constructor() {
    this.pk = [
      this.generatePrivateKey(),
      this.generatePrivateKey(),
      this.generatePrivateKey(),
    ];
    this.address = {
      [this.getPublicKey(this.pk[0])]: 100,
      [this.getPublicKey(this.pk[1])]: 75,
      [this.getPublicKey(this.pk[2])]: 50,
    };
  }

  generatePrivateKey() {
    const privateKey = secp.secp256k1.utils.randomPrivateKey();
    return toHex(privateKey);
  }

  getPublicKey(privateKey) {
    let publicKey;
    if (privateKey) {
      publicKey = toHex(secp.secp256k1.getPublicKey(privateKey));
    } else {
      publicKey = toHex(secp.secp256k1.getPublicKey(this.generatePrivateKey()));
    }
    return `0x${publicKey.slice(publicKey.length - 20)}`;
  }

  getAddress() {
    return this.address;
  }

  getPrivateKey() {
    return this.pk;
  }

  hashMessage(message) {
    const hash = keccak256(utf8ToBytes(message));
    return hash;
  }

  signMessage(msg, privateKey) {
    const hashedMsg = this.hashMessage(msg);
    const signature = secp.secp256k1.sign(hashedMsg, privateKey);
    return signature;
  }
}

module.exports = AddressService;
