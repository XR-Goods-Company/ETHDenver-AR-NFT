import * as React from "react";

import { Card, CardMedia, CardActions, Typography, CardContent } from '@mui/material';
import { Box, display } from "@mui/system";

const NFTDetails = (props) => {



    console.log(props.nft)

    return (
        <React.Fragment>
            <Box
                sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "50px 20px"

                }}
            >

                <Box
                    component="img"
                    src={props.nft.rawMetadata.image}
                    alt="XR-Googds-Company ar nft image"
                    sx={{
                        width: { xs: "70px", md: "150px" },
                        padding: "10px",

                        boxShadow: "0px 0px 3px 2px rgb(34 34 34 / 20%)",
                    }}
                >
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        paddingLeft: "30px",
                        maxWidth: "300px",
                        gap: "5px",

                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "0.6rem", md: "1rem" }
                        }}
                    >{`NFT Name: ${props.nft.rawMetadata.attributes[1].value}`}</Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.6rem", md: "1rem" }
                        }}>{`NFT contract name: ${props.nft.contract.name}`}</Typography>
                    <Typography
                        sx={{
                            fontSize: {xs: "0.6rem", md: "1rem" }
                        }}
                    >{`token ID: ${props.nft.tokenId}`}</Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.6rem", md: "1rem" }
                        }}
                    >{`token Type: ${props.nft.tokenType}`}</Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.6rem", md: "1rem" }
                        }}
                    >{`NFT contract address: ${props.nft.contract.address}`}</Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.6rem", md: "1rem" }
                        }}
                    >{`Latest Update: ${props.nft.timeLastUpdated}`}</Typography>

                </Box>


            </Box>

        </React.Fragment >
    );
};

export default NFTDetails;