const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("test fundme contract", async function () {
    let fundMe
    let firstAccount
    let secondAccount
    beforeEach(async function () {
        // [firstAccount, secondAccount] = await ethers.getSigners();
        // 变成可配置
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount

        const fundMeFactory = await ethers.getContractFactory("FundMe");
        fundMe = await fundMeFactory.deploy(60);

        // 有点问题 先不用这种方式
        // await deployments.fixture(["fundme"])
        // const fundMeDeployment = await deployments.get("FundMe")
        // fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    it("test if the owner is msg.sender", async function () {
        // 具体测试内容
        await fundMe.waitForDeployment();

        const owner = await fundMe.owner();
        // 结果是否相同
        assert.equal(owner, firstAccount)
    })

    // 跟钱有关的 一定要测试!!
    // 测试 fund getFund refund 方法
    // fund 1.activity is end 2. send more eth 3.存款数量是否正确
    it("test activity is end", async function () {
        await fundMe.waitForDeployment();
        helpers.time.increase(200);
        helpers.mine();

        expect(fundMe.fund({ value: ethers.parseEther('1') }))
            .to.be.revertedWith('Activity is end');
    })

    it("test Send more ETH", async function () {
        await fundMe.waitForDeployment();
        expect(fundMe.fund({ value: ethers.parseEther('0.1') }))
            .to.revertedWith('Send more ETH');

    })

    it("test fund eth right", async function () {
        await fundMe.waitForDeployment();
        await fundMe.fund({ value: ethers.parseEther('1.1') })
        // const sec = await ethers.getContract("FundMe", secondAccount)

        // await fundMe.connect(sec).fund({ value: ethers.parseEther('1.5') })

        const balance = await ethers.provider.getBalance(fundMe);
        const firstAmount = await fundMe.funderToAmount(firstAccount)
        // const secondAmount = await fundMe.funderToAmount(secondAccount)
        assert.equal(1.1, ethers.formatEther(firstAmount))
        // assert.equal(1.5, ethers.formatEther(secondAmount))
        // assert.equal(2.6, ethers.formatEther(balance))
    })

    it("test refund, fund not reached when activity is end", async function () {
        await fundMe.waitForDeployment();
        await fundMe.fund({ value: ethers.parseEther('0.002') })
        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.refund()).emit(fundMe, "RefundByFunder")
            .withArgs(firstAccount, ethers.parseEther('0.002'))
    })

})