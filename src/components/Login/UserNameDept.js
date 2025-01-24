import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import api from "../../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import CryptoJS from "crypto-js";
import Captcha from "../UI/Captcha";
import AlertModal from "../AlertModal";
import expirationDate from "../../../utils/cookiesExpire";

const UserNameDept = () => {
  const route = useRouter();

  const dispatch = useDispatch();
  const selector = useSelector(state => state.AlertHandler);
  useEffect(() => {

    if (selector.type) {
        setAlert({ open: true, type: selector.type === 'success' ? true : false, message: selector.message });
    }

}, [selector])

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ open: false, type: false, message: null });


  const [captcha, setCaptcha] = useState(false);

  const [error, setError] = useState({
    username: false,
    password: false,
  });

  const submitHandler = async () => {
    const attempt = Cookies.get("attempt");

    if (attempt && attempt >= 3) {
      dispatch(
        callAlert({
          message:
            "Your account has been temporarily locked due to multiple incorrect login attempts!",
          type: "FAILED",
        })
      );

      return;
    }

    const newError = {
      username: userName.length < 1,
      password: password.length < 1,
    };

    setError(newError);

    const reqData = {
      username: CryptoJS.AES.encrypt(
        userName,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      password: CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
    };
    if (
      Object.values(newError).every((value) => value !== true) &&
      captcha === true
    ) {
      try {
        const response = await api.post("/department-login", reqData);

        if (response.status === 200) {
          if (response.status === 200 || response.status === "OK") {
            let url = "";
            const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

            var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
            decr = decr.toString(CryptoJS.enc.Utf8);

            let data = {};

            if (decr) {
              try {
                let json_data = JSON.parse(decr);
                data = json_data;

                Cookies.set("role", "department", { expires: expirationDate });
                Cookies.set("uid", data?.id, { expires: expirationDate });
                Cookies.set("department", data?.department, { expires: expirationDate });
                dispatch(callAlert({ message: "", type: "CLEAR" }));

                route.push("/department/dashboard");


              } catch (e) {
                console.warn(e)
              }
            }



          }

        }
      } catch (error) {
        let attempt = Cookies.get("attempt");
        if (attempt) {
          Cookies.set("attempt", +attempt + 1, {
            expires: new Date(Date.now() + 3 * 60000),
          });
        } else {
          Cookies.set("attempt", 1, {
            expires: new Date(Date.now() + 3 * 60000),
          });
        }

        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error?.response?.data?.error, type: "FAILED" })
          );
        } else if (error?.response?.data) {
          dispatch(callAlert({ message: error.response.data, type: "FAILED" }));
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    }
  };

  const handleCloseAll = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlert({ open: false, type: false, message: null });

    dispatch(callAlert({ message: null, type: 'CLEAR' }))

};

  return (
    <Grid spacing={3} container>
      <AlertModal alert={alert} handleClose={handleCloseAll} />
      <Grid item xs={12}>
        <TextField
          required
          error={error.username && true}
          value={userName}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
              setUserName(inputValue);
            }
          }}
          fullWidth
          label="Username"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          type="password"
          required
          error={error.password && true}
          value={password}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (!/[<>]/.test(inputValue)) {
              setPassword(inputValue);
            }
          }}
          fullWidth
          label="Password"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <Captcha captcha={captcha} setCaptcha={setCaptcha} />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={submitHandler}>
          Sign In
        </Button>
      </Grid>
    </Grid>
  );
};
export default UserNameDept;
