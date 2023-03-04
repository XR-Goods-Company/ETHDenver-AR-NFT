import * as React from "react";
import { useState, useEffect } from "react";
import { AuthService, tryRegisterSW, ERC20Service, AccountService, NftService } from "@liquality/wallet-sdk";
import Web3 from "web3";
import { Button, Box, Avatar, Typography, TextField } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';


console.log(document.location.origin)

const directParams = {
    baseUrl: `${document.location.origin}/serviceworker`,
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

const LoginWithGoogle = (props) => {
    const [tKey, setTKey] = useState({});
    const [price, setPrice] = useState(1)
    const [address,setAddress] = useState("0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C")
    const web3 = new Web3("https://goerli.infura.io/v3/3501a2851ccb4b6c938e8355a1c6c45e")


    useEffect(() => {
        const init = async () => {
            fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
                .then(response => response.json())
                .then(response => {

                    const result = response.USD || 1
                    setPrice(result)

                })
            tryRegisterSW("/serviceworker/sw.js");
            const tKeyResponse = await AuthService.init(directParams);
            setTKey(tKeyResponse);
        };

        init();
    }, []);

    const createNewWalletV1 = async () => {
        const response = await AuthService.createWallet(tKey, verifierMap);
        props.setLoginResponse(response);
        const accountTokensList = await ERC20Service.listAccountTokens(
            response.loginResponse.publicAddress,
            1
        );

        const balanceweb3 = await web3.eth.getBalance(response.loginResponse.publicAddress)

        const balance = await AccountService.getBalance(
            response.loginResponse.publicAddress,
            1
        );
        const nfts = await NftService.getNfts(response.loginResponse.publicAddress, 1);
        console.log(JSON.stringify(nfts));
        console.log({ balanceweb3, balance, nfts })



    };

    const createNewWallet = async () => {
        const response = await AuthService.createWallet(tKey, verifierMap);
        const balance = await web3.eth.getBalance(response.loginResponse.publicAddress)
        const longinresponse = {
            balance: Web3.utils.fromWei(balance, 'ether'),
            publicAddress: response.loginResponse.publicAddress,
            email: response.loginResponse.userInfo.email || " ",
            price,
        }
        console.log({ balance, response, longinresponse })
        props.setLoginResponse(longinresponse);

    };

    const logInUsingGoogleSSO = async () => {
        const response = await AuthService.loginUsingSSO(tKey, verifierMap);

        const balance = await web3.eth.getBalance(response.loginResponse.publicAddress)


        const longinresponse = {
            balance: Web3.utils.fromWei(balance, 'ether'),
            publicAddress: response.loginResponse.publicAddress,
            email: response.loginResponse.userInfo.email || " ",
            price,
        }
        console.log({ balance, response, longinresponse })
        props.setLoginResponse(longinresponse);

    };

    const logInUsingAddress = async () => {

        const balance = await web3.eth.getBalance(address)

        const longinresponse = {
            balance: Web3.utils.fromWei(balance, 'ether'),
            publicAddress: address,
            email:"unknowing",
            price,
        }
        console.log({ balance, longinresponse })
        props.setLoginResponse(longinresponse);

    };


    const handleAddress = (event) => {
        const value = event.target.value;
        setAddress(value);
      };
    // 0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C
    // 0x6051420AA1830eb7fdAf643Ac808A7C9A421543B

    return (
        <React.Fragment>


            <Box
                sx={{
                    width: "100%",
                    maxWidth: "400px",
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                }}
            >

 
                <TextField id="outlined-basic" label="Email" variant="outlined"
                    sx={{
                        width: "70%",
                    }}
                />

                <Button variant="contained"
                    sx={{
                        width: "70%",
                        justifyContent: "space-evenly",
                        fontSize: '1rem',
                        fontWeight: "600",
                        backgroundColor: "linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)"
                    }}
                    onClick={createNewWallet}
                    startIcon={<Avatar alt="XR-Goods-Company" variant="square" src="./assets/images/search.png"
                        sx={{
                            backgroundColor: "white",
                            width: 20, height: 20,
                            padding: "10px",
                            "& img": {
                                padding: "10px",
                            }
                        }}
                    />}>
                    Login or Create With Email
                </Button>
                <Typography
                    sx={{
                        fontSize: '0.7rem',
                        fontWeight: "200"
                    }}
                >Powered by Liquality Wallet SDK</Typography>


                <Typography
                    sx={{
                        fontSize: '1.3rem',
                        fontWeight: "600"
                    }}
                >OR</Typography>
                <TextField id="outlined-basic" label="Wallet Address" variant="outlined"
                value={address}
                onChange={handleAddress}
                    sx={{
                        width: "70%",
                    }}
                />

                <Button variant="contained"
                    sx={{
                        width: "70%",
                        justifyContent: "space-evenly",
                        fontSize: '1rem',
                        fontWeight: "600",
                        backgroundColor: "linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)"
                    }}
                    onClick={logInUsingAddress}
                    startIcon={<WalletIcon 
                        sx={{
                            width: 20, height: 20,
                            padding: "10px",
                            "& img": {
                                padding: "10px",
                            }
                        }}
                    />}>
                    Login With Address
                </Button>
            </Box>
        </React.Fragment >


    );
};

export default LoginWithGoogle;