import * as React from "react";
import { useState, useEffect } from "react";
import { AuthService, tryRegisterSW } from "@liquality/wallet-sdk";
import Web3 from "web3";
import { Button, Box, Avatar, Typography, TextField } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';

const LoginWithGoogle = (props) => {
    const [tKey, setTKey] = useState({});
    const [price, setPrice] = useState(1)
    const [inputAddress, setInputAddress] = useState("0x51dF6D1c2534C2Cb9348C4Fbd3227e704BA8cd3C")
    const web3 = new Web3("https://goerli.infura.io/v3/3501a2851ccb4b6c938e8355a1c6c45e")

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


    const createNewWallet = async () => {
        props.setPageState("loading")
        const response = await AuthService.createWallet(tKey, verifierMap);
        const address = response.loginResponse.publicAddress
        const balance = await web3.eth.getBalance(address)
        const longinresponse = {
            balance: Web3.utils.fromWei(balance, 'ether'),
            address,
            email: response.loginResponse.userInfo.email || "unknowing",
            price,
        }
        // console.log({ balance, response, longinresponse })
        props.setLoginResponse(longinresponse);
        props.setPageState(null)
    };


    const logInUsingAddress = async () => {
        const balance = await web3.eth.getBalance(inputAddress)
        const longinresponse = {
            balance: Web3.utils.fromWei(balance, 'ether'),
            address: inputAddress,
            email: "unknowing",
            price,
        }
        props.setLoginResponse(longinresponse);
        props.setPageState(null)
    };

    const handleAddress = (event) => {
        const value = event.target.value;
        setInputAddress(value);
    };
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
                    Login or Create
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
                    value={inputAddress}
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