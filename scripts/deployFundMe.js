// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");
require("dotenv").config();

const VERIFY_FLAG = process.env.VERIFY_FLAG;

async function main() {
    // 创建合约工厂
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log('合约正在部署');
    // 部署合约 只是发送 不包括写入
    const fundMe = await fundMeFactory.deploy(60);
    // 等待部署完成
    await fundMe.waitForDeployment();
    console.log(`合约部署完成，合约地址：${fundMe.target}`);

    // env 会转成 string 来使用 所以使用 'true'
    // console.log(VERIFY_FLAG);

    if ((hre.network.config.chainId == 11155111) && VERIFY_FLAG == 'true') {
        console.log('合约正在验证');
        // 等待几个区块 验证 防止失败
        fundMe.deploymentTransaction().wait(5);

        // 合约地址：0xF556E4dACc52dF541a037546B1F57dF6152AF38c
        // 验证合约
        await hre.run("verify:verify", {
            address: fundMe.target,
            constructorArguments: [60]
        })
        console.log('合约验证完成');
    } else {
        console.log('合约无需验证');
    }

    // 合约交互

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

    const firstBalance = await fundMe.funderToAmount(first.address);
    const secondBalance = await fundMe.funderToAmount(second.address);

    console.log("账户一存入" + ethers.formatEther(firstBalance));
    console.log("账户二存入" + ethers.formatEther(secondBalance));
}


main().then().catch((error) => {
    // 函数传入，相当于接口回调
    console.error(error);
    process.exit(0);
})