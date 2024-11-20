// // 完整写法
// function deployFunction() {
//     console.log("this is a deploy function")
// }

// module.exports.default = deployFunction

// // 简写1
// module.exports = async (hre) => {
//     const getNamedAccounts = hre.getNameAccounts
//     const deployments = hre.deployments
//     console.log("this is a deploy function")
// }
// const { deployments, getNamedAccounts } = require("hardhat");
// 简写2
module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('开始部署 FundMe 的脚本合约')
    const { firstAccount } = await getNamedAccounts()
    const { deploy } = deployments

    deploy("FundMe", {
        from: firstAccount,
        args: [180],
        log: true
    })
    console.log(`部署的账号是 ${firstAccount}`)
}

module.exports.tags = ["all", "fundme"]