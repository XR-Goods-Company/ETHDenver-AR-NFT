
import './App.css';
import React, { useState, useEffect } from "react";
import {tryRegisterSW } from "@liquality/wallet-sdk";
import { setupSDK } from "./setupSDK";
import Login from './pages/Login/Login';
import AccountPage from './pages/Account/AccountPage';
import NFTpage from './pages/NFTPage/NFTpage';
import Loading from './pages/Login/Loading';

function App() {
  const [loginResponse, setLoginResponse] = useState();
  const [nft, setNft] = useState(false);
  const [pageState, setPageState] = useState();
  useEffect(() => {
    const init = async () => {
      setupSDK()
      tryRegisterSW("./serviceworker/sw.js");
    };
    init();
  }, []);

  return (
    <React.Fragment>
      {nft ? <NFTpage nft={nft}  loginResponse={loginResponse} /> :
        loginResponse ?
          <AccountPage setNft={setNft} loginResponse={loginResponse}></AccountPage>
          :
          <Login  setPageState={setPageState} setLoginResponse={setLoginResponse} />
      }
      {pageState && <Loading />}
    </React.Fragment >
  );
}

export default App;
