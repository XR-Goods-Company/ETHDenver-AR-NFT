import * as React from "react";

import { Button, TextField, InputBase, Box, Avatar, Typography, Divider } from '@mui/material';

import NFTCollection from "./NFTCollection";
const AccountPage = (props) => {
    return (
        <React.Fragment>
            <Box
                sx={{
                    position: "absolute",
                    top: '0',
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px"
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px"
                    }}
                >
                    <Avatar alt="XR-Goods-Company" variant="square" src="./assets/images/xrgoodsLogo.svg"
                        sx={{
                            width: 50, height: 50,
                            padding: "10px",
                            "& img": {
                                padding: "10px",
                            }
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >ETHDenver AR NFT</Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: "400"
                    }}
                >Wallet Detials</Typography>
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: "200"
                    }}
                >Network: Goerli Testnet</Typography>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "10px"
                    }}
                >

                    <InputBase id="outlined-basic"
                        variant="filled"
                        value={props.loginResponse.balance}
                        sx={{
                            fontSize: '1.2rem',
                            width: "50%",
                            padding: "0 10px",
                            textAlign: "end",
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >ETH</Typography>
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "10px"
                    }}
                >
                    <InputBase id="outlined-basic"
                        variant="filled"
                        value={`$${props.loginResponse.balance * props.loginResponse.price}`}
                        sx={{
                            width: "50%",
                            padding: "0 10px",
                            textAlign: "end",
                    }}
                />
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >USD</Typography>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "10px"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >Address:</Typography>
                    <InputBase id="outlined-basic"
                        variant="filled"
                        value={props.loginResponse.publicAddress}
                        sx={{
                            width: "50%",
                            padding: "0 10px",
                            backgroundColor: "#ececec"
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "400px",
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "10px"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "600"
                        }}
                    >User Email:</Typography>
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            fontWeight: "200"
                        }}
                    >
                        {props.loginResponse.email}
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        width: '100%',
                    }}
                />
                <NFTCollection setNft={props.setNft} address={props.loginResponse.publicAddress} />

            </Box>

        </React.Fragment >


    );
};

export default AccountPage;