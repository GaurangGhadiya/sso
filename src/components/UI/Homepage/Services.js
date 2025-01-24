import { Box, Grid, Typography, Container } from "@mui/material";
import style from "./Hero.module.css";

const Services = () => {
    return (
        <Box pt={6} mt={4} pb={6}>

            <Container maxWidth="md">

                <Grid container spacing={2}>

                    <Grid item xs={6}>

                        <Box className={style.videoContainer}>
                            <video autoPlay muted loop>
                                <source src={'/home/video1v2.mp4'} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    </Grid>


                    <Grid item xs={6} display={'flex'} alignItems={'center'}>

                        <Box>
                            <Typography variant="h4" fontWeight={'bold'} mb={5} textAlign={'left'}>Know Your User</Typography>


                            <Typography variant="body2">Using the Himachal Pradesh Single Sign-On (Him Access) service, you will have access to verified user information for individuals who have logged in through MeriPehchaan. This user data can then be seamlessly leveraged to access a wide range of government services, offering a convenient and efficient means of interaction with these services.</Typography>
                        </Box>

                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
export default Services;