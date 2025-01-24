import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText, Snackbar, Alert, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Captcha from "@/components/UI/Captcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getImagePath } from "../../../../utils/CustomImagePath";

const UserName = ({ service_id, redirectForLogin, handleChange }) => {

    const route = useRouter();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [term, setTerm] = useState(true);
    const [captcha, setCaptcha] = useState(false);


    const [alert, setAlert] = useState({ open: false, type: false, message: null });

    const [error, setError] = useState({
        username: false,
        password: false,
        term: false
    })

    const submitHandler = async () => {

        const newError = {
            username: userName.length < 1,
            password: otp.length < 1 && password.length < 1,
            otp: password.length < 1 && otp.length < 1,
            term: !term,
        };

        setError(newError);



        if (Object.values(newError).every(value => value !== true) && captcha === true) {
            try {

                const userDetails = await fetch(getImagePath('/api/user-info'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const userDetail = await userDetails.json();

                if (userDetail) {

                    const reqData = {
                        username: userName,
                        password: password,
                        otp: otp,
                        service_id: service_id,
                        userDetails: userDetail
                    }



                    const response = await api.post('/user-login-open', reqData);



                    const responseData = response.data;

                    if (response.status === 200) {

                        let url = responseData.success_url;

                        const parameter = 'token=' + responseData.tempToken;

                        if (url.includes('?')) {
                            url += '&' + parameter;
                        } else {
                            url += '?' + parameter;
                        }

                        if (responseData.redirect_service_id) {
                            url += '&service_id=' + responseData.redirect_service_id;
                        }

                        redirectForLogin(url, responseData.service_logo, responseData.service_name)


                    }

                }


            } catch (error) {

                if (error?.response?.status && error.response.status === 404) {
                    if (error.response.data.error) {
                        setAlert({ open: true, type: false, message: error.response.data.error });

                    }
                }
                else if (error?.response?.status && error.response.status === 403) {
                    if (error.response.data.error) {
                        setAlert({ open: true, type: false, message: error.response.data.error });

                    }
                }

                else {

                    if (error?.response?.data?.error) {
                        setAlert({ open: true, type: false, message: error.response.data.error });
                    } else {
                        setAlert({ open: true, type: false, message: error.message });
                    }

                }

            }
        }

    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });
    };


    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    const [otp, setOTP] = useState('');
    const [loginWithOtp, setLoginWithOtp] = useState(false);

    useEffect(() => {

        setOTP('');
        setPassword('');

    }, [loginWithOtp])

    const sendOtp = async () => {

        if (isValidEmail(userName)) {

            const reqData = {
                userName
            }

            try {

                const response = await api.post("/sent-email-sms", reqData);

                if (response.status === 200) {
                    setAlert({ open: true, type: true, message: "OTP sent to your email address." });
                    setLoginWithOtp(true);
                }

            } catch (error) {

                if (error?.response?.status && error.response.status === 404) {
                    if (error.response.data) {
                        setAlert({ open: true, type: false, message: error.response.data.error });
                    }
                } else {

                    if (error?.response?.data?.error) {
                        setAlert({ open: true, type: false, message: error.response.data.error });
                    } else {
                        setAlert({ open: true, type: false, message: error.message });
                    }
                }

            }

        } else {
            setAlert({ open: true, type: false, message: "Please enter valid email address." });
        }

    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid spacing={3} container>
                <Grid item xs={12}>
                    <TextField required error={error.username && true} value={userName} onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                                setUserName(inputValue);
                            }
                        }
                    } fullWidth label="Email" variant="outlined" />
                </Grid>

                {loginWithOtp ? (
                    <Grid item xs={12}>
                        <Typography onClick={() => setLoginWithOtp(false)} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using Password?</small></Typography>
                        <TextField helperText="OTP sent to your email address." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" />
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Typography onClick={sendOtp} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using OTP?</small></Typography>


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
                                            setPassword(inputValue);
                                        }
                                    }
                                }
                            />
                        </FormControl>

                        {/* <TextField type="password" required error={error.password && true} value={password} onChange={
                            (e) => {
                                const inputValue = e.target.value;
                                if (!/[<>]/.test(inputValue)) {
                                    setPassword(inputValue);
                                }
                            }
                        } fullWidth label="Password" variant="outlined" /> */}

                    </Grid>
                )}

                <Grid item xs={12}>
                    <Captcha captcha={captcha} setCaptcha={setCaptcha} />
                </Grid>

                {/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={<small style={{ fontSize: '11px' }}>I consent to Him Access Terms of use</small>} />

                    {error.term && (<FormHelperText error>Please Accept Terms of use</FormHelperText>)}

                </Grid> */}


                <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={submitHandler}>Sign In</Button>
                </Grid>
            </Grid>

            <Snackbar
                open={alert.open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {alert.message &&
                    <Alert severity={alert.type === true ? 'success' : 'error'}>

                        {alert.message}
                    </Alert>
                }
            </Snackbar>
        </>

    )
}
export default UserName;