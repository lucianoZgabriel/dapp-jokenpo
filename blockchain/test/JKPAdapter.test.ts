import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("JoKenPo", function () {
  enum Options {
    NONE,
    ROCK,
    PAPER,
    SCISSORS,
  }

  const DEFAULT_BID = hre.ethers.parseEther("0.01");
  const DEFAULT_COMMISSION = 10;

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const JoKenPo = await hre.ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    const JKPAdapter = await hre.ethers.getContractFactory("JKPAdapter");
    const jkpAdapter = await JKPAdapter.deploy();

    return { joKenPo, jkpAdapter, owner, player1, player2 };
  }

  it("Should get implamentation address", async function () {
    const { joKenPo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const address = await joKenPo.getAddress();
    await jkpAdapter.setJoKenPo(joKenPo);
    const implementationAddress = await jkpAdapter.getImplementationAddress();
    expect(address).to.be.equal(implementationAddress);
  });

  it("Should get bid", async function () {
    const { joKenPo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await jkpAdapter.setJoKenPo(joKenPo);

    const bid = await jkpAdapter.getBid();
    expect(bid).to.be.equal(DEFAULT_BID);
  });

  it("Should NOT get bid if JoKenPo is not set", async function () {
    const { jkpAdapter } = await loadFixture(deployFixture);

    await expect(jkpAdapter.getBid()).to.be.revertedWith(
      "JoKenPo contract address not set"
    );
  });

  it("Should get commission", async function () {
    const { joKenPo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await jkpAdapter.setJoKenPo(joKenPo);

    const commission = await jkpAdapter.getCommission();
    expect(commission).to.be.equal(DEFAULT_COMMISSION);
  });

  it("Should NOT get commission if JoKenPo is not set", async function () {
    const { jkpAdapter } = await loadFixture(deployFixture);

    await expect(jkpAdapter.getCommission()).to.be.revertedWith(
      "JoKenPo contract address not set"
    );
  });

  it("Should not set contract if not owner", async function () {
    const { jkpAdapter, joKenPo, player1 } = await loadFixture(deployFixture);

    const player1Instance = jkpAdapter.connect(player1);
    await expect(
      player1Instance.setJoKenPo(joKenPo.getAddress())
    ).to.be.revertedWith("Only the owner can call this function");
  });

  it("Should not set JoKenPo implementation with zero address", async function () {
    const { jkpAdapter } = await loadFixture(deployFixture);

    await expect(
      jkpAdapter.setJoKenPo(hre.ethers.ZeroAddress)
    ).to.be.revertedWith("Invalid JoKenPo address");
  });

  it("Should play alone", async function () {
    const { joKenPo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await jkpAdapter.setJoKenPo(joKenPo);

    const player1Instance = jkpAdapter.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID });

    const result = await joKenPo.getResult();
    expect(result).to.be.equal("Player 1 has chosen, waiting for Player 2.");
  });

  it("Should play with player 2", async function () {
    const { joKenPo, jkpAdapter, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await jkpAdapter.setJoKenPo(joKenPo);

    const player1Instance = jkpAdapter.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID });

    const player2Instance = jkpAdapter.connect(player2);
    await player2Instance.play(Options.PAPER, { value: DEFAULT_BID });

    const result = await joKenPo.getResult();
    expect(result).to.be.equal("Paper wraps rock, player 2 won.");
  });
});
