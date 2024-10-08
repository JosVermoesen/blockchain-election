const ethers = require("ethers");

async function createBytes(args) {
  const name = args[0];
  const bytes32 = ethers.encodeBytes32String(name);
  const text = ethers.decodeBytes32String(bytes32);

  console.log("Bytes: ", bytes32);
  console.log("Text: ", text);
}
createBytes(process.argv.slice(2));

[
  "0x4b616d616c612048617272697300000000000000000000000000000000000000", // "Kamala Harris"
  "0x446f6e616c64205472756d700000000000000000000000000000000000000000", // "Donald Trump"
];
