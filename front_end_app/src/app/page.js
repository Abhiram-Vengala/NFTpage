"use client";
import Image from "next/image";
import styles from "./mylayout.css";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import CoolNFT from "../artifacts/contracts/CoolNFT.sol/CoolNFT.json";

export default function Home() {
  const [provider, setprovider] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const signer = provider.getSigner();
        const Addr = await signer.getAddress();
        console.log(Addr);
        setAddress(Addr);

        let contractAddres = "0x275754795231030103Bb0a826E90f89409a27055";

        const contract = new ethers.Contract(contractAddres, CoolNFT.abi, signer);

        console.log(contract);
        setContract(contract);
        address && getBalance();
      }
    };
    provider && loadProvider();
  }, []);
  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log(accounts[0]);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("please install metamask");
    }
  }
  const nft = async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log(name, symbol);
    setName(name);
    setSymbol(symbol);
    const totalSupply = await contract.maxsupply();
    const remainingSupply = await contract.totalSupplied();
    console.log(ethers.BigNumber.from(totalSupply).toNumber(), ethers.BigNumber.from(remainingSupply).toNumber());
    setTotal(ethers.BigNumber.from(totalSupply).toNumber());
    setRemaining(ethers.BigNumber.from(remainingSupply).toNumber());
  }
  nft();
  const safeMint = async () => {
    const mint = await contract.safeMint("https://gateway.pinata.cloud/ipfs/QmdaWnm5V1a9fK7bNqUh2Ah33z38rTKPTZ4w9oKvPTJhDq", { value: ethers.utils.parseEther("0.01") });
    console.log(mint);
    alert("You have minted an nft");
  }

  return (
    <main className={styles.main}>
      <div className="Box">
        <div className='wallet'>
          <div className="left">
            <span id="total">Total NFT'S : {total}</span>
            <span id="rem">Remaining NFT'S : {remaining}</span>
          </div>
          <button onClick={connectWallet} className='wallet_button'>Connect Wallet</button>
        </div>
        <div className="nft">
        <img src="https://gateway.pinata.cloud/ipfs/QmdaWnm5V1a9fK7bNqUh2Ah33z38rTKPTZ4w9oKvPTJhDq" id="imgae"></img>
        <p id="nftname">Name: {name}</p>
        <p id="nftname"> Symbol : {symbol}</p>
        <button onClick={safeMint} className="mint">Mint 0.01 ETH</button>
        </div>
      </div>
    </main>
  );
}
