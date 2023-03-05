import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";

import { Button, Box, Avatar, Typography } from '@mui/material';

import NFTCards from "../NFTPage/NFTCards";

import SendNFT from "./SendNFT";

const NFTCollection = (props) => {


    const [nftCollection, setNftCollection] = useState([])

    const settings = {
        apiKey: "wkpzpi-qA95xJVeqdZCOHfLDIyUjs-Ae",
        network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(settings);

    useEffect(() => {

        const getNFT = async () => {
            const nfts = await alchemy.nft.getNftsForOwner(props.address);
            console.log(nfts)
            setNftCollection(nfts.ownedNfts)
        }


        getNFT()


    }, []);

    //    https://api-goerli.etherscan.io/api
    //    ?module=stats
    //    &action=tokensupply
    //    &contractaddress=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984
    //    &apikey=YourApiKeyToken


    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "30px",
                    gap: "10px"
                }}
            >

                <Typography
                    sx={{
                        fontSize: '1.2rem',
                        fontWeight: "600"
                    }}
                >NFT Collections</Typography>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "30px",
                        marginBottom:"50px",
                        gap: "20px"
                    }}
                >

                    {nftCollection.length > 0 ?
                        nftCollection.map((nft, index) => (
                            <NFTCards key={index} setNft={props.setNft} nft={nft}/>
                        ))
                        :
                        <SendNFT address={props.address}></SendNFT>

                    }

                    {/* {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ele, index) => (

                            <NFTCards key={index} setNft={props.setNft} />
                        ))
                    } */}
                </Box>
            </Box>
        </React.Fragment >
    );
};

export default NFTCollection;