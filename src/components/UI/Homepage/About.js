import { Box, Grid, Typography, Container } from "@mui/material";
import Image from "next/image";
import knowmore from "../../../../public/home/knowmore.svg";

const About = () => {
    return (

        <Box pt={8} pb={6} bgcolor={'#e8f8ff'}>

            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={'bold'} mb={5} textAlign={'center'}>About Him Access</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6} display={'flex'} alignItems={'center'}>

                        <Box>
                            <Typography variant="body2"><b>Him Access (Single Sign-On)</b> is a robust user authentication system that allows individuals to access various online applications and services using a single set of credentials. This streamlined approach provides significant advantages for both users and application administrators.</Typography>

                            <Typography variant="body2">For users, Him Access simplifies the authentication process by eliminating the need to repeatedly verify their identities for different applications and maintain multiple sets of login credentials. This not only enhances convenience but also bolsters security by distinguishing legitimate applications from fraudulent ones.</Typography>

                            <Typography variant="body2">Meanwhile, for application administrators, Him Access offers substantial time and cost savings. It removes the burden of developing separate authentication systems for each service, allowing for a more efficient and cost-effective management of online applications.</Typography>
                        </Box>

                    </Grid>
                    <Grid item xs={6}>
                        <Image src={knowmore} alt="" layout="responsive" />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
export default About;