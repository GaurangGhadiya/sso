import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import CryptoJS from "crypto-js";
import Captcha from "../UI/Captcha";
import expirationDate from "../../../../utils/cookiesExpire";

const UserNameDept = () => {

    const route = useRouter();

    const dispatch = useDispatch();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [captcha, setCaptcha] = useState(false);

    const [error, setError] = useState({
        username: false,
        password: false,
    })

    const submitHandler = async () => {

        const attempt = Cookies.get('attempt');

        if(attempt && attempt >= 3){

            dispatch(callAlert({ message: 'Your account has been temporarily locked due to multiple incorrect login attempts!', type: 'FAILED' }))

            return;
        }

        const newError = {
            username: userName.length < 1,
            password: password.length < 1,
        };

        setError(newError);

        const reqData = {
            username: CryptoJS.AES.encrypt(userName, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString(),
            password: CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_API_SECRET_KEY).toString()
        }

        if (Object.values(newError).every(value => value !== true) && captcha === true) {

            try {
                const response = await api.post('/department-login', reqData);

                if (response.status === 200) {

                    Cookies.set('role', 'department', { expires: expirationDate });
                    Cookies.set('uid', response.data.id, { expires: expirationDate });
                    Cookies.set('department', response.data.department, { expires: expirationDate });

                    route.push('/department/dashboard')

                }

            } catch (error) {

                let attempt = Cookies.get('attempt');
                if(attempt){
                    Cookies.set('attempt', +attempt + 1, { expires: new Date(Date.now() + 3 * 60000) });
                }else{
                    Cookies.set('attempt', 1, { expires: new Date(Date.now() + 3 * 60000) });
                }

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else if (error?.response?.data) {
                    dispatch(callAlert({ message: error.response.data, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }
            }
        }
    }

    return (
        <Grid spacing={3} container>
            <Grid item xs={12}>
                <TextField required error={error.username && true} value={userName} onChange={

                    (e) => {
                        const inputValue = e.target.value;
                        if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                            setUserName(inputValue);
                        }
                    }

                } fullWidth label="Username" variant="outlined" />
            </Grid>

            <Grid item xs={12}>
                <TextField type="password" required error={error.password && true} value={password} onChange={

                    (e) => {
                        const inputValue = e.target.value;
                        if (!/[<>]/.test(inputValue)) {
                            setPassword(inputValue);
                        }
                    }

                } fullWidth label="Password" variant="outlined" />
            </Grid>

            <Grid item xs={12}>
                <Captcha captcha={captcha} setCaptcha={setCaptcha} />
            </Grid>


            <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={submitHandler}>Sign In</Button>
            </Grid>
        </Grid>
    )
}
export default UserNameDept;