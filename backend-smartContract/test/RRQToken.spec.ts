import { should } from "chai";
import { ethers } from "hardhat";

describe("RRQ Token Contract deployment", function () {
  it("Contract deployment", async function () {
    const RRQToken = await ethers.getContractFactory("RRQToken");
    const rrqToken = await RRQToken.deploy();
    await rrqToken.deployed();
    should().exist(rrqToken.address);
  });
});
