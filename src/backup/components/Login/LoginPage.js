import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery, Button, Card, Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "./UserName";
import MobileLogin from "./MobileLogin";
import Link from "next/link";
import style from "./Login.module.css";
import classNames from "classnames";
import { Login, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "./AadhaarLogin";
import ParichayLogin from "./ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

import Tabs from '@mui/material/Tabs';
import { getImagePath } from "../../../utils/CustomImagePath";

import AadhaarIcon from '../../../public/aadhaar.svg'

import MobileIcon from '../../../public/phone_icon.svg'
import EmailIcon from '../../../public/email_icon.svg'
import axios from "axios";



const LoginPage = () => {

    const [value, setValue] = useState('1');
    const [valueMaster, setValueMaster] = useState('1');


    const handleChange = (event, newValue) => {

        setValue(newValue);

    };


    const handleChangeMaster = (event, newValue) => {

        setValueMaster(newValue);

    };








    const isXsScreen = useMediaQuery('(max-width:600px)');
    // const getIframe = (service_id, service_type) => {
    //     getIframeSSO(service_id, service_type)

    // }

    return (
        <>

            <Box className={style.fullbg}></Box>
            <Container maxWidth="md" sx={{ marginTop: 6, marginBottom: 6, position: 'relative' }} >
                {/* <div class="backdrop"></div> <div id="iframeContainer" class="iframe-container"></div>
                <script src="http://localhost:3000/sso-iframe.js" defer=""></script> */}

                <Box className={style.backdrop} />
                <Paper elevation={1} >
                    <Grid container spacing={0}>
                        {/* sx={{ backgroundImage: 'url(/himachal-sso.jpg)' }} */}
                        <Grid display={{ xs: "none", lg: "block", md: "block" }} item md={6} className={classNames({ 'hidden': isXsScreen }, style.loginForImage)}>
                            {/* <div className={style.backDrop}>Himachal Pradesh<br /><span>Him Access</span></div> */}
                            <div>
                                {/* autoPlay={true} */}
                                <Carousel infiniteLoop={true} className={style.newSlider} dynamicHeight={true} showThumbs={false} >
                                    <div>
                                        <img src={getImagePath("/slider1.png")} alt="image1" />
                                    </div>
                                    <div>
                                        <img src={getImagePath("/slider2.png")} alt="image" />
                                    </div>
                                </Carousel>
                            </div>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box style={{ padding: '12px' }}>
                                <Typography marginBottom={2} variant="body1" textAlign={'center'}><b>Him Access</b><br /></Typography>
                                {/* <Divider /> */}


                                <TabContext value={valueMaster}>
                                    <Box sx={{}}>

                                        <TabList sx={{ height: '30px' }} onChange={handleChangeMaster} aria-label="lab API tabs example">
                                            <Tab sx={{ fontSize: '12px' }} iconPosition="start" onChange={(event) => { console.warn(event) }} label={<><input type="radio" checked={valueMaster === '1' && true} />Citizen</>} value="1" />
                                            <Tab sx={{ fontSize: '12px' }} iconPosition="start" onChange={(event) => { console.warn(event) }} label={<><input type="radio" checked={valueMaster === '2' && true} />Government employee</>} value="2" />
                                        </TabList>
                                    </Box>




                                    <TabPanel value="1" sx={{ padding: '0' }}>
                                        <Typography marginBottom={2} sx={{ marginTop: 1 }} variant="body1" textAlign={'center'}><span style={{ color: '#1976d2' }}>Sign in using</span></Typography>


                                        <TabContext value={value}>
                                            <Box sx={{}}>
                                                <Tabs
                                                    value={value}
                                                    onChange={handleChange}
                                                    variant="scrollable"
                                                    scrollButtons
                                                    allowScrollButtonsMobile
                                                    aria-label="scrollable force tabs example"
                                                >
                                                    <Tab sx={{ fontSize: '12px' }} label="Email / UserId" value="1" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Mobile" value="2" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Aadhaar" value="3" />
                                                </Tabs>

                                                {/* <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                    <Tab sx={{ fontSize: '12px' }} label="Email" value="1" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Mobile" value="2" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Aadhaar" value="3" />
                                                </TabList> */}
                                            </Box>

                                            <TabPanel value="1">
                                                <UserName handleChange={handleChange} />
                                            </TabPanel>

                                            <TabPanel value="2">
                                                <MobileLogin handleChange={handleChange} />
                                            </TabPanel>

                                            <TabPanel value="3">
                                                <AadhaarLogin />
                                            </TabPanel>

                                            {/* <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mb={2} >
                                            <Image src={'/aadhaar.svg'} height="50" width="50" />
                                            <Typography onClick={(e) => handleChange(e, '3')} sx={{ cursor: 'pointer' }} variant="body1"><small>Login using Aadhaar?</small></Typography>
                                        </Box> */}





                                            <Link href="/forgot-password">
                                                <Typography textAlign={'center'} variant="body2" color={'primary'}>Forgot Password?</Typography>
                                                <br />
                                            </Link>
                                            <Link href="/registration">
                                                <Typography textAlign={'center'} variant="body2" color={'primary'}>New user? Sign up for Him Access</Typography>
                                            </Link>



                                        </TabContext>

                                    </TabPanel>

                                    <TabPanel value="2" sx={{ padding: '0' }}>
                                        <ParichayLogin />
                                    </TabPanel>

                                </TabContext>





                            </Box>

                        </Grid>
                    </Grid>

                </Paper >

            </Container >

        </>

    )
}
export default LoginPage;