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

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const JoKenPo = await hre.ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    return { joKenPo, owner, player1, player2 };
  }

  describe("Deployment", function () {
    it("Should get the leaderboard", async function () {
      const { joKenPo, owner, player1, player2 } = await loadFixture(
        deployFixture
      );

      const player1Instance = joKenPo.connect(player1);
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID });

      const player2Instance = joKenPo.connect(player2);
      await player2Instance.play(Options.ROCK, { value: DEFAULT_BID });

      const leaderboard = await joKenPo.getLeaderboard();
      expect(leaderboard[0].wallet).to.be.equal(player1.address);
      expect(leaderboard[0].wins).to.be.equal(1);
    });
  });

  it("Should set the bid", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newBid = hre.ethers.parseEther("0.02");
    await joKenPo.setBid(newBid);

    const bid = await joKenPo.getBid();
    expect(bid).to.be.equal(newBid);
  });

  it("Should NOT set bid if not owner", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newBid = hre.ethers.parseEther("0.02");
    const player1Instance = joKenPo.connect(player1);
    await expect(player1Instance.setBid(newBid)).to.be.revertedWith(
      "Only the owner can change the bid"
    );
  });

  it("Should NOT set bid while a game is running", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newBid = hre.ethers.parseEther("0.02");
    const player1Instance = joKenPo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID });

    await expect(joKenPo.setBid(newBid)).to.be.revertedWith(
      "You can't change the bid while a game is running"
    );
  });

  it("Should set commission", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newCommission = 11;
    await joKenPo.setCommission(newCommission);

    const commission = await joKenPo.getCommission();
    expect(commission).to.be.equal(newCommission);
  });

  it("Should NOT set commission if not owner", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newCommission = 11;
    const player1Instance = joKenPo.connect(player1);
    await expect(
      player1Instance.setCommission(newCommission)
    ).to.be.revertedWith("Only the owner can change the commission");
  });

  it("Should NOT set commission while a game is running", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const newCommission = 11;
    const player1Instance = joKenPo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID });

    await expect(joKenPo.setCommission(newCommission)).to.be.revertedWith(
      "You can't change the commission while a game is running"
    );
  });

  it("Should player1 make his play", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await joKenPo.connect(player1).play(Options.PAPER, { value: DEFAULT_BID });
    const result = await joKenPo.getResult();
    expect(result).to.be.equal("Player 1 has chosen, waiting for Player 2.");
  });

  it("Should both players make their plays", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await joKenPo.connect(player1).play(Options.PAPER, { value: DEFAULT_BID });
    await joKenPo.connect(player2).play(Options.ROCK, { value: DEFAULT_BID });

    const result = await joKenPo.getResult();
    expect(result).to.be.equal("Paper wraps rock, player 1 won.");
  });

  it("Should NOT play if is the owner", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    await expect(
      joKenPo.play(Options.PAPER, { value: DEFAULT_BID })
    ).to.be.revertedWith("Owner can not play");
  });

  it("Should NOT play if choose an invalid option", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const player1Instance = joKenPo.connect(player1);
    await expect(
      player1Instance.play(Options.NONE, { value: DEFAULT_BID })
    ).to.be.revertedWith("You must choose a valid option");
  });

  it("Should NOT play if the player has already played", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const player1Instance = joKenPo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID });

    await expect(
      player1Instance.play(Options.ROCK, { value: DEFAULT_BID })
    ).to.be.revertedWith("Wait the Player 2 to play");
  });

  it("Should NOT play if bid is less than the minimum", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(
      deployFixture
    );

    const player1Instance = joKenPo.connect(player1);
    await expect(
      player1Instance.play(Options.PAPER, { value: hre.ethers.parseEther("0") })
    ).to.be.revertedWith("Minimum bid is 0.01 ether");
  });
});
