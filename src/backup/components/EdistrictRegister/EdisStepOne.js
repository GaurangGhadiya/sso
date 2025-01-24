import { Typography, Grid, TextField, Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import StepContainer from './StepContainer';
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getImagePath } from "../../../utils/CustomImagePath";
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';


const StepOne = (
    {
        aadhaarVerified,
        setAadhaarVerified,
        aadhaarNumber,
        setAadhaarNumber,
        setAlert,
        activeStep,
        setActiveStep,
        setName,
        setGender,
        setDob,
        setCo,
        setStreet,
        setLm,
        setLoc,
        setVtc,
        setDist,
        setState,
        setPc,
        reqAadhaar_number
    }
) => {


    const [loading, setLoading] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);


    const [otp, setOtp] = useState('');

    const [tnxID, setTnxID] = useState();

    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);


    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds]);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };


    const getOtp = () => {

        setLoading(true)
        setMinutes(0);
        setSeconds(59);
        setOpen(true)
        const dataToSend = {
            aadhaarNumber: aadhaarNumber
        }

        fetch(getImagePath('/api/aadhaar-otp'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
            },
            body: JSON.stringify(dataToSend), // Convert the data to JSON format
        })
            .then((response) => {
                setOpen(false)
                if (!response.ok) {
                    throw new Error('Failed to post data');

                }
                return response.json();
            })
            .then((data) => {

                setTnxID(data)
                setOtpSent(true);
                setAadhaarVerified(1);

                setLoading(false)

            })
            .catch((error) => {
                // Handle errors

                setLoading(false)

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else if (error?.response?.data) {
                    dispatch(callAlert({ message: error.response.data, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }
            });

    }

    const verifyOTP = () => {


        if (otp.length === 6) {

            setLoading(true)

            const dataToSend = {
                aadhaarNumber: aadhaarNumber,
                otp: otp,
                tnxID: tnxID
            }
            fetch(getImagePath('/api/verify-otp'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify(dataToSend), // Convert the data to JSON format
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Unable to connect to UIDAI Please try again');
                    }
                    return response.json();
                })
                .then((data) => {


                    setName(data.Poi.$.name);
                    setGender(data.Poi.$.gender);
                    setDob(data.Poi.$.dob);



                    setCo(data.Poa.$.co);
                    setStreet(data.Poa.$.street);
                    setLm(data.Poa.$.lm);
                    setLoc(data.Poa.$.loc);
                    setVtc(data.Poa.$.vtc);
                    setDist(data.Poa.$.dist);
                    setState(data.Poa.$.state);
                    setPc(data.Poa.$.pc);

                    setAadhaarVerified(2);


                    setAlert({ open: true, type: true, message: 'Successfully Verified!' })


                    setLoading(false)

                    setActiveStep(activeStep + 1)



                })
                .catch((error) => {
                    // Handle errors

                    setLoading(false)


                    if (error?.response?.data?.error) {
                        dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                    } else if (error?.response?.data) {
                        dispatch(callAlert({ message: error.response.data, type: 'FAILED' }))
                    } else {
                        dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                    }
                });

        }
        else {
            dispatch(callAlert({ message: "Please Enter Correct OTP", type: 'FAILED' }))
        }




    }


    const resetAadhaar = () => {
        setAadhaarNumber("");
        setOtpSent(false);
        setAadhaarVerified(0);
    }


    const handleClick = () => {
        // console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        // console.info('You clicked the delete icon.');
    };



    return (

        <StepContainer loading={loading}>
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant="h5">Verify Aadhaar Number</Typography>
                    <Typography onClick={() => {
                        resetAadhaar()
                    }} textAlign={'right'} style={{ cursor: 'pointer', fontSize: 10, marginTop: 5, color: "#1876d1" }}>Reset Aadhaar Number</Typography>

                </Grid>
                <Grid item xs={12}>

                    <Stack direction="row" spacing={1}>



                        <TextField size="small" type="number" disabled={aadhaarVerified ? true : false} fullWidth label="Enter Aadhaar Number" value={aadhaarNumber} placeholder="Enter Aadhaar Number" variant="outlined" onChange={(e) => {
                            setAadhaarNumber(e.target.value)

                            if (e.target.value > 12) {
                                setOtpSent(false);
                            }
                            else {
                                setAadhaarNumber(e.target.value)

                            }

                        }

                        } />

                        {aadhaarVerified === 2 ?


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
                        <TextField type="number" fullWidth label="Enter OTP" value={otp} placeholder="Enter OTP" variant="outlined" onChange={(e) => setOtp(e.target.value)} />
                    </Grid>
                )}




            </Grid>
            {otpSent && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                    <div className="countdown-text">
                        {seconds > 0 || minutes > 0 ? (

                            <Typography variant="body2" >
                                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds}
                            </Typography>

                        ) : (
                            <Typography variant="body2" component="body2">
                                {" Didn't recieve code?"}
                            </Typography>

                        )}

                        <button
                            disabled={seconds > 0 || minutes > 0}
                            style={{
                                color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
                            }}
                            onClick={getOtp}
                        >
                            Resend OTP
                        </button>
                    </div>

                </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Button
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    color="primary"
                    disabled={aadhaarNumber.length !== 12}
                    onClick={aadhaarVerified === 2 ? () => setActiveStep(activeStep + 1) : aadhaarVerified === 1 ? verifyOTP : getOtp}
                >
                    {aadhaarVerified === 2 ? "Proceed " : aadhaarVerified === 0 ? "Send OTP" : "Verify OTP"}
                </Button>

            </Box>



        </StepContainer>

    )
}
export default StepOne;