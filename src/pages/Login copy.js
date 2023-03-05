import * as React from "react";
import { useState, useEffect } from "react";
import { AuthService, tryRegisterSW, ERC20Service, AccountService, NftService } from "@liquality/wallet-sdk";
import Web3 from "web3";


const directParams = {
  baseUrl: `http://localhost:3000/serviceworker`,
  enableLogging: true,
  networkUrl: "https://goerli.infura.io/v3/a8684b771e9e4997a567bbd7189e0b27",
  network: "testnet",
};

const verifierMap = {
  google: {
    name: "Google",
    typeOfLogin: "google",
    clientId:
      "64832699752-k4vhbfabig26msb1j89r1i5cervstedp.apps.googleusercontent.com",
    verifier: "XR-Goods-Company",
  },
};

const Login = (props) => {
  const [tKey, setTKey] = useState({});
  const [loginResponse, setLoginResponse] = useState({});
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordResponse, setPasswordResponse] = useState("");
  const [newPasswordShare, setNewPasswordShare] = useState({});
  const [nfts, setNfts] = useState([]);

  const web3 = new Web3("https://goerli.infura.io/v3/3501a2851ccb4b6c938e8355a1c6c45e")

  useEffect(() => {
    const init = async () => {
      tryRegisterSW("/serviceworker/sw.js");
      const tKeyResponse = await AuthService.init(directParams);
      setTKey(tKeyResponse);

    };

    init();
  }, [loginResponse, passwordResponse]);

  const createNewWallet = async () => {
    const response = await AuthService.createWallet(tKey, verifierMap);
    setLoginResponse(response);

    const accountTokensList = await ERC20Service.listAccountTokens(
      response.loginResponse.publicAddress,
      1
    );


    const balance = await AccountService.getBalance(
      response.loginResponse.publicAddress,
      1
    );
    console.log(balance);

    const balance2 = await web3.eth.getBalance(response.loginResponse.publicAddress)


const nfts = await NftService.getNfts(response.loginResponse.publicAddress, 1);
console.log(JSON.stringify(nfts));
setNfts(nfts);

console.log({ nfts,balance,balance2, response, accountTokensList })
  };

// 0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C
// 0x6051420AA1830eb7fdAf643Ac808A7C9A421543B


const _renderPasswordInput = () => {
  return (
    <div>
      Set password minimum 10 characters:
      <input
        type="password"
        placeholder="Address"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br></br>
      {errorMsg ? <p style={{ color: "red" }}> {errorMsg}</p> : null}
      {passwordResponse.startsWith("Error") ? (
        <p style={{ color: "red" }}> {passwordResponse}</p>
      ) : (
        <p style={{ color: "green" }}>{passwordResponse}</p>
      )}
    </div>
  );
};

const _renderCreatedWalletDetails = () => {
  return (
    <div>
      <h3 style={{ color: "green" }}>
        Your wallet was created successfully!
      </h3>
      <p>
        <b>Public Address:</b> <br></br>
        {loginResponse.loginResponse?.publicAddress}
      </p>
      <p>
        <b>Private Key:</b> <br></br>
        {loginResponse.loginResponse?.privateKey}
      </p>
      <p>
        <b>User email:</b> <br></br> {loginResponse.loginResponse?.userInfo?.email}
      </p>
    </div>
  );
};

return (
  <div style={{ border: "1px solid black", padding: 10 }}>
    <h3>Liquality & tKey Create Wallet</h3>
    <button onClick={createNewWallet}>Create Wallet</button>
    {loginResponse.loginResponse ? _renderCreatedWalletDetails() : null}
    {loginResponse.loginResponse ? _renderPasswordInput() : null}
  </div>
);
};

export default Login;