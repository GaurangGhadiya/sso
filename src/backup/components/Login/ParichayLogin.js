import { useState } from "react";
import AadhaarInput from "./AadhaarInput";
import CryptoJS from 'crypto-js';
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import ParichayEmailLogin from "./ParichayEmailLogin";
import ParichayIcon from '../../../public/parichay_icon.png'
import Link from "next/link";


const { Grid, Box, Typography, Divider } = require("@mui/material");

const ParichayLogin = (service_id) => {



    const LoginParichay = () => {
        if (service_id) {
            window.location.href = 'https://sso.hp.gov.in/official/site/login?onboardingapp=' + service_id;

        }
        else {
            window.location.href = 'https://sso.hp.gov.in/official/site/login?onboardingapp=himparivarsso';

        }



    }

    return (
        <Grid spacing={3} container>
            <Grid item xs={12}>

                <Box mt={3} mb={2} display={'flex'} justifyContent={'center'}>

                    <Box textAlign={'center'} sx={{ cursor: 'pointer' }}>
                        <Image alt="parichay_logo" style={{ backgroundColor: '#0088af', cursor: 'pointer', border: '1px solid #eee' }} src={ParichayIcon} height={40} width={100} onClick={LoginParichay} />
                        <Typography color={'#1976d2'} fontWeight={'bold'} variant="body2" textAlign={'center'}>Login With Parichay</Typography>
                    </Box>

                </Box>

                {/* <button style={{ background: "#FFF", borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                    <Image style={{ backgroundColor: '#0088af', cursor: 'pointer', border: '1px solid #eee' }} src={ParichayIcon} height={20} onClick={LoginParichay} />
                    <Typography color={'#1976d2'} fontWeight={'bold'} variant="body2" textAlign={'center'}>Login With Parichay</Typography>

                </button> */}


                <Divider sx={{ mb: 1 }}>
                    <Typography color={'#1976d2'} fontWeight={'bold'} variant="body1" textAlign={'center'}>OR</Typography>
                </Divider>

                <ParichayEmailLogin />

                <Link href={service_id ? `/forgot-iframe?service_id=${service_id}` : "/forgot-password"}   >
                    <Typography mt={2} textAlign={'center'} variant="body2" color={'primary'}>Forgot Password?</Typography>
                    <br />
                </Link>




            </Grid>
        </Grid>

    )
}
export default ParichayLogin;