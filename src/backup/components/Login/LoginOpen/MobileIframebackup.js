import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText, Snackbar, Alert, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../../../utils/api";
import Captcha from "@/components/UI/Captcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { getImagePath } from "../../../../utils/CustomImagePath";
import CryptoJS from 'crypto-js';


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


const MobileLoginIframe = ({ service_id, handleChange, redirectForLogin }) => {

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [term, setTerm] = useState(true);
    const [captcha, setCaptcha] = useState(false);

    const [alert, setAlert] = useState({ open: false, type: false, message: null });

    const [otp, setOTP] = useState('');
    const [loginWithOtp, setLoginWithOtp] = useState(false);
    const [loading, setLoading] = useState(false);


    const [error, setError] = useState({
        mobile: false,
        password: false,
        term: false
    })


    const route = useRouter();

    const submitHandler = async () => {

        const newError = {
            mobile: mobile.length < 1,
            password: password.length < 1,
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
                        mobile: mobile,
                        password: CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString(),
                        service_id: service_id,
                        userDetails: userDetail
                    }


                    const response = await api.post('/user-login-mobile-open', reqData);


                    if (response.status === 200) {

                        const responseData = response.data;

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


                        // window.top.location.href = url;

                    }

                }



            } catch (error) {



                if (error?.response?.status && error.response.status === 404) {

                    const userData = await checkUser('933165437');

                    if (userData && userData.status === 200) {
                        // ${userData.data.aadhaar_number}
                        // const peram = `?service_id=${service_id}&aadhaar_number=489772669045&mobile=8963957654&email=pankajbatham27@gmail.com`;

                        route.push('/registration')

                    }    }
                else if (error?.response?.status && error.response.status === 403) {

                    setAlert({ open: true, type: false, message: error.response.data.error });


                }

                else {

                }

                //     if (error?.response?.data?.error) {
                //         setAlert({ open: true, type: false, message: error.response.data.error });
                //     } else {
                //         setAlert({ open: true, type: false, message: error.response.data });
                //     }

                // }

            }
        }
        else {
            setAlert({ open: true, type: false, message: "Please Enter Correct Credentials" });

        }

    }


    async function getUser(user_url, service_id, user_name) {
        try {
            const formData = new URLSearchParams();
            formData.append('service_id', service_id);
            formData.append('user_name', user_name);
            formData.append('password', CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString());




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


            if (error?.response?.status && error.response.status === 400) {

                setAlert({ open: true, type: false, message: error?.response?.data.error });

            }
            else {
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
                        user_name: mobile
                    }



                    getUser(responseData.user_check_api, service_id, mobile)
                        .then((user) => {
                            // const { aaadharNo, dob, firstName, gender, id, lastName, middleName, mobileNo, userName, userPassword, email } = user || {};
                            var currentTime = new Date();

                            // Calculate the expiration time (current time + 10 minutes)
                            var expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);



                            const { singleRowData, primaryUsersArray, secondaryUsersArray } = user || {};

                            const { firstName, middleName, lastName, gender, dob, UserCredentialsArray, aaadharNo, email, userPassword, mobileNo } = singleRowData || {}

                            Cookies.set('user_data', JSON.stringify(user), { expires: expirationTime, sameSite: 'None', secure: true });


                            // Cookies.set('credddd', JSON.stringify(UserCredentialsArray), { expires: expirationTime, sameSite: 'None', secure: true });


                            Cookies.set('primary_user_array', JSON.stringify(primaryUsersArray), { expires: expirationTime, sameSite: 'None', secure: true });

                            Cookies.set('secondary_user_array', JSON.stringify(secondaryUsersArray), { expires: expirationTime, sameSite: 'None', secure: true });

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



                                const peram = `?service_id=${service_id ? service_id : ""}&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${mobileNo ? mobileNo : ""}&email=${JSON.stringify(email ? email : "")}&userName=${mobile ? mobile : ""}&userPassword=${userPassword ? userPassword : ""}&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${dob ? dob : ""}&umap=${UserCredentialsArray ? JSON.stringify(UserCredentialsArray) : ""}&umap_var=${email ? JSON.stringify(email) : ""}&username=${mobile ? mobile : ""}&primary_user=${primary_user ? JSON.stringify(primary_user) : ""}`;
                                route.push('/registration-iframe' + peram)



                            }


                        })
                        .catch((error) => {
                            setLoading(false);
                            if (error?.response?.status && error.response.status === 300) {

                                setAlert({ open: true, type: false, message: error?.response?.data });

                            }

                            if (error?.response?.status && error.response.status === 400) {

                                setAlert({ open: true, type: false, message: error?.response?.data });

                            }


                            console.error('Error occurred while getting user:', error);
                        });





                }

            }


        } catch (error) {
            console.error('Error:', error);



        }

    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });
    };

    const sendOtp = async () => {

        if (mobile.length > 9) {

            const reqData = {
                mobile
            }

            try {

                const response = await api.post("/sent-mobile-sms", reqData);

                if (response.status === 200) {
                    setAlert({ open: true, type: true, message: "OTP sent to your mobile number." });
                    setLoginWithOtp(true);
                }

            } catch (error) {
                if (error.response.data.error) {
                    setAlert({ open: true, type: false, message: error.response.data.error });
                } else {
                    setAlert({ open: true, type: false, message: error.message });
                }

            }


        } else {
            setAlert({ open: true, type: false, message: "Please enter valid mobile number." });
        }

    }


    const submitHandlerOtp = async () => {
        const newError = {
            mobile: mobile.length < 1,
            otp: otp.length < 1,
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
                        mobile: mobile,
                        otp: otp,
                        service_id: service_id,
                        userDetails: userDetail
                    }

                    const response = await api.post('/user-login-mobile-open', reqData);



                    const responseData = response.data;
                    const { redirect, secondaryMapping, sso_id } = response.data || {};



                    if (secondaryMapping && secondaryMapping.length > 0) {


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







            } catch (error) {
                if (error?.response?.status && error.response.status === 404) {

                    setAlert({ open: true, type: false, message: error.response.data.error });
                } else {

                    if (error?.response?.data?.error) {
                        setAlert({ open: true, type: false, message: error.response.data.error });
                    } else {
                        setAlert({ open: true, type: false, message: error.message });
                    }

                }
            }
        }
    }


    const checkUserExistence = async (responseData) => {


        const reqData = {
            username: mobile,
            otp
        }

        try {

            const response = await api.post("/user-check-mobile-email-otp", reqData);

            if (response.status === 200) {

                const peram = `?service_id=${service_id ? service_id : ""}&username=${mobile ? mobile : ""}&user_accounts=${response.data ? JSON.stringify(response.data) : ""}&redirection_details=${responseData ? JSON.stringify(responseData) : ""}`;

                if (response.data?.multipleUser.length > 1)
                    route.push('./multipleAccounts' + peram)
            }
            else {

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


                window.top.location.href = url;
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
            <Grid spacing={1} container>
                <Grid item xs={12}>
                    <TextField focused size="small" inputProps={{
                        maxLength: 10,
                    }} required error={error.mobile && true} onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (/^[\d+]*$/.test(inputValue)) {
                                setMobile(inputValue);
                            }
                        }
                    } value={mobile} fullWidth label="Mobile" variant="outlined" />
                </Grid>

                {loginWithOtp ? (
                    <Grid item xs={12}>
                        <Typography onClick={() => setLoginWithOtp(false)} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using Password?</small></Typography>
                        <TextField sx={{ mb: 3, ...stylesCSS.input }} focused size="small" helperText="OTP sent to your mobile number." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" />
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Typography onClick={sendOtp} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using OTP?</small></Typography>

                        <FormControl focused variant="outlined" sx={{ width: '100%' }}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                focused size="small"
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

                        {/* <TextField type="password" required error={error.password && true} onChange={
                            (e) => {
                                const inputValue = e.target.value;
                                if (!/[<>]/.test(inputValue)) {
                                    setPassword(inputValue);
                                }
                            }
                        } value={password} fullWidth label="Password" variant="outlined" /> */}
                    </Grid>
                )}


                <Grid item xs={12}>
                    <Captcha captcha={captcha} setCaptcha={setCaptcha} />
                </Grid>

                {/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={`I consent to Him Access Terms of use`} />
                    {error.term && (<FormHelperText error>Please Accept Terms of use</FormHelperText>)}
                </Grid> */}

                <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={loginWithOtp ? submitHandlerOtp : submitHandler}>Sign In</Button>
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
                    </Alert>}

            </Snackbar>
        </>

    )
}
export default MobileLoginIframe;