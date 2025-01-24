import { Box, Grid, Container, Typography, Button, Stack } from "@mui/material";
import slide from "../../../../public/slide_1.jpg";
import style from "./Hero.module.css";
import ssoImage from "../../../../public/home/sso.png";
import Himachal_Pradesh_district_map from "../../../../public/home/Himachal_Pradesh_district_map.png";


// import cmImage from "../../../../public/home/Sukhvinder_Singh_CM.jpg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


const Hero = () => {

    const [department, setDepartment] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const dept = Cookies.get('department');
        setDepartment(dept);

        const username = Cookies.get('name');
        setName(username);

    }, [])


    return (

        <Container maxWidth="lg">
            <Box pt={6} pb={6}>
                <Grid container spacing={2}>

                    <Grid item xs={6}>
                        <Image src={ssoImage} alt="" layout="responsive" />
                    </Grid>

                    {/* <Grid item xs={8}>
                        <Image src={ssoImage} alt="" layout="responsive" />
                    </Grid> */}

                    <Grid item xs={6} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        {/* <Image src={Himachal_Pradesh_district_map} alt="" layout="responsive" />  */}




                        {!department && !name ? (
                            <Box>
                                <Typography textAlign={'center'} mb={4} variant="h4">Him Access</Typography>
                                <Box>
                                    <Stack justifyContent={'center'} spacing={3} direction={'row'}>
                                        <Link href="/login"><Button variant="contained">User Login</Button></Link>
                                        <Link href="/department-login"><Button variant="contained">Department Login</Button></Link>
                                    </Stack>
                                </Box>
                            </Box>
                        ) : (
                            <Typography textAlign={'center'} mb={4} variant="h6">Logged in {department ? 'Department' : 'User'}<br /><br /><Link href={department ? '/department/dashboard' : '/dashboard'}><Button variant="outlined">{department ? department : name}</Button></Link></Typography>
                        )}




                    </Grid>
                </Grid>
            </Box>
        </Container>

        // <Box className={style.heroSection} sx={{backgroundImage: 'url(/home/mountains.png)'}}>
        //     <Typography variant="h4">Him Access</Typography>
        // </Box>



    )
}
export default Hero;