import * as React from "react";
import { Button, Box, Avatar, Typography } from '@mui/material';
import Web3 from "web3";

const ExternalWallet = (props) => {

    const loginWithWallet = async () => {
        // const response = await AuthService.loginUsingSSO(tKey, verifierMap);
        // const web3 = new Web3("https://goerli.infura.io/v3/3501a2851ccb4b6c938e8355a1c6c45e")
        //     // await window.eth.send('eth_requestAccounts');
            
        // console.log(web3)

        if (window.ethereum) {
            try {
                // Request account access if needed
                const accounts = await window.ethereum.send(
                    "eth_requestAccounts"
                );
            console.log({accounts})
            } catch (error) {
                console.log(error)
            }
        }
    };



    return (
        <React.Fragment>



            <Box
                sx={{
                    width: "100%",
                    maxWidth: "400px",
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button variant="contained"
                onClick={loginWithWallet}
                    sx={{
                        width: "70%",
                        justifyContent: "space-evenly",
                        fontSize: '1rem',
                        fontWeight: "600",
                    }}>
                    Connet with Wallet
                </Button>

            </Box>
        </React.Fragment >


    );
};

export default ExternalWallet;