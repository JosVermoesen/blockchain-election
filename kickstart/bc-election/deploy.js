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
    .send({ gas: "1300000", from: accounts[0] });

  // console.log(JSON.stringify(abi));
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

// 0x80639F8EA1e0A6da4E2Edc53473089DB98978b60 - contract address 2024-07-08
