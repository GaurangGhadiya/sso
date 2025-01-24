import { Box, Button, Paper, Grid, Typography, TextField } from "@mui/material";
import { useRef, useState } from "react";

const AddressInfo = ({ handleBack, addressInfo, setAddressInfo, activeStep, setActiveStep }) => {


    const house = useRef();
    const street = useRef();
    const lm = useRef();
    const loc = useRef();
    const vtc = useRef();
    const dist = useRef();
    const state = useRef();
    const pc = useRef();


    const [error, setError] = useState({});


    const changeHandler = () => {
        setAddressInfo({
            house: house.current.value,
            street: street.current.value,
            lm: lm.current.value,
            loc: loc.current.value,
            vtc: vtc.current.value,
            dist: dist.current.value,
            state: state.current.value,
            pc: pc.current.value
        })
    }


    const nextHandler = () => {

        const newError = {

            house : house.current.value.length < 1,
            street : street.current.value.length < 1,
            lm : lm.current.value.length < 1,
            loc : loc.current.value.length < 1,
            vtc : vtc.current.value.length < 1,
            dist : dist.current.value.length < 1,
            state : state.current.value.length < 1,
            pc : pc.current.value.length < 1,

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
                    <Typography textAlign={'center'} variant="h5">Address Information</Typography>
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.house && true} onChange={changeHandler} value={addressInfo.house} inputRef={house} fullWidth label="Enter house/flat" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.street && true} onChange={changeHandler} value={addressInfo.street} inputRef={street} fullWidth label="Enter Street" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.lm && true} onChange={changeHandler} value={addressInfo.lm} inputRef={lm} fullWidth label="Enter Landmark" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.loc && true} onChange={changeHandler} value={addressInfo.loc} inputRef={loc} fullWidth label="Enter locality" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.vtc && true} onChange={changeHandler} value={addressInfo.vtc} inputRef={vtc} fullWidth label="Enter Village/Town/City" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.dist && true} onChange={changeHandler} value={addressInfo.dist} inputRef={dist} fullWidth label="Enter District" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.state && true} onChange={changeHandler} value={addressInfo.state} inputRef={state} fullWidth label="Enter State" variant="standard" />
                </Grid>

                <Grid item xs={6}>
                    <TextField error={error.pc && true} onChange={changeHandler} value={addressInfo.pc} inputRef={pc} fullWidth label="Enter Pincode" variant="standard" />
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
export default AddressInfo;