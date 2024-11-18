const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");

describe("test fundme contract", async function () {
    let fundMe
    let firstAccount
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

        console.log("fundMe:" + fundMe)
    })

    it("test if the owner is msg.sender", async function () {
        // 具体测试内容
        // const [first, second] = await ethers.getSigners();
        // const fundMeFactory = await ethers.getContractFactory("FundMe");
        // const fundMe = await fundMeFactory.deploy(60);

        await fundMe.waitForDeployment();

        const owner = await fundMe.owner();
        // 结果是否相同
        assert.equal(owner, firstAccount)
    })
})