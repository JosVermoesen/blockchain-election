const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require("./compile");
const secrets = require("../secrets/secrets");

const provider = new HDWalletProvider(
  secrets.metamask,
  // remember to change this to your own phrase!
  secrets.sepolia
  // remember to change this to your own endpoint!
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "2000000", from: accounts[0] });

  // console.log(JSON.stringify(abi));
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

// 0x028E077A7c0f74599576cD2296a94D91A2260995 - contract address 2024-07-27
// 0x9059F2432573DD5Fb37b040c6edfabcC0E4bBd1c - contract address 2024-07-24
// 0x640a3a043eC80Ee86A1D69EF94f3bf66a59C52Cd - contract address 2024-07-23
// 0xad6C120F1aFe8Ffda1f1F7B033C67A80947ffFD4 - contract address 2024-07-13
// 0x80639F8EA1e0A6da4E2Edc53473089DB98978b60 - contract address 2024-07-08
