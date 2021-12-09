import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";
import {ethers} from 'ethers';
import myEpicNft from './utils/MyEpicNFT.json';

const GALLERY_LINK = '';
const CONTRACT_ADDRESS = "0x1e4A7c017913b516069bBa5a134bBDFD54C2239d"

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [NFTLimitReached, setNFTLimitReached] = useState(false); 
  const [minting, setMinting] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const {ethereum } = window;
    if(!ethereum){
      console.log("Connect to MetaMask!")
      return;
    } else {
      console.log("Connected!")
    }

    const accounts = await ethereum.request({
      method: 'eth_accounts'
    })

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const askContractToMintNft = async () => {

    
  const CONTRACT_ADDRESS ="0x1e4A7c017913b516069bBa5a134bBDFD54C2239d";
  try {
    const { ethereum } = window;

    if (ethereum) {
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      const ropstenChainId = "0x3"; 
      if (chainId !== ropstenChainId) {
        alert("You are not connected to the Ropsten Test Network!");
        return
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
      try {
        await connectedContract.getTotalNFTsMinted();
      } catch (error){
        setNFTLimitReached(true)
        return 
      }
      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeNFT();

      console.log("Mining...please wait.")
      setMinting(true)
      await nftTxn.wait();
      setMinting(false)
      console.log(`Mined, see transaction: https://ropsten.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}


  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {!minting && (<div>
           {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              {!NFTLimitReached ? "Mint NFT" : "Sorry, all NFTs are taken!"}
            </button>
          )}
          </div>
          )}
          {minting ? <p className="sub-text">Currently minting... hang tight!</p> : null}
          <p className="sub-text">Check out the <a href="https://ropsten.rarible.com/collection/0x1e4a7c017913b516069bba5a134bbdfd54c2239d" target="_blank">collection</a></p>
        </div>
      </div>
    </div>
  );
};

export default App;
