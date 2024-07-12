import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import styled from 'styled-jsx'

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [val, setValue] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const handleInputChange = (event) =>{
    setValue(event.target.value);
  }

  const deposit = async() => {
    if (atm) {
      const amount = parseInt(val);
      console.log(amount);
      if (amount){
        let tx = await atm.deposit(amount);
        await tx.wait()
        getBalance();
      }
      else{
        console.log("Unidentifiable Amount")
      }
    }
  }

  const emptybalance = async() =>{
    if (atm){
      let tx = await atm.emptybalance();
      await tx.wait();
      getBalance();
    }
  }
  
  const withdraw = async() => {
    if (atm) {
      const amount = parseInt(val);
      console.log(amount);
      if (amount){
        let tx = await atm.withdraw(amount);
        await tx.wait();
        getBalance();
      }
      else{
        console.log("Unidentifiable Amount")
      }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p color="white">Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{color:'white',background:'transparent'}}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div className = "initcontent-user">
        <div className = 'account-info'>
          <p style={{display:'flex',fontFamily:'Verdana',color:'white',fontSize:'30px',background:"rgb(0,0,0,0.25)"}}>Account Credentials</p>
          <p id = "accnt" style={{display:'flex', color:'white', fontFamily:'Verdana'}}><img src='https://www.pngmart.com/files/10/User-Account-PNG-Clipart.png' width='30px'height='30px'style={{paddingRight:'10px'}}></img>        {account}</p>
          <p style={{display:'flex', color:'white', fontFamily:'Verdana'}}><img src='https://creazilla-store.fra1.digitaloceanspaces.com/icons/3198868/eth-icon-md.png' width='30px'height='30px'style={{paddingRight:'10px'}}></img> {balance}</p>
        </div>
        <div className = 'balance-buttons'>
          <form>
          <input required type = 'number' value={val} onChange={handleInputChange}></input>
          <button type="button" onClick = {deposit}>Deposit</button>
          <button type='button' onClick = {withdraw}>Withdraw</button>
          <button type='button' onClick = {emptybalance}>Empty Balance</button>
          </form>
        </div>
        <style jsx>
          {
            `
            .initcontent-user {
            display:grid;
            grid-template-columns: 1fr 2fr;
            justify-content:center;
            align-items:center;
            grid-template-areas:
            "account-info balance-buttons"
          }
          .account-info{
            grid-area:account-info;
            background:rgb(0,0,0,0.3);
            border-radius:20px;
            margin:5px;
          }
          .balance-buttons{
            grid-area:balance-buttons;
            margin:10px;
          }
          button{
            padding :20px;
            border:none;
            border-bottom: solid #31bfc2;
            background:transparent;
            color:lightblue;
            transition:ease-out 0.1s;
            margin-left:50px;
          }
            button:hover{
              background:#2294c3;
              transition: ease-in 0.1s;
              border-radius:10px;
              cursor:pointer;
            }
            button:active{
              background:#1c6e90;
            }
              input[type='number']{
              padding:10px;
              width:3%
              }
              input[type='number']:focus{
                width:15%;
                transition: ease-in 0.2s;
              }
            p{
            align-items:center;
            justify-content:center;
            }
            `
          }
        </style>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
  // the html thing
    <main className="container">
      <header><h1>Truly Amazing ETH ATM!</h1></header>
      {initUser()}
      <style jsx>{`
      .container {
          height:100vh;
          background: linear-gradient(180deg, rgba(12,43,45,1) 10%, rgba(60,50,173,1) 45%, rgba(24,169,179,1) 100%);
          margin:-10px;
      }
      header {
          text-align:center;
          font-family:Verdana, Geneva, Tahoma, sans-serif;
          font-size: larger;
          background-image: transparent;
          margin: 0;
          padding: 25px;
          color:white;
      }
          h1{
          border-color: white;
          border-style: solid none solid none;
          padding: 10px 0 10px 0;
          }
      `}
      </style>
    </main>
  )
}
