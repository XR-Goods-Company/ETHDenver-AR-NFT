import * as React from "react";
import { Button, Box } from '@mui/material';

const ExternalWallet = (props) => {
    const loginWithWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.send(
                    "eth_requestAccounts"
                );
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