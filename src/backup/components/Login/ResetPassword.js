import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText, Snackbar, Alert, Typography, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput, Divider } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import CryptoJS from 'crypto-js';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { callAlert } from "../../../redux/actions/alert";
import { useDispatch } from "react-redux";


const ResetPassword = () => {

    const route = useRouter();
    const dispatch = useDispatch();

    const [mobile, setMobile] = useState('');
    const [otp, setOTP] = useState('');
    const [loginWithOtp, setLoginWithOtp] = useState(false);
    const [alert, setAlert] = useState({ open: false, type: false, message: null });

    const [confPassword, setConfPassword] = useState('');
    const [password, setPassword] = useState('');

    const [timer, setTimer] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [show2Password, setShow2Password] = useState(false);

    const [userName, setUserName] = useState('');

    const [seconds, setSeconds] = useState(0);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShow2Password((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [seconds]);


    const [error, setError] = useState({
        mobile: false,
    })

    const submitHandler = async () => {

        setSeconds(59);
        setTimer(true);
        const delay = 60000;
        setTimeout(myFunction, delay);

        const newError = {
            mobile: mobile.length < 1,
        };

        setError(newError);

        if (Object.values(newError).every(value => value !== true)) {

            try {

                const reqData = {
                    mobile
                }

                const response = await api.post('/sent-mobile-sms', reqData);

                if (response.status === 200) {

                    const responseData = response.data;

                    setLoginWithOtp(true)

                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    setAlert({ open: true, type: false, message: error.response.data.error });
                } else {
                    setAlert({ open: true, type: false, message: error.message });
                }
            }


        }
    }


    const finalSubmitHandler = async () => {
        if (confPassword === password) {

            try {
                const reqData = {
                    password,
                    mobile,
                    otp
                }

                const response = await api.post('/update-password', reqData);

                if (response.status === 200) {

                    setAlert({ open: true, type: true, message: 'Your password updated successfully.' });
                    route.push('/login');

                }
            } catch (error) {
                if (error?.response?.data?.error) {
                    setAlert({ open: true, type: false, message: error.response.data.error });
                } else {
                    setAlert({ open: true, type: false, message: error.message });
                }
            }


        } else {
            setAlert({ open: true, type: false, message: 'Your password and confirmation password do not match.' });
        }


    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });
    };



    function myFunction() {
        setTimer(false)
    }



    return (
        <>
            <Grid spacing={2} container >
                <Grid item xs={12} >

                    <TextField style={{ marginBottom: 20 }} required error={error.username && true} value={userName} onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                                setUserName(inputValue);
                            }
                        }
                    } fullWidth label="Email / Username" variant="outlined" />


                    <Divider sx={{ mb: 2 }}>
                        <Typography color={'#1976d2'} fontWeight={'bold'} variant="body1" textAlign={'center'}>OR</Typography>
                    </Divider>


                    <TextField error={error.mobile && true} inputProps={{
                        maxLength: 10,
                    }} required onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (/^[\d+]*$/.test(inputValue)) {
                                setMobile(inputValue);
                            }
                        }
                    } value={mobile} fullWidth label="Mobile" variant="outlined" disabled={loginWithOtp ? true : false} />

                </Grid>

                {loginWithOtp && (

                    <>
                        <Grid item xs={12}>


                            {timer ? (
                                <Typography color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Resend OTP ({seconds} sec)</small></Typography>
                            ) : (
                                <Typography onClick={submitHandler} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Resend OTP</small></Typography>
                            )}

                            <TextField helperText="OTP sent to your mobile number." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" />
                        </Grid>


                        <Grid item xs={12}>


                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"

                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setConfPassword(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl>


                            {/* <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={'password'}

                                    label="Password"

                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setConfPassword(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl> */}
                        </Grid>

                        <Grid item xs={12}>


                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={show2Password ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"

                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setPassword(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl>


                            {/*
                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={'password'}
                                    label="Confirm Password"
                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setPassword(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl> */}
                        </Grid>
                    </>

                )}



                <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={loginWithOtp ? finalSubmitHandler : submitHandler}>Reset Password</Button>
                </Grid>
            </Grid>



            <Snackbar
                open={alert.open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={alert.type === true ? 'success' : 'error'}>
                    {alert.message}
                </Alert>
            </Snackbar>


        </>

    )
}
export default ResetPassword;