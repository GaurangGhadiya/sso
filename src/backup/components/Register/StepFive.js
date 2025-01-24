import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import StepContainer from "./StepContainer";
import { useState } from "react";
import CryptoJS from 'crypto-js';
import api from "../../../utils/api";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';





const StepFour = ({ emailVerifiedStep, setEmailVerifiedStep, handleBack, activeStep, setActiveStep, setAlert, email, setEmail, emailVerified, setEmailVerified, finalSubmit, extra_email }) => {
    let emails_list = ["vijaypremi05@gmail.com", "rajeev_nic@gmail.com", "rajeev_sharma@gmail.com"]

    const [loading, setLoading] = useState(false);


    const [otpSent, setOtpSent] = useState(false);
    const [tempOTP, setTempOTP] = useState();
    const [otp, setOtp] = useState();

    function generateRandomOTP() {
        let otp = '';
        for (let i = 0; i < 5; i++) {
            const digit = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9
            otp += digit;
        }
        return otp;
    }

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        return emailPattern.test(email);
    }


    const sendOtp = async () => {

        setLoading(true)

        if (isValidEmail(email)) {
            const sentOTP = generateRandomOTP();


            const plaintextData = sentOTP;
            const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

            const encryptedData = CryptoJS.AES.encrypt(plaintextData, secretKey).toString();

            const reqData = {
                userName: email,
                // tempID: encryptedData
            }

            const response = await api.post("sent-email-sms", reqData);

            if (response.status === 200) {
                setTempOTP(sentOTP)
                setOtpSent(true)
                setEmailVerifiedStep(1)

                setLoading(false)
            }


        } else {
            setLoading(false)
            setAlert({ open: true, type: false, message: 'Please Enter Correct Email Address!' })
        }

    }

    const verifyMobile = () => {
        if (tempOTP === otp) {
            setTimeout(() => {
                setEmailVerified(true)
                setOtpSent(false)
                setEmailVerifiedStep(2)

                setLoading(false)
            }, 1000);
        } else {
            setLoading(false)
            setAlert({ open: true, type: false, message: 'Please Enter Correct OTP!' })
        }

    }


    return (
        <StepContainer loading={loading}>
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="h5">Verify Email Address</Typography>
                </Grid>


                {emails_list.length > 0 &&

                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {emails_list.map((value, index) => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                                <ListItem
                                    key={value}


                                    disablePadding
                                >
                                    <ListItemButton onClick={handleToggle(value, index)} >
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(value) !== -1}
                                                tabIndex={-1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={value}
                                            secondary={
                                                <>
                                                    {checked.indexOf(value) !== -1 &&
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="green"
                                                            style={{ fontSize: 12 }}
                                                        >
                                                            You have selected this email as a Primary Account
                                                        </Typography>
                                                    }
                                                </>
                                            }
                                        />



                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>}




                <Grid item xs={12}>
                    <TextField disabled={extra_email.length > 0 ? true : false} onChange={(e) => !emailVerified && setEmail(e.target.value)} value={email} helperText={<span style={{ color: `${emailVerified ? 'green' : 'red'}` }}>Email address is {!email && 'Not'} Verified</span>} required fullWidth label="Enter Email Address" placeholder="Enter Email Address" variant="outlined" />
                </Grid>


                {otpSent && (
                    <Grid item xs={12}>
                        <TextField onChange={(e) => setOtp(e.target.value)} fullWidth label="Enter OTP" required placeholder="Enter OTP" variant="outlined" />
                    </Grid>

                )}

            </Grid>


            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>

                <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    disabled={emailVerified === true && false}
                    onClick={emailVerified ? () => finalSubmit() : (otpSent ? verifyMobile : sendOtp)}
                >
                    Next
                </Button>
            </Box>

        </StepContainer>
    )
}
export default StepFour;