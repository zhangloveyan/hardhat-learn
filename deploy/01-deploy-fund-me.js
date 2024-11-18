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
    const { firstAccount } = await getNamedAccounts()
    const { deploy } = deployments

    deploy("FundMe", {
        from: firstAccount,
        args: [80],
        log: true
    })
    console.log(`first is ${firstAccount}`)
}

module.exports.tags = ["all", "fundme"]