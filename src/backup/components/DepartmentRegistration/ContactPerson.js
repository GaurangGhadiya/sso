import { Box, Button, Paper, Grid, Typography, TextField } from "@mui/material";
import { useRef, useState } from "react";

const ContactPerson = ({ handleBack, contactPerson, setContactPerson, activeStep, setActiveStep }) => {


    const house = useRef();
   

    const cpName = useRef();
    const cpDesignation = useRef();
    const cpEmail = useRef();
    const cpMobile = useRef();


    const [error, setError] = useState({});


    const changeHandler = () => {
        setContactPerson({
            
            cpName : cpName.current.value,
            cpDesignation : cpDesignation.current.value,
            cpEmail : cpEmail.current.value,
            cpMobile : cpMobile.current.value,
        })
    }


    const nextHandler = () => {

        const newError = {
            
            cpName : cpName.current.value.length < 1,
            cpDesignation : cpDesignation.current.value.length < 1,
            cpEmail : cpEmail.current.value.length < 1,
            cpMobile : cpMobile.current.value.length < 1,

        };

        setError(newError);

        if (Object.values(newError).every(value => value !== true)) {

            setActiveStep(activeStep + 1);

        }

    }







    return (

        <Paper elevation={1} style={{ padding: '16px', marginTop: '30px' }} >
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="h5">Contact Person Information</Typography>
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.cpName && true} onChange={changeHandler} value={contactPerson.cpName} inputRef={cpName} fullWidth label="Enter contact person Name" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.cpDesignation && true} onChange={changeHandler} value={contactPerson.cpDesignation} inputRef={cpDesignation} fullWidth label="Enter contact person Designation" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.cpEmail && true} onChange={changeHandler} value={contactPerson.cpEmail} inputRef={cpEmail} fullWidth label="Enter contact person Email" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.cpMobile && true} onChange={changeHandler} value={contactPerson.cpMobile} inputRef={cpMobile} fullWidth label="Enter contact person Mobile" variant="standard" />
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
                    Next
                </Button>
            </Box>

        </Paper>

    )
}
export default ContactPerson;