const OpenPunks = artifacts.require("./OpenPunks")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('OpenPunks', ([deployer, user]) => {

    const NAME = 'Open Punks'
    const SYMBOL = 'OP'
    const COST = 0
    const MAX_SUPPLY = 1000

    // NOTE: If images are already uploaded to IPFS, you may choose to update the links, otherwise you can leave it be.
    const IPFS_IMAGE_METADATA_URI = 'ipfs://IPFS-IMAGE-METADATA-CID/'
    const IPFS_HIDDEN_IMAGE_METADATA_URI = 'ipfs://IPFS-HIDDEN-METADATA-CID/hidden.json'

    let openPunks

    describe('Deployment', () => {

        let milliseconds = 120000 // Number between 100000 - 999999
        let result, timeDeployed

        beforeEach(async () => {
            const NFT_MINT_DATE = (Date.now() + milliseconds).toString().slice(0, 10)

            openPunks = await OpenPunks.new(
                NAME,
                SYMBOL,
                COST,
                MAX_SUPPLY,
                NFT_MINT_DATE,
                IPFS_IMAGE_METADATA_URI,
                IPFS_HIDDEN_IMAGE_METADATA_URI,
            )

            timeDeployed = NFT_MINT_DATE - Number(milliseconds.toString().slice(0, 3))
        })

        it('Returns the contract name', async () => {
            result = await openPunks.name()
            result.should.equal(NAME)
        })

        it('Returns the symbol', async () => {
            result = await openPunks.symbol()
            result.should.equal(SYMBOL)
        })

        it('Returns the cost to mint', async () => {
            result = await openPunks.cost()
            result.toString().should.equal(COST.toString())
        })

        it('Returns the max supply', async () => {
            result = await openPunks.maxSupply()
            result.toString().should.equal(MAX_SUPPLY.toString())
        })

        it('Returns the max mint amount', async () => {
            result = await openPunks.maxMintAmount()
            result.toString().should.equal('1')
        })

        it('Returns the time deployed', async () => {
            result = await openPunks.timeDeployed()

            if (result > 0) {
                assert.isTrue(true)
            } else {
                console.log(result)
                assert.isTrue(false)
            }
        })

        it('Returns the amount of seconds from deployment to wait until minting', async () => {
            let buffer = 2
            let target = Number(milliseconds.toString().slice(0, 3))
            result = await openPunks.allowMintingAfter()
            result = Number(result)

            // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are 
            // between the buffer zone, we'll pass the test
            if (result > (target - buffer) && result <= target) {
                assert.isTrue(true)
            } else {
                assert.isTrue(false)
            }
        })

        it('Returns how many seconds left until minting allowed', async () => {
            let buffer = 2
            let target = Number(milliseconds.toString().slice(0, 3))
            result = await openPunks.getSecondsUntilMinting()
            result = Number(result)

            // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are 
            // between the buffer zone, we'll pass the test
            if (result > (target - buffer) && result <= target) {
                assert.isTrue(true)
            } else {
                assert.isTrue(false)
            }
        })

        it('Returns current pause state', async () => {
            result = await openPunks.isPaused()
            result.toString().should.equal('false')
        })

        it('Returns current reveal state', async () => {
            result = await openPunks.isRevealed()
            result.toString().should.equal('true')
        })
    })

    describe('Minting', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {
                const NFT_MINT_DATE = Date.now().toString().slice(0, 10)

                openPunks = await OpenPunks.new(
                    NAME,
                    SYMBOL,
                    COST,
                    MAX_SUPPLY,
                    NFT_MINT_DATE,
                    IPFS_IMAGE_METADATA_URI,
                    IPFS_HIDDEN_IMAGE_METADATA_URI,
                )

                result = await openPunks.mint(1, { from: user, value: web3.utils.toWei('0', 'ether') })
            })

            it('Returns the address of the minter', async () => {
                let event = result.logs[0].args
                event.to.should.equal(user)
            })

            it('Updates the total supply', async () => {
                result = await openPunks.totalSupply()
                result.toString().should.equal('1')
            })

            it('Returns IPFS URI', async () => {
                result = await openPunks.tokenURI(1)
                result.should.equal(`${IPFS_IMAGE_METADATA_URI}1.json`)
            })

            it('Returns how many a minter owns', async () => {
                result = await openPunks.balanceOf(user)
                result.toString().should.equal('1')
            })

            it('Returns the IDs of minted NFTs', async () => {
                result = await openPunks.walletOfOwner(user)
                result.length.should.equal(1)
                result[0].toString().should.equal('1')
            })
        })

        describe('Failure', async () => {

            let result

            beforeEach(async () => {
                // Some date in the future
                const NFT_MINT_DATE = new Date("May 6, 2022 15:00:00").getTime().toString().slice(0, 10)

                openPunks = await OpenPunks.new(
                    NAME,
                    SYMBOL,
                    COST,
                    MAX_SUPPLY,
                    NFT_MINT_DATE,
                    IPFS_IMAGE_METADATA_URI,
                    IPFS_HIDDEN_IMAGE_METADATA_URI,
                )
            })

            it('Attempt to mint before mint date', async () => {
                await openPunks.mint(1, { from: user, value: web3.utils.toWei('0', 'ether') }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Updating Contract State', async () => {
        describe('Success', async () => {

            let result

            beforeEach(async () => {
                const NFT_MINT_DATE = Date.now().toString().slice(0, 10)

                openPunks = await OpenPunks.new(
                    NAME,
                    SYMBOL,
                    COST,
                    MAX_SUPPLY,
                    NFT_MINT_DATE,
                    IPFS_IMAGE_METADATA_URI,
                    IPFS_HIDDEN_IMAGE_METADATA_URI,
                )
            })

            it('Sets the cost', async () => {
                let cost = web3.utils.toWei('1', 'ether')
                await openPunks.setCost(cost, { from: deployer })
                result = await openPunks.cost()
                result.toString().should.equal(cost)
            })

            it('Sets the pause state', async () => {
                let isPaused = true // Opposite of the default contract state
                await openPunks.setIsPaused(isPaused, { from: deployer })
                result = await openPunks.isPaused()
                result.toString().should.equal(isPaused.toString())
            })

            it('Sets the reveal state', async () => {
                let isRevealed = false // Opposite of the default contract state
                await openPunks.setIsRevealed(isRevealed, { from: deployer })
                result = await openPunks.isRevealed()
                result.toString().should.equal(isRevealed.toString())
            })

            it('Sets the max batch mint amount', async () => {
                let amount = 5 // Different from the default contract state
                await openPunks.setmaxMintAmount(5, { from: deployer })
                result = await openPunks.maxMintAmount()
                result.toString().should.equal(amount.toString())
            })

            it('Sets the IPFS not revealed URI', async () => {
                let uri = 'ipfs://IPFS-NEW-IMAGE-METADATA-CID/' // Different from the default contract state
                await openPunks.setNotRevealedURI(uri, { from: deployer })
                result = await openPunks.notRevealedUri()
                result.toString().should.equal(uri)
            })

            it('Sets the base extension', async () => {
                let extension = '.example' // Different from the default contract state
                await openPunks.setBaseExtension('.example', { from: deployer })
                result = await openPunks.baseExtension()
                result.toString().should.equal(extension)
            })
        })
    })
})