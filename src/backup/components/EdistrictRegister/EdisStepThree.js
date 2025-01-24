import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import StepContainer from "./StepContainer";


const StepThree = ({ handleBack, activeStep, setActiveStep, co, street, lm, loc, vtc, dist, state, pc }) => {
    return (
        <StepContainer>
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="h5">Contact Address</Typography>
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter Care of" value={co} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter Street" value={street} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter Landmark" value={lm} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter locality" value={loc} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter Village/Town/City" value={vtc} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter District" value={dist} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter State" value={state} variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth label="Enter Pincode" value={pc} variant="outlined" />
                </Grid>
            </Grid>




            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>

                <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveStep(activeStep + 1)}
                >
                    Next
                </Button>
            </Box>

        </StepContainer>
    )
}
export default StepThree;