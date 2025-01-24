import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  FormHelperText,
  Snackbar,
  Alert,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import CryptoJS from "crypto-js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlertModal from "../AlertModal";
import { getImagePath } from "../../../utils/CustomImagePath";
import axios from "axios";
import { encrypt } from "../../../utils/encryptDecrypt";
import encryptEmployeeCode, { encryptBody } from "../../../utils/globalEncryption";
import decryptEmployeeCode from "../../../utils/globalDecryption";
import expirationDate from "../../../utils/cookiesExpire";

const ParichayEmailLogin = ({ handleChange }) => {
  const route = useRouter();
  const [open, setOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [term, setTerm] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: false,
    message: null,
  });

  const [error, setError] = useState({
    username: false,
    password: false,
    term: false,
  });
  const [modalData, setModalData] = useState({});
  const handleClickOpen = (userDetails) => {
    setOpen(true);
    setModalData(userDetails);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const submitHandler = async () => {
    if (captcha !== true) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter the valid CAPTCHA code to proceed",
      });

      return;
    }
    const usernameRegex = /^[^\s$#!*()]+$/;

    if (!usernameRegex.test(userName)) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid Username",
      });

      return;
    }

    if (password.length < 3) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid password",
      });

      return;
    }

    const newError = {
      username: userName.length < 1,
      password: otp.length < 1 && password.length < 1,
    };

    setError(newError);

    if (
      Object.values(newError).every((value) => value !== true) &&
      captcha === true
    ) {
      if (userName?.includes("@himaccess.in")) {
        const userDetailsCheck = await axios
          .get(
            `${
              process.env.NEXT_PUBLIC_API_BASE_PROD_URL
            }/sarvatra-api/login/adminAuth?username=${encodeURIComponent(
              encryptEmployeeCode(userName)
            )}&password=${encodeURIComponent(encryptEmployeeCode(password))}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(async (res) => {
            let dec_data = decryptEmployeeCode(res.data.data);
            let parsed_data = JSON.parse(dec_data);

            if (parsed_data?.username) {
              let data = {
                userName: parsed_data?.username || "",
                name: parsed_data?.username || "",
                parichay_userid: parsed_data?.username || "",
                role_id: parsed_data?.roleId || "",
                successurl: "https://himparivar.hp.gov.in/ssonext/parichay-sso",
                token: "",
                app: "himparivarsso",
                serviceId: 16,
              };
              let encryptedData = btoa(JSON.stringify(data));
              Cookies.set("govEnc", encryptedData, { expires: expirationDate });

              route.push("government-employee-dashboard");
            } else {
              // rakeshbhai api
              let body = { username: userName, password: password };
              const userDetails = await axios
                .post(
                  `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/sarvatra/post`,
                  encrypt(JSON.stringify(body)),
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/text",
                    },
                  }
                )
                .then((res) => {
                  // route.push('/')
                })
                .catch((error) => {
                  console.warn("error", error);
                });
            }
          })
          .catch((error) => {
            console.warn("error", error);
          });
      } else {
        // Ldap api code
        try {
          setLoading(true);

          const userDetails = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/ldap/auth?username=${
              userName + "@himaccess.gov.in"
            }&password=${encodeURIComponent(password)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // const userDetail = await userDetails;
          // handleClickOpen(userDetails?.data?.data)

          let data = {
            userName: userDetails?.data?.data?.mail,
            name: userDetails?.data?.data?.uid,
            parichay_userid: userDetails?.data?.data?.mail,
            role_id: 0,
            successurl: "https://himparivar.hp.gov.in/ssonext/parichay-sso",
            token: "",
            app: "himparivarsso",
            serviceId: 16,
          };
          let encryptedData = btoa(JSON.stringify(data));
          Cookies.set("govEnc", encryptedData, { expires: expirationDate });

          route.push("government-employee-dashboard");
        } catch (error) {
          setLoading(false);
          // handleRefreshButtonClick();

          Cookies.remove("user_data", { sameSite: "None", secure: true });

          Cookies.remove("primary_user_array", {
            sameSite: "None",
            secure: true,
          });

          Cookies.remove("secondary_user_array", {
            sameSite: "None",
            secure: true,
          });

          Cookies.remove("user_info", { sameSite: "None", secure: true });
          Cookies.remove("credentials_array", {
            sameSite: "None",
            secure: true,
          });

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
            setAlert({
              open: true,
              type: false,
              message: error?.response?.data?.error,
            });
            // handleRefreshButtonClick();
            // setAlert({ open: true, type: false, message: error.response.data });
          } else {
            // if (error?.response?.data?.error) {
            setAlert({
              open: true,
              type: false,
              message: error?.response?.data?.message,
            });
            // } else {
            //     setAlert({ open: true, type: false, message: error.message });
            // }
          }
        }
      }
    } else {
      if (captcha === false) {
        setAlert({
          open: true,
          type: false,
          message: "Please enter the CAPTCHA code to proceed",
        });
      }

      if (userName.length < 4) {
        setAlert({
          open: true,
          type: false,
          message: "Please enter valid Username",
        });
      }

      // else {
      //   handleRefreshButtonClick();
      //   setAlert({
      //     open: true,
      //     type: false,
      //     message: "Please Enter Correct Credentials",
      //   });
      // }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false, type: false, message: null });
  };

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const [otp, setOTP] = useState("");
  const [loginWithOtp, setLoginWithOtp] = useState(false);

  useEffect(() => {
    setOTP("");
    setPassword("");
  }, [loginWithOtp]);

  const sendOtp = async () => {
    // if (isValidEmail(userName)) {

    if (userName) {
      const reqData = {
        userName,
      };

      try {
        const response = await api.post("/sent-email-sms", { data: encryptBody(JSON.stringify(reqData)) });

        if (response.status === 200) {
          setAlert({
            open: true,
            type: true,
            message: "OTP sent to your email address.",
          });
          setLoginWithOtp(true);
        }
      } catch (error) {
        if (error?.response?.status && error.response.status === 404) {
          setAlert({
            open: true,
            type: false,
            message: error.response.data.error,
          });
        } else {
          if (error?.response?.data?.error) {
            setAlert({
              open: true,
              type: false,
              message: error.response.data.error,
            });
          } else {
            setAlert({ open: true, type: false, message: error.message });
          }
        }
      }
    } else {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid Email or Username",
      });
    }

    // } else {
    //     setAlert({ open: true, type: false, message: "Please enter valid email address." });
    // }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12} position={"relative"}>
          <TextField
            size="small"
            focused
            required
            error={error.username && true}
            value={userName}
            placeholder=""
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                setUserName(inputValue);
              }
            }}
            fullWidth
            label="Email / Username"
            variant="outlined"
          />
          {/* <strong style={{ position: "absolute", right: "10px", top: "25px" }}>@himaccess.gov.in</strong> */}
        </Grid>

        {loginWithOtp ? (
          <Grid item xs={12}>
            <Typography
              onClick={() => setLoginWithOtp(false)}
              color={"#4CAF50"}
              sx={{ cursor: "pointer" }}
              textAlign={"right"}
              variant="body2"
            >
              <small>Login using Password?</small>
            </Typography>
            <TextField
              size="small"
              focused
              helperText="OTP sent to your email address."
              required
              error={error.otp && true}
              onChange={(e) => setOTP(e.target.value)}
              value={otp}
              fullWidth
              label="OTP"
              variant="outlined"
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography
              onClick={sendOtp}
              color={"#4CAF50"}
              sx={{ cursor: "pointer" }}
              textAlign={"right"}
              variant="body2"
            >
              {/* <small>Login using OTP?</small> */}
            </Typography>

            <FormControl
              size="small"
              focused
              variant="outlined"
              sx={{ width: "100%" }}
            >
              <InputLabel
                size="small"
                focused
                htmlFor="outlined-adornment-password"
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
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
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // if (!/[<>]/.test(inputValue)) {
                  setPassword(inputValue);
                  // }
                }}
                value={password}
              />
            </FormControl>

            {/* <TextField type={'password'} required error={error.password && true} value={password} onChange={
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
          <Button variant="contained" fullWidth onClick={submitHandler}>
            Sign In
          </Button>
        </Grid>
      </Grid>

      {alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {"Login User Ldap Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p style={{ display: "flex" }}>
              <div style={{ width: "40%", fontWeight: "bold" }}>Email Id:</div>{" "}
              <div style={{ width: "60%" }}>{modalData?.mail}</div>
            </p>
            <p style={{ display: "flex" }}>
              <div style={{ width: "40%", fontWeight: "bold" }}>User Name:</div>{" "}
              <div style={{ width: "60%" }}>{modalData?.uid}</div>
            </p>
            <p style={{ display: "flex" }}>
              <div style={{ width: "40%", fontWeight: "bold" }}>Mobile: </div>{" "}
              <div style={{ width: "60%" }}>{modalData?.mobile}</div>
            </p>
            <p style={{ display: "flex" }}>
              <div style={{ width: "40%", fontWeight: "bold" }}>
                Common Name:
              </div>{" "}
              <div style={{ width: "60%" }}>{modalData?.cn}</div>
            </p>
            <p style={{ display: "flex" }}>
              <div style={{ width: "40%", fontWeight: "bold" }}>Surname: </div>{" "}
              <div style={{ width: "60%" }}>{modalData?.sn}</div>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ParichayEmailLogin;
