import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardMedia, Chip, CircularProgress, Divider, Grid, IconButton, Input, Modal, Paper, TextField, Typography } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';
import AllServices from './User/AllServices';

import styles from '../Login/Login.module.css'
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CryptoJS from "crypto-js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 30,
    maxHeight: '80vh',
    overflow: 'hidden',
    overflowY: 'auto',
    p: 4,
    borderRadius: 1
};


const Container = (props) => {
    const router = useRouter()
    const [department, setDepartment] = useState([])
    const [loader, setLoader] = useState(false)
    const [search, setSearch] = useState("")

    const getService = async () => {
        setLoader(true)
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-dept-service-count?search=${search}`).then(response => {
            if (response.status === 200 || response.status === "OK") {
              let url = "";
              const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

              var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
              decr = decr.toString(CryptoJS.enc.Utf8);

              let data = {};

              if (decr) {
                try {
                  let json_data = JSON.parse(decr);
                  data = json_data;

                    setDepartment(data)
                    setLoader(false)

                } catch (e) {
                  console.warn(e)
                }
              }



            }

        }).catch(e => {
            setLoader(false)
            console.warn('e', e)
        })
    }
    useEffect(() => {
        // dispatch(getServiceList())

        getService()
    }, [])

    const handleSeach = () => {
        getService()
    }
    const getRandomGradient = () => {
        const gradients = [
            "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
            "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
            "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    // Memoizing the random gradient for each department to prevent rerender
    const randomGradient = useMemo(() => getRandomGradient(), []);

    const tttv =  [
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
        "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
        "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
        "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
        "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
        "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
        "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
        "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    ];

    return (
        <>
            <main className="p-6 space-y-6">

                <Grid
                    container
                    spacing={4}
                    sx={{ padding: 2, marginBottom: 10 }}
                >

                    <Grid item={true} xs={12}  >
                        <Card elevation={10}>
                            <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                flexWrap={"wrap"}
                            >
                                <Typography style={{ color: "#0e8193" }} mb={2} mt={2} ml={2}>
                                    Department Wise Services
                                </Typography>
                                <Box>
                                    <input
                                        style={{
                                            outline: "none",
                                            border: "1px solid gray",
                                            padding: "7px",
                                            marginRight: "10px",
                                            borderRadius: "4px",
                                            fontSize: "16px",
                                            marginTop: "5px",
                                            marginLeft : "10px"
                                        }}
                                        placeholder='Search...'
                                        onChange={(e) => setSearch(e.target.value)}
                                        value={search}
                                    />
                                    <Button variant="contained" size='small' style={{ marginRight: "20px", marginTop: "-4px" }} onClick={() => handleSeach()}>Search</Button>

                                </Box>

                            </Box>

                            <Divider variant="middle" />
                            {loader ?
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"70vh"}><CircularProgress /></Box>
                           : <Grid container spacing={3} style={{ padding: 15 }}
                            >
                                    {department?.length > 0 ? department?.map((v, i) => (
                                        <Grid
                                            key={i}
                                            item
                                            xs={12}
                                            md={3}
                                            mb={2}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => router.push(`/service-list?id=${v?.dept_user_id}`)}
                                            className='outer'
                                        >

                                            <Box
                                                padding={2}
                                                // display={"flex"}
                                                // flexDirection={"column"}
                                                // alignItems={"center"}
                                                // justifyContent={"space-between"}
                                                minHeight={"90%"}
                                                // bgcolor={"#ffffff"}

                                                sx={{
                                                    // background :tttv[i] , // Apply random gradient
                                                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                                    transition: "transform 0.2s, box-shadow 0.2s",
                                                    border: "1px solid #eceff1",
                                                    // "&:hover": {
                                                    //     transform: "translateY(-3px)",
                                                    //     boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                                                    // }
                                                }}
                                            >
                                                <Typography
                                                    fontSize={16}
                                                    height={"100px"}
                                                    fontWeight={"bold"}
                                                >{v?.department_name}</Typography>
                                                <Box display={"flex"} justifyContent={"space-between"} mt={2} alignItems={"center"}>
                                                    <Box mr={2}>

                                                        <Box
                                                            fontSize={20}
                                                            fontWeight={"bold"}
                                                            backgroundColor={"#1976D2"}
                                                            borderRadius={"5px"}
                                                            height={"30px"}
                                                            width={"30px"}
                                                            display={"flex"}
                                                            justifyContent={"center"}
                                                            alignItems={"center"}
                                                            color={"white"}
                                                        >{v?.service_count}</Box>

                                                    </Box>
                                                    <Box>
                                                        <img
                                                            src={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + v?.dept_logo}
                                                            alt={`${v?.department_name} logo`}
                                                            style={{
                                                                background: "white",
                                                                // borderRadius : "100%"
                                                            }}
                                                            height={50}  // Adjust logo size
                                                            width={60}   // Adjust logo size
                                                        />
                                                    </Box>
                                            </Box>



                                            </Box>
                                        </Grid>
                                    )) : <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"70vh"} width={"80vw"} fontSize={20}>
                                            Record Not Found


                                    </Box>}


                                    {/* <div class="scheme-block"><a href="https://beneficiarydata.hp.gov.in/index.php/api/v1/downloadexcel?scheme_name=QmV0aSBIYWkgQW5tb2wgWW9qbmE%3D"><span class="glyphicon glyphicon-download-alt"></span> </a><div class="scheme-view"> <div class="scheme-icon"><img src="/theme/appassets/schemes_logo/hp.png" alt="scheme" /></div><p><span> </span><span class="Count" id="1">148</span><span> </span></p><div class="title-text">Beti Hai Anmol Yojna</div></div></div> */}



                            </Grid>}
                        </Card>
                    </Grid>
                </Grid>
            </main>
            {/* <AllServices /> */}
        </>
    );
};



export default Container;