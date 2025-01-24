import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery } from "@mui/material";
import { useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "./LoginOpen/UserName";
import MobileLogin from "./LoginOpen/MobileLogin";
import Link from "next/link";
import style from "./Login.module.css";
import classNames from "classnames";
import Redirect from "../UI/Redirect";
import AadhaarLogin from "./AadhaarLogin";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


const LoginPageOpen = ({ service_id }) => {

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [waitingPage, setWaitingPage] = useState(false);

    const [secondService, setSecondService] = useState({});

    const redirectForLogin = (url, logo, service_name) => {

        setSecondService({
            logo,
            service_name
        });
        setWaitingPage(true);
        window.location.href = url;


    }

    const isXsScreen = useMediaQuery('(max-width:600px)');

    return (

        <>
            <Box className={style.fullbg}></Box>
            <Container maxWidth="md" sx={{ marginTop: 6, marginBottom: 6, position: 'relative' }} >


                {waitingPage === false ? (
                    <Paper elevation={5} >
                        <Grid container>
                            <Grid item md={6} className={classNames({ 'hidden': isXsScreen }, style.loginForImage)}>
                                {/* <div className={style.backDrop}>Himachal Pradesh<br /><span>Him Access</span></div> */}

                                <div>
                                    {/* autoPlay={true} */}
                                    <Carousel infiniteLoop={true} className={style.newSlider} dynamicHeight={true} showThumbs={false} >
                                        <div>
                                            <img src="/slider1.png" alt="image1" />
                                        </div>
                                        <div>
                                            <img src="/slider2.png" alt="image" />
                                        </div>
                                    </Carousel>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box style={{ padding: '16px' }}>
                                    <Typography marginBottom={2} variant="body1" textAlign={'center'}><b>Him Access</b><br /><span style={{ color: '#1976d2' }}>Sign in using</span></Typography>
                                    <Divider />

                                    <TabContext value={value}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                <Tab label="Email / UserId" value="1" />
                                                <Tab label="Mobile" value="2" />
                                                <Tab label="Aadhaar" value="3" />
                                                {/* <Tab label="Parichay/Gov Emp" value="3" /> */}
                                            </TabList>
                                        </Box>

                                        <TabPanel value="1">
                                            <UserName handleChange={handleChange} redirectForLogin={redirectForLogin} service_id={service_id} />
                                        </TabPanel>

                                        <TabPanel value="2">
                                            <MobileLogin handleChange={handleChange} redirectForLogin={redirectForLogin} service_id={service_id} />
                                        </TabPanel>

                                        <TabPanel value="3">
                                            <AadhaarLogin redirectForLogin={redirectForLogin} service_id={service_id} />
                                        </TabPanel>

                                        <Link href="/forgot-password">
                                            <Typography textAlign={'center'} variant="body2" color={'primary'}>Forgot Password?</Typography>
                                            <br />
                                        </Link>
                                        <Link href="/registration">
                                            <Typography textAlign={'center'} variant="body2" color={'primary'}>New user? Sign up for Him Access</Typography>
                                        </Link>

                                    </TabContext>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                ) : (
                    <Redirect secondService={secondService} />
                )}


            </Container>
        </>


    )
}
export default LoginPageOpen;