const { task } = require("hardhat/config")

task("deploy-fundme", "fundme 合约部署")
    .setAction(async (taskArgs, hre) => {
        // 创建合约工厂
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        console.log('合约正在部署');
        // 部署合约 只是发送 不包括写入
        const fundMe = await fundMeFactory.deploy(60);
        // 等待部署完成
        await fundMe.waitForDeployment();
        console.log(`合约部署完成，合约地址：${fundMe.target}`);
    })

module.exports = {}