import { Box, Grid, Typography, Container } from "@mui/material";
import style from "./Hero.module.css";

const ServicesTwo = () => {
    return (
        <Box pt={6} pb={6}>

            <Container maxWidth="md">

                <Grid container spacing={2}>


                    <Grid item xs={6} display={'flex'} alignItems={'center'}>

                        <Box>
                            <Typography variant="h4" fontWeight={'bold'} mb={5} textAlign={'left'}>Allow Single Sign-On for Your Users</Typography>


                            <Typography variant="body2">Let users sign on to your service with their Mobile number, Username, Password, and two-factor authentication. This will allow users to access all services with a single login.</Typography>
                        </Box>

                    </Grid>

                    <Grid item xs={6}>

                        <Box className={style.videoContainer}>
                            <video autoPlay muted loop>
                                <source src={'/home/video2v2.mp4'} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    )
}
export default ServicesTwo;