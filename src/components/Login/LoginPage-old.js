import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery } from "@mui/material";
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


    return (
        <>

            {/* <Box className={style.fullbg}></Box> */}
            {/* <Container maxWidth="xl" sx={{ position: 'relative' }} > */}

                <Box className={style.backdrop} />
                <Paper elevation={0} >
                    <Grid container spacing={0}>
                        <Grid item md={8} className={classNames({ 'hidden': isXsScreen }, style.loginForImage)}>
                            {/* <div className={style.backDrop}>Himachal Pradesh<br /><span>Him Access</span></div> */}

                            <div>
                                
                                <Carousel className={style.newSlider} dynamicHeight={true}  showThumbs={false} >
                                    <div>
                                        <img src="/temp2.jpg" alt="image1" />
                                        {/* <p className="legend">Image 1</p> */}

                                    </div>
                                    <div>
                                        <img src="/temp.png" alt="image" />
                                        {/* <p className="legend">Image 1</p> */}

                                    </div>

                                    
                                   
                                </Carousel>
                            </div>

                        </Grid>

                        <Grid style={{overflowY:'auto'}} maxHeight={'87vh'} item xs={12} md={4}>
                            <Paper elevation={0}>
                                <Box mt={4}>

                                    <Typography marginBottom={3} variant="h5" textAlign={'center'}>Sign in to your account</Typography>
                                    <Divider />

                                    <TabContext value={valueMaster}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChangeMaster} aria-label="lab API tabs example">
                                                <Tab iconPosition="start" label={<><input type="radio" checked={valueMaster === '1' && true} />Citizen</>} value="1" />
                                                <Tab iconPosition="start" label={<><input type="radio" checked={valueMaster === '2' && true} />Government employee</>} value="2" />
                                            </TabList>
                                        </Box>

                                        <TabPanel value="1" sx={{ padding: '0' }}>

                                            <TabContext value={value}>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                        <Tab sx={{ fontSize: '12px' }} label="Email" value="1" />
                                                        <Tab sx={{ fontSize: '12px' }} label="Mobile" value="2" />
                                                        <Tab sx={{ fontSize: '12px' }} label="Aadhaar" value="3" />

                                                    </TabList>
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
                            </Paper>

                        </Grid>
                    </Grid>

                </Paper>

            {/* </Container > */}

        </>

    )
}
export default LoginPage;