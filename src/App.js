import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "./DataContext";
import { AuthService, tryRegisterSW } from "@liquality/wallet-sdk";
import { setupSDK } from "./setupSDK";
import Login from './pages/Login/Login';

import { ERC20Service } from "@liquality/wallet-sdk";
import AccountPage from './pages/Account/AccountPage';

import NFTpage from './pages/NFTPage/NFTpage';

function App() {

  const [loginResponse, setLoginResponse] = useState();
  const [nft, setNft] = useState(false);


  useEffect(() => {
    const init = async () => {
      setupSDK()
      const registration = tryRegisterSW("./serviceworker/sw.js");
    };
    init();
  }, []);

  return (
    <React.Fragment>


      {nft ? <NFTpage nft={nft} /> :
        loginResponse ?
          <AccountPage setNft={setNft} loginResponse={loginResponse}></AccountPage>
          :
          <Login setLoginResponse={setLoginResponse} />
      }


    </React.Fragment >

  );
}

export default App;
