import * as React from "react";

import { Card, CardMedia, CardActions, Typography, CardContent } from '@mui/material';
import { Box, display } from "@mui/system";

const NFTCards = (props) => {

  return (
    <React.Fragment>
      <Box
        onClick={() => { props.setNft(props.nft) }}
        sx={{
          width:"130px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          boxShadow: "0px 0px 3px 2px rgb(34 34 34 / 20%)",
        }}
      >
        <Box
          component="img"
          src={props.nft.rawMetadata.image}
          alt="XR-Googds-Company ar nft image"
          sx={{
            width: "100%",
          }}
        >

        </Box>

        <Typography>{`${props.nft.rawMetadata.attributes[1].value} #${props.nft.tokenId}`}</Typography>
      </Box>

    </React.Fragment >
  );
};

export default NFTCards;