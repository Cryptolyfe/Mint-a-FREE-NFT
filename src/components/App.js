import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Web3 from 'web3'

// Import Images + CSS
import twitter from '../images/socials/twitter.svg'
import instagram from '../images/socials/instagram.svg'
import opensea from '../images/socials/opensea.svg'
import showcase from '../images/showcase.png'
import '../App.css'

// Import Components
import Navbar from './Navbar'

// Import ABI + Config
import OpenPunks from '../abis/OpenPunks.json'
import config from '../config.json'

function App() {
	const [web3, setWeb3] = useState(null)
	const [openPunks, setOpenPunks] = useState(null)

	const [supplyAvailable, setSupplyAvailable] = useState(0)

	const [account, setAccount] = useState(null)
	const [networkId, setNetworkId] = useState(null)
	const [ownerOf, setOwnerOf] = useState([])

	const [explorerURL, setExplorerURL] = useState('https://etherscan.io')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [currentTime, setCurrentTime] = useState(new Date().getTime())
	const [revealTime, setRevealTime] = useState(0)

	const [counter, setCounter] = useState(7)
	const [isCycling, setIsCycling] = useState(false)

	const loadBlockchainData = async (_web3, _account, _networkId) => {
		// Fetch Contract, Data, etc.
		try {
			const openPunks = new _web3.eth.Contract(OpenPunks.abi, OpenPunks.networks[_networkId].address)
			setOpenPunks(openPunks)

			const maxSupply = await openPunks.methods.maxSupply().call()
			const totalSupply = await openPunks.methods.totalSupply().call()
			setSupplyAvailable(maxSupply - totalSupply)

			const allowMintingAfter = await openPunks.methods.allowMintingAfter().call()
			const timeDeployed = await openPunks.methods.timeDeployed().call()
			setRevealTime((Number(timeDeployed) + Number(allowMintingAfter)).toString() + '000')

			if (_account) {
				const ownerOf = await openPunks.methods.walletOfOwner(_account).call()
				setOwnerOf(ownerOf)
				console.log(ownerOf)
			} else {
				setOwnerOf([])
			}

		} catch (error) {
			setIsError(true)
			setMessage("Contract not deployed to current network, please change network in MetaMask")
		}
	}

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()
			console.log(accounts)

			if (accounts.length > 0) {
				setAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			const networkId = await web3.eth.net.getId()
			setNetworkId(networkId)

			if (networkId !== 5777) {
				setExplorerURL(config.NETWORKS[networkId].explorerURL)
				setOpenseaURL(config.NETWORKS[networkId].openseaURL)
			}

			await loadBlockchainData(web3, accounts[0], networkId)

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setMessage(null)
			})

			window.ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			})
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	const mintNFTHandler = async () => {
		if (revealTime > new Date().getTime()) {
			window.alert('Minting is not live yet!')
			return
		}

		if (ownerOf.length > 0) {
			window.alert('You\'ve already minted!')
			return
		}

		// Mint NFT
		if (openPunks && account) {
			setIsMinting(true)
			setIsError(false)

			await openPunks.methods.mint(1).send({ from: account, value: 0 })
				.on('confirmation', async () => {
					const maxSupply = await openPunks.methods.maxSupply().call()
					const totalSupply = await openPunks.methods.totalSupply().call()
					setSupplyAvailable(maxSupply - totalSupply)

					const ownerOf = await openPunks.methods.walletOfOwner(account).call()
					setOwnerOf(ownerOf)
				})
				.on('error', (error) => {
					window.alert(error)
					setIsError(true)
				})
		}

		setIsMinting(false)
	}

	const cycleImages = async () => {
		const getRandomNumber = () => {
			const counter = (Math.floor(Math.random() * 1000)) + 1
			setCounter(counter)
		}

		if (!isCycling) { setInterval(getRandomNumber, 3000) }
		setIsCycling(true)
	}

	useEffect(() => {
		loadWeb3()
		cycleImages()
	}, [account]);

	return (
		<div>
			<Navbar web3Handler={web3Handler} account={account} explorerURL={explorerURL} />
			<main>
				<section id='welcome' className='welcome'>

					<Row className='header my-3 p-3 mb-0 pb-0'>
						<Col xs={12} md={12} lg={8} xxl={8}>
							<h1>KRBY Punks</h1>
							<p className='sub-header'></p>
						</Col>
						<Col className='flex social-icons'>
							<a
								href="https://twitter.com/KRBYmusic"
								target='_blank'
								className='circle flex button'>
								<img src={twitter} alt="Twitter" />
							</a>
							<a
								href="https://www.instagram.com/krbymusic/"
								target='_blank'
								className='circle flex button'>
								<img src={instagram} alt="Instagram" />
							</a>
							<a
								href={`${openseaURL}/collection/${config.PROJECT_NAME}`}
								target='_blank'
								className='circle flex button'>
								<img src={opensea} alt="Opensea" />
							</a>
						</Col>
					</Row>

					<Row className='flex m-3'>
						<Col md={5} lg={4} xl={5} xxl={4} className='text-center'>
							<img
								src={`https://gateway.pinata.cloud/ipfs/QmXojk54V9XWiQ8u2jEtE1jMfwjVXfSJ38qiebP3kHKoLr/${counter}.png`}
								alt="Crypto Punk"
								className='showcase'
							/>
						</Col>
						<Col md={5} lg={4} xl={5} xxl={4}>
							{revealTime !== 0 && <Countdown date={currentTime + (revealTime - currentTime)} className='countdown mx-3' />}
							<p className='text'>
								Mint a FREE NFT from a contract I deployed and veiw it on OpenSea!
							</p>
							<a href="#about" className='button mx-3'>Learn More!</a>
						</Col>
					</Row>

				</section>
				<section id='about' className='about'>

					<Row className='flex m-3'>
						<h2 className='text-center p-3'>About the Collection</h2>
						<Col md={5} lg={4} xl={5} xxl={4} className='text-center'>
							<img src={showcase} alt="Multiple Crypto Punks" className='showcase' />
						</Col>
						<Col md={5} lg={4} xl={5} xxl={4}>
							{isError ? (
								<p>{message}</p>
							) : (
								<div>
									<h3>Mint your NFT in</h3>
									{revealTime !== 0 && <Countdown date={currentTime + (revealTime - currentTime)} className='countdown' />}
									<ul>
										<li>1,000 generated punked out images using an art generator</li>
										<li>Free minting on Rinkeby testnet</li>
										<li>Viewable on Opensea shortly after minting</li>
									</ul>

									{isMinting ? (
										<Spinner animation="border" className='p-3 m-2' />
									) : (
										<button onClick={mintNFTHandler} className='button mint-button mt-3'>Mint</button>
									)}

									{ownerOf.length > 0 &&
										<p><small>View your NFT on
											<a
												href={`${openseaURL}/assets/${openPunks._address}/${ownerOf[0]}`}
												target='_blank'
												style={{ display: 'inline-block', marginLeft: '3px' }}>
												OpenSea
											</a>
										</small></p>}
								</div>
							)}
						</Col>
					</Row>

					<Row style={{ marginTop: "100px" }}>
						<Col>
							{openPunks &&
								<a
									href={`${explorerURL}/address/${openPunks._address}`}
									target='_blank'
									className='text-center'>
									{openPunks._address}
								</a>
							}
						</Col>
					</Row>

				</section>
			</main>
			<footer>

			</footer>
		</div>
	)
}

export default App
