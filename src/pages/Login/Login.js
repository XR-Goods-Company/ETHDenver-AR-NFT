import * as React from "react";
import {Box, Avatar, Typography } from '@mui/material';
import LoginWithGoogle from "./LoginWithGoogle";

const Login = (props) => {
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
            fontWeight: "200"
          }}
        >Continue with</Typography>
        <LoginWithGoogle setPageState={props.setPageState} setLoginResponse={props.setLoginResponse} />
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: "200"
          }}
        >External Wallet</Typography>
      </Box>
    </React.Fragment >
  );
};

export default Login;