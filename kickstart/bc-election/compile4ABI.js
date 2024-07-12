const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
const { abi, evm } = require("./compile");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

fs.ensureDirSync(buildPath);

console.log(abi);
fs.outputFileSync(
  path.resolve(buildPath, "lotteryABI.json"),
  JSON.stringify(abi)
);
