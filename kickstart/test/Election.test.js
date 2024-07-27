const assert = require("assert");
const ganache = require("ganache");
const { Web3, eth } = require("web3");
const ethers = require("ethers");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../bc-election/compile");

let election;
let accounts;

let nameHarris = ethers.encodeBytes32String("Kamala Harris");
// console.log("name Harris: ", nameHarris);

let nameTrump = ethers.encodeBytes32String("Donald Trump");
// console.log("name Trump: ", nameTrump);

// Bytes32 encoded for the names
// ["0x4b616d616c612048617272697300000000000000000000000000000000000000","0x446f6e616c64205472756d700000000000000000000000000000000000000000"]

// https://www.shorturl.at/

//'https://blockchain-elections.vsoft.be/images/Kamala_Harris.jpg'
// https://shorturl.at/92kSq
let imageHarris = ethers.encodeBytes32String("https://shorturl.at/92kSq");
// console.log("image Harris: ", imageHarris);

//'https://blockchain-elections.vsoft.be/images/Donald_Trump.jpg'
// https://shorturl.at/uKwGI
let imageTrump = ethers.encodeBytes32String("https://shorturl.at/uKwGI");
// console.log("image Trump: ", imageTrump);

// Bytes32 encoded for the images
// ["0x68747470733a2f2f73686f727475726c2e61742f7465696a7600000000000000","0x68747470733a2f2f73686f727475726c2e61742f526a4d487100000000000000"]

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log("accounts: ", accounts);

  try {
    election = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
      })
      .send({
        from: accounts[0],
        gas: "2000000",
      });
  } catch (error) {
    console.log("error: ", error);
  }
});
describe("Election Contract", () => {
  it("deploys a contract", () => {
    assert.ok(election.options.address);
  });

  it("can call chairperson", async () => {
    const chairperson = await election.methods.chairperson().call();
    assert.equal(accounts[0], chairperson);
  });

  it("only chairperson can initialize", async () => {
    try {
      await election.methods
        .initCandidates([nameHarris, nameTrump], [imageHarris, imageTrump])
        .send({
          from: accounts[1],
          gas: "2000000",
        });
    } catch (error) {
      assert(error);
    }
  });

  it("chairperson can initialize only once", async () => {
    try {
      await election.methods
        .initCandidates([nameHarris, nameTrump], [imageHarris, imageTrump])
        .send({
          from: accounts[0],
          gas: "2000000",
        });
    } catch (error) {}

    try {
      await election.methods
        .initCandidates([nameHarris, nameTrump], [imageHarris, imageTrump])
        .send({
          from: accounts[0],
          gas: "2000000",
        });
    } catch (error) {
      assert(error);
    }
  });

  it("can check who is allowed to vote or not", async () => {
    try {
      await election.methods
        .initCandidates([nameHarris, nameTrump], [imageHarris, imageTrump])
        .send({
          from: accounts[0],
          gas: "2000000",
        });
    } catch (error) {}

    try {
      result = await election.methods.giveRightToVote(accounts[1]).send({
        from: accounts[0],
        gas: "1000000",
      });
    } catch (error) {
      assert(error);
    }

    try {
      const allowed = await election.methods.allowedToVote(accounts[5]).call();

      assert.equal(false, allowed);
      const allowed2 = await election.methods.allowedToVote(accounts[1]).call();

      assert.equal(true, allowed2);
    } catch (error) {
      console.log("error: ", error.message);
    }
  });

  it("let chairperson give right to voters", async () => {
    try {
      await election.methods
        .initCandidates([nameHarris, nameTrump], [imageHarris, imageTrump])
        .send({
          from: accounts[0],
          gas: "2000000",
        });
    } catch (error) {}

    await election.methods.giveRightToVote(accounts[1]).send({
      from: accounts[0],
      gas: "2000000",
    });
    await election.methods.giveRightToVote(accounts[2]).send({
      from: accounts[0],
      gas: "2000000",
    });
    await election.methods.giveRightToVote(accounts[3]).send({
      from: accounts[0],
      gas: "2000000",
    });
    await election.methods.giveRightToVote(accounts[4]).send({
      from: accounts[0],
      gas: "2000000",
    });

    try {
      const vote1 = await election.methods.vote(0).send({
        from: accounts[1],
        gas: "2000000",
      });
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      const vote2 = await election.methods.vote(1).send({
        from: accounts[2],
        gas: "2000000",
      });
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      const vote3 = await election.methods.vote(1).send({
        from: accounts[3],
        gas: "2000000",
      });
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      const vote4 = await election.methods.vote(1).send({
        from: accounts[4],
        gas: "2000000",
      });
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      const count = await election.methods.candidateVotes(0).call();
      assert.equal(1, count);

      const count2 = await election.methods.candidateVotes(1).call();
      assert.equal(3, count2);
    } catch (error) {
      console.log("error: ", error);
    }

    try {
      const winner = await election.methods.winningCandidate().send({
        from: accounts[0],
        gas: "2000000",
      });
      // console.log("winner: ", winner);
    } catch (error) {
      assert(error);
    }

    try {
      const winnerName = await election.methods.winnerName().call({
        from: accounts[4],
        gas: "2000000",
      });

      assert.equal("Donald Trump", ethers.decodeBytes32String(winnerName));
    } catch (error) {
      assert(error);
    }

    try {
      const winnerImage = await election.methods.winnerImage().call({
        from: accounts[4],
        gas: "2000000",
      });

      assert.equal(imgageTrump, ethers.decodeBytes32String(winnerImage));
    } catch (error) {
      assert(error);
    }

    try {
      count = await election.methods.candidatesCount().call();
      assert.equal(2, count);
    } catch (error) {
      assert(error);
    }

    for (p = 0; p < count; p++) {
      try {
        const candidate = await election.methods.getCandidate(p).call();
        const candidateName = candidate[1];
        const candidateImage = candidate[2];

        console.log(ethers.decodeBytes32String(candidateName));
        console.log(ethers.decodeBytes32String(candidateImage));
      } catch (error) {
        console.log("error: ", error);
      }
    }

    try {
      const allowed = await election.methods.allowedToVote(accounts[5]).call();
      assert.equal(false, allowed);
      const allowed2 = await election.methods.allowedToVote(accounts[4]).call();
      assert.equal(true, allowed2);
    } catch (error) {
      console.log("error: ", error.message);
    }

    try {
      const votedAlready = await election.methods
        .votedAlready(accounts[4])
        .call();

      assert.equal(true, votedAlready);

      const votedAlready2 = await election.methods
        .votedAlready(accounts[9])
        .call();

      assert.equal(false, votedAlready2);
    } catch (error) {}
  }); 
});
