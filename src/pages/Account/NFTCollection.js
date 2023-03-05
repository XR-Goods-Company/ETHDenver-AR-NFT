import React, { useEffect, useState } from "react";

import { NftService } from "@liquality/wallet-sdk";


import { Button, Box, Avatar, Typography } from '@mui/material';

import NFTCards from "../NFTPage/NFTCards";

import SendNFT from "./SendNFT";

const NFTCollection = (props) => {

    const {address} = props

    const [nftCollection, setNftCollection] = useState([])


    useEffect(() => {

        // const getNFT = async () => {
        //     const nfts = await alchemy.nft.getNftsForOwner(props.address);
        //     console.log(nfts)
        //     setNftCollection(nfts.ownedNfts)
        // }
        // getNFT()


        
        const getNFT = async () => {
            const nfts = await NftService.getNfts(address, 5);
            console.log(nfts)
            setNftCollection(nfts)
        }
        getNFT()
    }, []);


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

                    {nftCollection && nftCollection.length > 0 ?
                        nftCollection.map((nft, index) => (
                            <NFTCards key={index} setNft={props.setNft} nft={nft}/>
                        ))
                        :
                        <SendNFT address={props.address}></SendNFT>
                    }
                </Box>
            </Box>
        </React.Fragment >
    );
};

export default NFTCollection;