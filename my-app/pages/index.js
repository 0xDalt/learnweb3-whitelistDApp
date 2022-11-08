
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const[walletConnected, setWalletConnected] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3modal = useRef();

const getProviderOrSigner = async (needSigner = false) => {
  try{
    const provider = await web3modal.current.connect();
    const web3Provider = new providers.web3Provider(provider);

    const {chainId} =  await web3Provider.getNetwork ();
    if(chainId !==5){ 
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli")
    }
  } catch (err){
    console.error(err)
  }
}

  const connectWallet = async() => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true)
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() =>{
    if(!walletConnected){
      web3modal.current = new Web3Modal ({
      network: "goerli",
      providerOptions: {},
      disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected,]);

  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider
      // No need for the Signer here,
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };
  /**
   *  Checks if the address is in whitelist
   */
   const checkIfAddressIsWhitelisted = async () => {
    try {
    
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };
  


  return (
    <div>
      <head>
        <title> WHitelist-Dapp</title>
        <meta name="description" content="whitelist-Dapp"/>
      </head>
      <div className={styles.main}>
        <h1 className={styles.title}>
          Welcome to 111
        </h1>
        <div className={styles.description}>
          {numberOfWhitelisted} have already joined the whitelist
        </div>
          <div>
          <img className={styles.image} src="img\cryptocurrency_hero.webp"/>
          </div>
        </div>

      <footer className={styles.footer}>

      </footer>
    </div>
    
  );
}
