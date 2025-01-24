import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Cookies from "js-cookie";
import { Container, Box, Typography, Grid, Paper } from "@mui/material";
// import Image from "next/image";
import style from "./AllServices.module.css";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../../redux/actions/alert";
import TopCard from "@/components/TopCard";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { getImagePath } from "../../../../utils/CustomImagePath";


const cardStyle = {
    width: 300,
    margin: 'auto',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Adding a shadow effect
    textAlign: 'center',
};

const contentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px', // Adjust the height as needed
};

let list = [
    {
        name: "acbsdf asjkldnsakjdsad dasdsad ",
        logo: "dukandar",
        service_id: "10111001"
    },
    {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }, {
        name: "acbsdf asjkldnsakjd",
        logo: "dukandar",
        service_id: "10111001"
    }

]


const AllServices = () => {

    const [allServices, setAllServices] = useState({});

    const uid = Cookies.get("uid");

    const dispatch = useDispatch();

    useEffect(() => {


        const getAllServices = async () => {

            if (uid) {
                try {

                    const reqData = {
                        uid
                    }

                    const response = await api.post("/all-services", reqData);

                    if (response.status === 200) {

                        setAllServices(response.data)
                    }

                } catch (error) {
                    if (error?.response?.data?.error) {
                        dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                    } else {
                        dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                    }

                }
            }



        }

        getAllServices();

    }, [uid])


    function openInNewWindow(url) {
        // Open the URL in a new window with specific window features
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

        // Check if the window was successfully opened
        if (newWindow) {
            // Focus the new window (optional)
            newWindow.focus();
        }
    }

    const redirectToService = async (service_id) => {

        const userDetails = await fetch(getImagePath('/api/user-info'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const userDetail = await userDetails.json();

        if (userDetail) {

            const reqData = {
                uid: uid,
                service_id: service_id,
                userDetails: userDetail
            }

            try {
                const response = await api.post("/redirect-to-success", reqData);

                if (response.status === 200) {

                    let url = response.data.success_url;

                    const parameter = 'token=' + response.data.tempToken;

                    if (url.includes('?')) {
                        url += '&' + parameter;
                    } else {
                        url += '?' + parameter;
                    }

                    openInNewWindow(url);
                }
            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }
            }

        }

    }

    return (
        <Card >

            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                <Typography style={{ color: '#0e8193' }} mb={3} mt={2} ml={2}>All Services</Typography>
            </Box>

            {/* <Grid container spacing={3} mb={4} ml={1} mr={2}> */}


            <Grid style={{ paddingRight: 10, paddingLeft: 10, paddingBottom: 20 }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 3, sm: 8, md: 12 }}>


                {(allServices && allServices.length > 0) &&
                    allServices.map((item, index) => (




                        <Grid item zeroMinWidth xs={2} sm={4} md={3} lg={4} key={index} sx={{
                            '&:hover': {
                                transform: 'scale(1.05)', // Scale the card on hover
                            },

                        }} borderRadius={6}>


                            {/* 
                        <Grid key={index} item borderRadius={6} sx={{
                            '&:hover': {
                                transform: 'scale(1.05)', // Scale the card on hover
                            },

                        }}> */}


                            <Grid key={index} onClick={() => redirectToService(item.service_id)} style={{ cursor: 'pointer', }}>

                                {/* <TopCard name={item.name} image={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + item.logo} /> */}


                                <Box display={'flex'} alignItems={'center'} justifyContent={'flex-start'} component={Paper} p={2} style={{}} >

                                    <Box height={60} width={70} display={'flex'} alignItems={'center'} boxShadow={6} style={{ borderRadius: 6, background: "#FFF" }}>
                                        <img key={index} src={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + item.logo} alt={item.name} style={{ maxWidth: 70 }} />
                                    </Box>
                                    <Typography style={{ marginLeft: 10, fontWeight: '200', fontSize: 14, wordWrap: 'break-word' }}  >{item.name}</Typography>
                                </Box>
                            </Grid>

                            {/* 
                            <Box sx={{ boxShadow: 3 }} display={'flex'} alignItems={'center'} justifyContent={'space-between'} component={Paper} p={2} >

                                <Box height={60} width={60} display={'flex'} className={style.allServicesImage} alignItems={'center'}>
                                    <img src={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + item.logo} alt={item.name} style={{ maxWidth: '100%' }} />
                                </Box>
                                <Typography variant="h6" >{item.name}</Typography>
                            </Box> */}
                        </Grid>



                    ))
                }
            </Grid>

        </Card >
    )
}
export default AllServices;