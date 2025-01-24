import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText, Snackbar, Alert, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../../../utils/api";
import Captcha from "@/components/UI/Captcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import CryptoJS from 'crypto-js';
import { getImagePath } from "../../../../utils/CustomImagePath";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const stylesCSS = {
            input: {
                        "& input[type=number]": {
                                    MozAppearance: "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0,
                        },
            }
}


const UserNameIframe = ({ service_id, handleChange, redirectForLogin }) => {

            const route = useRouter();
            const childRef = useRef();

            const [userName, setUserName] = useState('');
            const [password, setPassword] = useState('');
            const [term, setTerm] = useState(true);
            const [captcha, setCaptcha] = useState(false);

            const [loading, setLoading] = useState(false);

            const handleLoaderClose = () => {
                        setLoading(false);
            };
            const handleLoaderOpen = () => {
                        setLoading(true);
            };


            const [alert, setAlert] = useState({ open: false, type: false, message: null });

            const [error, setError] = useState({
                        username: false,
                        password: false,
                        term: false
            })

            const handleRefreshButtonClick = () => {
                        // Handle the captcha refresh button click in the parent component
                        if (childRef.current && childRef.current.refreshCaptcha) {
                                    childRef.current.refreshCaptcha();
                        }
            };


            async function getUser(user_url, service_id, user_name) {
                        try {
                                    const formData = new URLSearchParams();
                                    formData.append('service_id', service_id);
                                    formData.append('user_name', user_name);
                                    formData.append('password', CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString());
                                    // formData.append('login_type', "");




                                    const response = await axios.post(user_url, formData, {
                                                headers: {
                                                            'Content-Type': 'application/x-www-form-urlencoded'
                                                }
                                    });

                                    if (response.data) {
                                                // const { userList } = response.data || {};


                                                if (response.data) {
                                                            return response.data;
                                                }
                                                // if (userList) {
                                                //     if (userList && userList.length > 0) {
                                                //         return userList[0];
                                                //     }
                                                // }


                                    }

                                    else if (response.data.statusCode === '300') {
                                                return response.data.statusDesc
                                    }

                                    else if (response.data.statusCode === '400') {
                                                return response.data.statusDesc
                                    }




                                    return null; // Return null if no data or statusCode isn't '200 OK'
                        } catch (error) {

                                    setLoading(false)

                                    if (error?.response?.status && error.response.status === 400) {
                                                handleRefreshButtonClick();
                                                setAlert({ open: true, type: false, message: error?.response?.data.error });

                                    }
                                    else if (error?.response?.status && error.response.status === 500) {
                                                handleRefreshButtonClick();
                                                setAlert({ open: true, type: false, message: error?.response?.data?.error });

                                    }

                                    else {
                                                handleRefreshButtonClick();
                                                setAlert({ open: true, type: false, message: error?.response?.data.error });

                                    }



                                    return null; // Return null in case of an error
                        }
            }



            const checkUser = async () => {

                        try {

                                    const reqData = {
                                                service_id: service_id,
                                    }


                                    const responseURL = await api.post('/checkUserUrl', reqData);


                                    if (responseURL.status === 200) {

                                                const responseData = responseURL.data;

                                                if (responseData.user_check_api) {

                                                            const reqCLData = {
                                                                        service_id: service_id,
                                                                        user_name: userName
                                                            }


                                                            getUser(responseData.user_check_api, service_id, userName)
                                                                        .then((user) => {
                                                                                    // const { aaadharNo, dob, firstName, gender, id, lastName, middleName, mobileNo, userName, userPassword, email } = user || {};

                                                                                    var currentTime = new Date();

                                                                                    // Calculate the expiration time (current time + 10 minutes)
                                                                                    var expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);


                                                                                    const { singleRowData, primaryUsersArray, secondaryUsersArray } = user || {};

                                                                                    const { firstName, middleName, lastName, gender, dob, UserCredentialsArray, aaadharNo, email, userPassword, mobileNo, ssoId } = singleRowData || {}


                                                                                    // if (ssoId) {

                                                                                    //     Cookies.set('sso_id', ssoId ? ssoId : 0, { sameSite: 'None', secure: true });


                                                                                    // }
                                                                                    if (singleRowData) {

                                                                                                Cookies.set('user_info', JSON.stringify(singleRowData), { expires: expirationTime, sameSite: 'None', secure: true });
                                                                                    }

                                                                                    if (user) {
                                                                                                Cookies.set('user_data', JSON.stringify(user), { expires: expirationTime, sameSite: 'None', secure: true });
                                                                                    }
                                                                                    if (UserCredentialsArray) {
                                                                                                // Cookies.set('credentials_array', JSON.stringify(UserCredentialsArray), { sameSite: 'None', secure: true });
                                                                                    }

                                                                                    if (primaryUsersArray) {
                                                                                                Cookies.set('primary_user_array', JSON.stringify(primaryUsersArray), { expires: expirationTime, sameSite: 'None', secure: true });
                                                                                    }
                                                                                    if (secondaryUsersArray) {
                                                                                                Cookies.set('secondary_user_array', JSON.stringify(secondaryUsersArray), { expires: expirationTime, sameSite: 'None', secure: true });
                                                                                    }


                                                                                    // Cookies.set('user_data', JSON.stringify(user));




                                                                                    let primary_user = {};

                                                                                    if (UserCredentialsArray) {




                                                                                                // for (let i = 0; i < UserCredentialsArray.length; i++) {
                                                                                                //     if (UserCredentialsArray[i].primaryUser) {
                                                                                                //         primary_user = UserCredentialsArray[i];
                                                                                                //     }

                                                                                                // }



                                                                                                setLoading(false);
                                                                                                // return user;

                                                                                                const peram = `?service_id=${service_id ? service_id : ""}&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${mobileNo ? mobileNo : ""}&email=${JSON.stringify(email ? email : "")}&userName=${userName ? userName : ""}&userPassword=${userPassword ? userPassword : ""}&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${dob ? dob : ""}&umap=${UserCredentialsArray ? JSON.stringify(UserCredentialsArray) : ""}&umap_var=${email ? JSON.stringify(email) : ""}&username=${userName ? userName : ""}&primary_user=${primary_user ? JSON.stringify(primary_user) : ""}`;
                                                                                                route.push('/registration-iframe' + peram)


                                                                                    }


                                                                        })
                                                                        .catch((error) => {
                                                                                    setLoading(false);
                                                                                    if (error?.response?.status && error.response.status === 300) {
                                                                                                handleRefreshButtonClick();
                                                                                                setAlert({ open: true, type: false, message: error?.response?.data });

                                                                                    }

                                                                                    if (error?.response?.status && error.response.status === 400) {
                                                                                                handleRefreshButtonClick();
                                                                                                setAlert({ open: true, type: false, message: error?.response?.data });

                                                                                    }


                                                                                    console.error('Error occurred while getting user:', error);
                                                                        });


                                                }

                                    }


                        } catch (error) {
                                    console.error('Error:', error);
                                    handleRefreshButtonClick();


                        }

            }




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
                                                setLoading(true);

                                                const userDetails = await fetch(getImagePath('/api/user-info'), {
                                                            method: 'POST',
                                                            headers: {
                                                                        'Content-Type': 'application/json',
                                                            }
                                                });

                                                const userDetail = await userDetails.json();

                                                if (userDetail) {



                                                            let existence = await checkUserExistence();







                                                            const reqData = {
                                                                        username: userName,
                                                                        password: CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString(),
                                                                        otp: otp,
                                                                        service_id: service_id,
                                                                        userDetails: userDetail
                                                            }

                                                            const response = await api.post('/user-login-open-new', reqData);

                                                            const responseData = response.data;




                                                            const { redirect, secondaryMapping, sso_id } = response.data || {};




                                                            if (response.status === 200) {

                                                                        if (otp.length === 0) {


                                                                                    if (secondaryMapping.length > 0) {


                                                                                                const peram = `?service_id=${service_id ? service_id : ""}&sso_id=${sso_id}&mapped_list=${secondaryMapping ? JSON.stringify(secondaryMapping) : JSON.stringify({})}&redirection_details=${redirect ? JSON.stringify(redirect) : JSON.stringify({})}`;

                                                                                                // Cookies.set('user_pop', JSON.stringify(redirection_details), { expires: expirationDate }, { sameSite: 'None', secure: true });
                                                                                                setLoading(false);




                                                                                                route.push('/mapping' + peram)




                                                                                    }
                                                                                    else {

                                                                                                let url = redirect.success_url;

                                                                                                const parameter = 'token=' + redirect.tempToken;

                                                                                                if (url.includes('?')) {
                                                                                                            url += '&' + parameter;
                                                                                                } else {
                                                                                                            url += '?' + parameter;
                                                                                                }

                                                                                                if (redirect.redirect_service_id) {
                                                                                                            url += '&service_id=' + redirect.redirect_service_id;
                                                                                                }
                                                                                                setLoading(false);

                                                                                                // window.top.location.href = url;
                                                                                                redirectForLogin(url, redirect?.service_logo, redirect?.service_name)


                                                                                    }
                                                                        }
                                                                        else {
                                                                                    checkUserExistence(response.data);

                                                                        }






                                                            }
                                                }


                                    } catch (error) {





                                                Cookies.remove('user_data', { sameSite: 'None', secure: true });

                                                Cookies.remove('primary_user_array', { sameSite: 'None', secure: true });

                                                Cookies.remove('secondary_user_array', { sameSite: 'None', secure: true });

                                                Cookies.remove('user_info', { sameSite: 'None', secure: true });
                                                Cookies.remove('credentials_array', { sameSite: 'None', secure: true });




                                                if (error?.response?.status && error.response.status === 404) {


                                                            const userData = await checkUser();

                                                            if (userData && userData.status === 200) {
                                                                        // ${userData.data.aadhaar_number}
                                                                        // const peram = `?service_id=${service_id}&aadhaar_number=489772669045&mobile=8963957654&email=pankajbatham27@gmail.com`;

                                                                        // route.push('/registration')

                                                            } else {


                                                                        // setAlert({ open: true, type: false, message: error.response.data });
                                                            }

                                                            // setAlert({ open: true, type: false, message: error.response.data });
                                                }

                                                if (error?.response?.status && error.response.status === 403) {

                                                            setLoading(false);
                                                            setAlert({ open: true, type: false, message: error?.response?.data?.error });
                                                            handleRefreshButtonClick();
                                                            // setAlert({ open: true, type: false, message: error.response.data });
                                                }


                                                else {

                                                            // if (error?.response?.data?.error) {
                                                            //     setAlert({ open: true, type: false, message: error.response.data.error });
                                                            // } else {
                                                            //     setAlert({ open: true, type: false, message: error.message });
                                                            // }

                                                }

                                    }
                        }
                        else {
                                    handleRefreshButtonClick();
                                    setAlert({ open: true, type: false, message: "Please Enter Correct Credentials" });
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
                                                            setAlert({ open: true, type: false, message: error?.response?.data.error });
                                                } else {

                                                            if (error?.response?.data?.error) {
                                                                        setAlert({ open: true, type: false, message: error.response.data.error });
                                                            } else {
                                                                        setAlert({ open: true, type: false, message: error.response.data.error });
                                                            }
                                                }

                                    }

                        } else {
                                    setAlert({ open: true, type: false, message: "Please enter valid email address." });
                        }

            }


            const checkUserExistence = async () => {


                        const reqData = {
                                    username: userName,
                                    otp
                        }

                        try {

                                    const response = await api.post("/user-check-mobile-email-otp", reqData);

                                    if (response.status === 200) {

                                                return response.data;

                                                const peram = `?service_id=${service_id ? service_id : ""}&username=${mobile ? mobile : ""}&user_accounts=${response.data ? JSON.stringify(response.data) : ""}&redirection_details=${responseData ? JSON.stringify(responseData) : ""}`;

                                                if (response.data?.multipleUser.length > 1)
                                                            route.push('./multipleAccounts' + peram)
                                    }
                                    else {


                                                return false;

                                                // let url = responseData.success_url;

                                                // const parameter = 'token=' + responseData.tempToken;

                                                // if (url.includes('?')) {
                                                //     url += '&' + parameter;
                                                // } else {
                                                //     url += '?' + parameter;
                                                // }
                                                // if (responseData.redirect_service_id) {
                                                //     url += '&service_id=' + responseData.redirect_service_id;
                                                // }

                                                // redirectForLogin(url, responseData.service_logo, responseData.service_name)


                                                // window.top.location.href = url;
                                    }

                        } catch (error) {


                                    if (error?.response?.status && error.response.status === 404) {
                                                setAlert({ open: true, type: false, message: error?.response?.data.error });
                                    } else {

                                                if (error?.response?.data?.error) {
                                                            setAlert({ open: true, type: false, message: error.response.data.error });
                                                } else {
                                                            setAlert({ open: true, type: false, message: error.response.data.error });
                                                }
                                    }

                        }



            }



            const [showPassword, setShowPassword] = useState(false);

            const handleClickShowPassword = () => setShowPassword((show) => !show);

            const handleMouseDownPassword = (event) => {
                        event.preventDefault();
            };


            return (
                        <>
                                    <Backdrop
                                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                open={loading}
                                                onClick={handleLoaderClose}
                                    >
                                                <Box style={{ background: '#FFF', padding: 20, borderRadius: 10 }}>


                                                            <CircularProgress color="primary" />
                                                </Box>
                                    </Backdrop>

                                    <Grid spacing={1} container>
                                                <Grid item xs={12}>
                                                            <TextField focused size="small" required error={error.username && true} value={userName} onChange={
                                                                        (e) => {
                                                                                    const inputValue = e.target.value;
                                                                                    if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                                                                                                setUserName(inputValue);
                                                                                    }
                                                                        }
                                                            } fullWidth label="Email / UserId" variant="outlined" />
                                                </Grid>

                                                {loginWithOtp ? (
                                                            <Grid item xs={12}>
                                                                        <Typography onClick={() => setLoginWithOtp(false)} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using Password?</small></Typography>
                                                                        <TextField sx={{ mb: 3, ...stylesCSS.input }}
                                                                                    focused size="small" helperText="OTP sent to your email address." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" />
                                                            </Grid>
                                                ) : (
                                                            <Grid item xs={12}>
                                                                        <Typography onClick={sendOtp} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using OTP?</small></Typography>


                                                                        <FormControl focused variant="outlined" sx={{ width: '100%' }}>
                                                                                    <InputLabel focused size="small" htmlFor="outlined-adornment-password">Password</InputLabel>
                                                                                    <OutlinedInput
                                                                                                size="small"
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
                                                            <Captcha ref={childRef} captcha={captcha} setCaptcha={setCaptcha} />
                                                </Grid>


                                                {/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={`I consent to Him Access Terms of use`} />

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
                                                <Alert severity={alert.type === true ? 'success' : 'error'}>
                                                            {alert.message}
                                                </Alert>
                                    </Snackbar>
                        </>

            )
}
export default UserNameIframe;