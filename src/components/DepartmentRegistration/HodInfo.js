import { Box, Button, Paper, Grid, Typography, TextField } from "@mui/material";
import { useRef, useState } from "react";

const HodInfo = ({ handleBack, hodInfo, setHodInfo, activeStep, setActiveStep, finalSubmit }) => {

   
    const hodName = useRef();
    const hodDesignation = useRef();
    const hodEmail = useRef();
    const hodMobile = useRef();


    const [error, setError] = useState({});


    const changeHandler = () => {
        setHodInfo({
            hodName : hodName.current.value,
            hodDesignation : hodDesignation.current.value,
            hodEmail : hodEmail.current.value,
            hodMobile : hodMobile.current.value,
        })
    }


    const nextHandler = () => {

        const newError = {
            
            hodName : hodName.current.value.length < 1,
            hodDesignation : hodDesignation.current.value.length < 1,
            hodEmail : hodEmail.current.value.length < 1,
            hodMobile : hodMobile.current.value.length < 1,

        };

        setError(newError);

        if (Object.values(newError).every(value => value !== true)) {

            finalSubmit();

        }

    }



    return (

        <Paper elevation={1} style={{ padding: '16px', marginTop: '30px' }} >
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="h5">HOD Information</Typography>
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.hodName && true} onChange={changeHandler} value={hodInfo.hodName} inputRef={hodName} fullWidth label="Enter HOD Name" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.hodDesignation && true} onChange={changeHandler} value={hodInfo.hodDesignation} inputRef={hodDesignation} fullWidth label="Enter HOD Designation" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.hodEmail && true} onChange={changeHandler} value={hodInfo.hodEmail} inputRef={hodEmail} fullWidth label="Enter HOD Email" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.hodMobile && true} onChange={changeHandler} value={hodInfo.hodMobile} inputRef={hodMobile} fullWidth label="Enter HOD Mobile" variant="standard" />
                </Grid>


            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>

                <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={nextHandler}
                >
                    Submit
                </Button>
            </Box>

        </Paper>

    )
}
export default HodInfo;