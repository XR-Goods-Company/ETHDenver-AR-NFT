import * as React from "react";
import { CircularProgress, Box, Avatar, Typography } from '@mui/material';
const Loading = () => {
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
                <Box
                    sx={{
                        height: "60%",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        width: "100vw",
                        background: "#ffffff",
                        zIndex: "100",
                    }}
                >
                    <Typography
                    >Loading Data, Please Wait</Typography>
                    <CircularProgress />
                </Box>
            </Box>
        </React.Fragment >
    );
};
export default Loading;