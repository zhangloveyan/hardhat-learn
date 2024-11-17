const { task } = require("hardhat/config")

task("interact-fundme", "测试转账")
    .addParam("addr", "部署的合约地址")
    .setAction(async (taskArgs, hre) => {
        // 合约交互 0x5FbDB2315678afecb367f032d93F642f64180aa3
        // 通过地址 寻找部署的合约 attach
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        const fundMe = fundMeFactory.attach(taskArgs.addr);

        // 获取账号
        const [first, second] = await ethers.getSigners();
        // 第一个转账 默认使用第一个地址
        const fundTx = await fundMe.connect(first).fund({ value: ethers.parseEther("1.5") });
        // 等待交易完成
        await fundTx.wait();

        // 合约余额
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
        console.log('合约余额' + ethers.formatEther(balanceOfContract));

        const fundTx_2 = await fundMe.connect(second).fund({ value: ethers.parseEther("2.2") })
        await fundTx_2.wait();

        const balanceOfContract_2 = await ethers.provider.getBalance(fundMe.target);
        console.log('合约余额' + ethers.formatEther(balanceOfContract_2));
        
        console.log(first.address)
        console.log(second.address)

        const firstBalance = await fundMe.funderToAmount(first.address);
        const secondBalance = await fundMe.funderToAmount(second.address);

        console.log("账户一存入" + ethers.formatEther(firstBalance));
        console.log("账户二存入" + ethers.formatEther(secondBalance));
    });

module.exports = {}