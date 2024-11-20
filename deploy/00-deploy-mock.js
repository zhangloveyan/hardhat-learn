const { DECIMAL, INITIAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('自动部署 MockV3Aggregator 的脚本合约')
    const { firstAccount } = await getNamedAccounts()
    const { deploy } = deployments

    deploy("MockV3Aggregator", {
        from: firstAccount,
        args: [DECIMAL, INITIAL_ANSWER],
        log: true
    })
    console.log('MockV3Aggregator 部署完成')
}

module.exports.tags = ["all", "mock"]