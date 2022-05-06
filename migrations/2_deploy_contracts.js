const OpenPunks = artifacts.require("OpenPunks")

module.exports = async function (deployer) {

    const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_IMAGE_METADATA_CID}/`
    const IPFS_HIDDEN_IMAGE_METADATA_URI = `ipfs://${process.env.IPFS_HIDDEN_IMAGE_METADATA_CID}/hidden.json`
    const NFT_MINT_DATE = new Date(process.env.NFT_MINT_DATE).getTime().toString().slice(0, 10)

    await deployer.deploy(
        OpenPunks,
        process.env.PROJECT_NAME,
        process.env.PROJECT_SYMBOL,
        process.env.MINT_COST,
        process.env.MAX_SUPPLY,
        NFT_MINT_DATE,
        IPFS_IMAGE_METADATA_URI,
        IPFS_HIDDEN_IMAGE_METADATA_URI,
    )
};