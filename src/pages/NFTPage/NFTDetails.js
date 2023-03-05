import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";




import { Card, CardMedia, CardActions, Typography, CardContent } from '@mui/material';
import { Box, display } from "@mui/system";

import ARButton from "./ARButton";


const settings = {
    apiKey: "wkpzpi-qA95xJVeqdZCOHfLDIyUjs-Ae",
    network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

const NFTDetails = (props) => {
    const address = props.loginResponse.address
    const nftId = props.nft.id
    const [nft, setnft] = useState()
    useEffect(() => {
        const getNFT = async () => {
            const nfts = await alchemy.nft.getNftsForOwner(address);
            for (const nft of nfts.ownedNfts) {
                if (nft.tokenId === nftId) {
                    setnft(nft)
                    console.log(nft)
                    return
                }
            }
        }
        getNFT()

    }, []);


    return (
        <React.Fragment>
            {nft &&
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
                        src={nft.rawMetadata.image}
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
                        >{`NFT Name: ${nft.rawMetadata.attributes[1].value}`}</Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "0.6rem", md: "1rem" }
                            }}>{`NFT contract name: ${nft.contract.name}`}</Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "0.6rem", md: "1rem" }
                            }}
                        >{`token ID: ${nft.tokenId}`}</Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "0.6rem", md: "1rem" }
                            }}
                        >{`token Type: ${props.nft.tokenType}`}</Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "0.6rem", md: "1rem" }
                            }}
                        >{`NFT contract address: ${nft.contract.address}`}</Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: "0.6rem", md: "1rem" }
                            }}
                        >{`Latest Update: ${nft.timeLastUpdated}`}</Typography>
                    </Box>
                </Box>
            }
          {nft && nft.rawMetadata.image &&  <ARButton image={ "./assets/nft/8236.jpg"}></ARButton>}
        </React.Fragment >
    );
};

export default NFTDetails;