import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery, Button, Card, Avatar, AppBar, Toolbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "../components/Login/UserName";
import MobileLogin from "../components/Login/MobileLogin";
import Link from "next/link";
import style from "../components/Login/Login.module.css";
import classNames from "classnames";
import { Login, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "../components/Login/AadhaarLogin";
import ParichayLogin from "../components/Login/ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

import Tabs from '@mui/material/Tabs';
import { getImagePath } from "../../utils/CustomImagePath";
import HeaderUser from "@/components/UI/HeaderUser";
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import ParichayIcon from '../../public/parichay_icon.png'
import Redirect from "@/components/UI/Redirect";


const Root = styled('div')(({ theme }) => ({
     width: '100%',
     ...theme.typography.body2,
     '& > :not(style) ~ :not(style)': {
          marginTop: theme.spacing(2),
     },
}));
const tabStyles = {
     selected: {
          backgroundColor: '#1876D1', // Change this to your desired background color
          '&.Mui-selected': {
               color: 'white', // Change this to your desired text color
               borderBottom: '4px solid white',
               borderRadius: '5px',
          },
          '&:hover': {
               color: 'white', // Change this to your desired text color for hover
          },
     },
};

const paperStyle = {
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
     height: '200px', // Set height as needed
};



const LoginPage = () => {

     const [value, setValue] = useState('1');
     const [valueMaster, setValueMaster] = useState('1');


     const handleChange = (event, newValue) => {

          setValue(newValue);

     };


     const handleChangeMaster = (event, newValue) => {

          setValueMaster(newValue);

     };


     const LoginParichay = () => {
          window.location.href = 'https://sso.hp.gov.in/official/site/login?onboardingapp=himparivarsso';
     }






     // const getIframe = (service_id, service_type) => {
     //     getIframeSSO(service_id, service_type)

     // }

     return (
          <>

               {/* <HeaderUser /> */}

               <Box className={style.fullbg}></Box>
               <Container sx={{ marginTop: 6, marginBottom: 6, position: 'relative' }} >
                    {/* <div class="backdrop"></div> <div id="iframeContainer" class="iframe-container"></div>
                <script src="http://localhost:3000/sso-iframe.js" defer=""></script> */}

                    <Box className={style.backdrop} />

                    <Grid
                         container
                         justifyContent="center" // Centers horizontally
                         alignItems="center" // Centers vertically
                    >
                         <Redirect />

                    </Grid>

               </Container >


          </>

     )
}
export default LoginPage;