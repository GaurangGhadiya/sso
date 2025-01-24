import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import StepContainer from "./StepContainer";
import { useState } from "react";
import CryptoJS from 'crypto-js';
import api from "../../../utils/api";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { getImagePath } from "../../../utils/CustomImagePath";
import { encryptBody } from "../../../../utils/globalEncryption";


const StepFour = ({ mobileVerifiedStep, setMobileVerifiedStep, handleBack, activeStep, setActiveStep, setAlert, mobile, setMobile, mobileVerified, setMobileVerified }) => {


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



    const handleClick = () => {
        // console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        // console.info('You clicked the delete icon.');
    };


    function isValidPhoneNumber(phoneNumber) {
        const phonePattern = /^\d{10}$/;

        return phonePattern.test(phoneNumber);
    }

    const sendOtp = async () => {

        setLoading(true)

        if (isValidPhoneNumber(mobile)) {
            const sentOTP = generateRandomOTP();

            const plaintextData = sentOTP;
            const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

            const encryptedData = CryptoJS.AES.encrypt(plaintextData, secretKey).toString();

            const reqData = {
                mobile: mobile,
                tempID: encryptedData
            }

            const response = await api.post(getImagePath("sent-mobile-sms"), { data: encryptBody(JSON.stringify(reqData)) });

            if (response.status === 200) {
                setTempOTP(sentOTP)
                setMobileVerifiedStep(1)
                setOtpSent(true)

                setLoading(false)
            }

        } else {
            setLoading(false)
            setAlert({ open: true, type: false, message: 'Please Enter Correct Mobile Number!' })
        }


    }

    const verifyMobile = () => {

        setLoading(true)

        if (tempOTP === otp) {
            setTimeout(() => {
                setMobileVerified(true)
                setOtpSent(false)
                setMobileVerifiedStep(2)

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
                    <Typography textAlign={'center'} variant="h5">Verify Mobile Number</Typography>
                </Grid>

                <Grid item xs={12}>

                    <Stack direction="row" spacing={1}>


                        <TextField onChange={(e) => !mobileVerified && setMobile(e.target.value)} value={mobile} helperText={<span style={{ color: `${mobileVerifiedStep ? 'green' : 'red'}` }}>Mobile Number is {!mobileVerified && 'Not'} Verified</span>} required fullWidth label="Enter Mobile Number" placeholder="Enter Mobile Number" variant="outlined" />

                        {mobileVerifiedStep === 2 ?


                            <Chip
                                label="Verified"
                                color="success"
                                onClick={handleClick}
                                onDelete={handleDelete}
                                deleteIcon={<TaskAltIcon />}
                            />
                            :

                            <Chip
                                label="Not Verified"
                                color="error"
                                onClick={handleClick}
                                onDelete={handleDelete}
                                deleteIcon={<TaskAltIcon />}
                            />

                        }





                    </Stack>
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
                    disabled={mobileVerified === true && false}
                    onClick={mobileVerifiedStep === 2 ? () => setActiveStep(activeStep + 1) : (mobileVerifiedStep === 1 ? verifyMobile : sendOtp)}
                >
                    Next
                </Button>
            </Box>

        </StepContainer>
    )
}
export default StepFour;