import { Login, Style } from "@mui/icons-material";
import { Box, Container, LinearProgress, Paper, Typography } from "@mui/material";
import Image from "next/image";
import style from "./Header.module.css";
import CircularProgress from '@mui/material/CircularProgress';


const Redirect = ({ secondService }) => {
    return (
        <Container >
            <Box
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>


                <Typography variant="body2" mb={5} mt={4} textAlign={'center'} >Please wait...  <br />You are being redirected </Typography>


                {/* <Box className={style.loaderRedirect}></Box> */}



            </Box>
        </Container>
    )
}
export default Redirect;