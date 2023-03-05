import * as React from "react";

import { Button, Box, Avatar, Typography,Divider } from '@mui/material';

const SendNFT = (props) => {
    return (
        <React.Fragment>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px"
                }}
            >
            <Typography>You Dont have any NFT</Typography>
            <Typography>Send NFT to this adress:</Typography>
            <Typography
            sx={{
                textDecoration:"underline",
                fontSize:'0.6rem'
            }}
            >{props.address}</Typography>
            <Typography>Or shop on marketplace: 
                <a href="https://opensea.io" target="_blank" >OpenSea </a>
                </Typography>
            </Box>
        </React.Fragment >
    );
};
export default SendNFT;