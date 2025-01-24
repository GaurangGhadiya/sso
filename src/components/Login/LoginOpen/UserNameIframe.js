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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import api from "../../../../utils/api";
import Captcha from "@/components/UI/Captcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import CryptoJS from "crypto-js";
import { getImagePath } from "../../../../utils/CustomImagePath";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import SecurityIcon from "@mui/icons-material/Security";
import {
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { InputOTP } from "antd-input-otp";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import Swal from "sweetalert2";

import { Button as AntdButton } from "antd";
import NumericInput from "@/components/NumericInput";
import Image from "next/image";
import AlertModal from "@/components/AlertModal";
import { encryptBody } from "../../../../utils/globalEncryption";
import expirationDate from "../../../../utils/cookiesExpire";
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
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 330,
  borderRadius: 2,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const UserNameIframe = ({ service_id, handleChange, redirectForLogin }) => {
  const route = useRouter();
  const childRef = useRef();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [term, setTerm] = useState(true);
  const [captcha, setCaptcha] = useState(false);

  const [loading, setLoading] = useState(false);

  const [hideOTP, sethideOTP] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);

  const [ssoId, setssoId] = useState("");

  const [mobile, setMobile] = useState("");
  const [otpValues, setOtpValues] = useState([]);

  const handleLoaderClose = () => {
    setLoading(false);
  };
  const handleLoaderOpen = () => {
    setLoading(true);
  };

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

  const handleRefreshButtonClick = () => {
    // Handle the captcha refresh button click in the parent component
    if (childRef.current && childRef.current.refreshCaptcha) {
      childRef.current.refreshCaptcha();
      setCaptcha("");
    }
  };

  const VerifyUserWithOtp = async (mobile, ssoId) => {
    try {
      const userDetails = await fetch(getImagePath("/api/user-info"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userDetail = await userDetails.json();

      const reqData = {
        user_id: ssoId,
        service_id: service_id,
        BrowserDetails: userDetail,
        login_type: "username",
      };

      const response = await api.post("/check-secondary-mapping", { data: encryptBody(JSON.stringify(reqData)) });


      if(response.status==200) {

        const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

        var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
        decr = decr.toString(CryptoJS.enc.Utf8);
        let data = {};
        if (decr) {
          try {
            let json_data = JSON.parse(decr)
            data = json_data;
            const { secondaryMapping, redirect, sso_id, PrimaryData } =
            data || {};

            let jsonString = JSON.stringify(secondaryMapping);

            let base64String = Buffer.from(jsonString).toString("base64");
            let urlEncodedString = encodeURIComponent(base64String);

            let redirectionString = JSON.stringify(redirect);

            let base64RedirectionString =
              Buffer.from(redirectionString).toString("base64");
            let redirecturlEncodedString = encodeURIComponent(
              base64RedirectionString
            );

            if (secondaryMapping.length > 0) {
              const peram = `?service_id=${
                service_id ? service_id : ""
              }&sso_id=${sso_id}&mapped_list=${urlEncodedString}&redirection_details=${redirecturlEncodedString}&PrimaryData=${
                PrimaryData ? JSON.stringify(PrimaryData) : JSON.stringify({})
              }`;
              route.push("/mapping" + peram);
            } else {
              let url = redirect.success_url;

              const parameter = "token=" + redirect.tempToken;

              if (url.includes("?")) {
                url += "&" + parameter;
              } else {
                url += "?" + parameter;
              }
              if (redirect.redirect_service_id) {
                url += "&service_id=" + redirect.redirect_service_id;
              }

              if (service_id === "10000046") {
                Cookies.set("role", "user", { expires: expirationDate });
                Cookies.set("uid", redirect.user.id, { expires: expirationDate });
                Cookies.set("name", redirect.user.name, { expires: expirationDate });

                route.push("/dashboard");
              }

              redirectForLogin(url, redirect.service_logo, redirect.service_name);
            }


          } catch (e) {
  console.error(e);
          }
        }
      }

      // const { secondaryMapping, redirect, sso_id, PrimaryData } =
      //   response.data || {};

      setLoading(false);


    } catch (error) {
      setLoading(false);

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
  };

  async function getUser(user_url, service_id, user_name) {
    try {
      const formData = new URLSearchParams();
      formData.append("service_id", service_id);
      formData.append("user_name", user_name);
      formData.append(
        "password",
        CryptoJS.AES.encrypt(
          password,
          process.env.NEXT_PUBLIC_API_SECRET_KEY
        ).toString()
      );
      // formData.append('login_type', "");

      setLoading(false);

      const response = await axios.post(user_url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
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
      } else if (response.data.statusCode === "300") {
        return response.data.statusDesc;
      } else if (response.data.statusCode === "400") {
        return response.data.statusDesc;
      } else if (response.data.statusCode === "404") {
        return response.data.statusDesc;
      } else if (response.data.statusCode === "403") {
        return response.data.statusDesc;
      }

      return null; // Return null if no data or statusCode isn't '200 OK'
    } catch (error) {
      setLoading(false);
      if (error?.response?.status && error.response.status === 404) {
        Swal.fire({
          title: "Error",
          html: "Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.",
          showCancelButton: false,
          confirmButtonText: "Sign up",
          confirmButtonColor: "#1876d1",
          showCloseButton: true,
          customClass: {
            title: "swal-title",
            htmlContainer: "swal-text",
          },

          // cancelButtonText: 'No'
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Redirect to the login page using your router logic
            // Replace 'your-login-route' with the actual route for your login page

            if (service_id === "10000046") {
              route.push("/registration");
            } else {
              const peram = `?service_id=${service_id ? service_id : ""}`;
              route.push("/registration-iframe" + peram);
            }
          }
        });
      } else if (error?.response?.status && error.response.status === 400) {
        handleRefreshButtonClick();
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      } else if (error?.response?.status && error.response.status === 500) {
        handleRefreshButtonClick();
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data?.error,
        });
      } else if (error?.response?.status && error.response.status === 403) {
        handleRefreshButtonClick();
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      } else {
        handleRefreshButtonClick();

        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      }

      return null; // Return null in case of an error
    }
  }

  const checkUser = async () => {
    try {
      const reqData = {
        service_id: service_id,
      };

      const responseURL = await api.post("/checkUserUrl", { data: encryptBody(JSON.stringify(reqData)) });

        if (responseURL.status === 200) {
              if (responseURL.status === 200 || responseURL.status === "OK") {
                let url = "";
                const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
                var decr = CryptoJS.AES.decrypt(responseURL?.data?.data, secretKey);
                decr = decr.toString(CryptoJS.enc.Utf8);

                let data = {};

                if (decr) {
                  try {
                    let json_data = JSON.parse(decr);
                    data = json_data;

                    // const data? = responseURL.data;

                    if (data?.user_check_api) {
                      const reqCLData = {
                        service_id: service_id,
                        user_name: selectedDropdown === "Email" ? email : aadhaar,
                      };

                      getUser(
                        data?.user_check_api,
                        service_id,
                        selectedDropdown === "Email" ? email : aadhaar
                      )
                        .then((user) => {
                          // const { aaadharNo, dob, firstName, gender, id, lastName, middleName, mobileNo, userName, userPassword, email } = user || {};

                          var currentTime = new Date();

                          // Calculate the expiration time (current time + 10 minutes)
                          var expirationTime = new Date(
                            currentTime.getTime() + 10 * 60 * 1000
                          );

                          const { singleRowData, primaryUsersArray, secondaryUsersArray } =
                            user || {};

                          const {
                            firstName,
                            middleName,
                            lastName,
                            gender,
                            dob,
                            UserCredentialsArray,
                            aaadharNo,
                            email,
                            userPassword,
                            mobileNo,
                          } = singleRowData || {};

                          Cookies.set("user_data", JSON.stringify(user), {
                            expires: expirationTime,
                            sameSite: "None",
                            secure: true,
                          });

                          // Cookies.set('credddd', JSON.stringify(UserCredentialsArray), { expires: expirationTime, sameSite: 'None', secure: true });

                          Cookies.set(
                            "primary_user_array",
                            JSON.stringify(primaryUsersArray),
                            { expires: expirationTime, sameSite: "None", secure: true }
                          );

                          Cookies.set(
                            "secondary_user_array",
                            JSON.stringify(secondaryUsersArray),
                            { expires: expirationTime, sameSite: "None", secure: true }
                          );

                          // Cookies.set('user_data', JSON.stringify(user));

                          let primary_user = {};

                          if (UserCredentialsArray) {
                            setLoading(false);
                            // return user;
                            const peram = `?service_id=${service_id ? service_id : ""
                              }&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${mobileNo ? mobileNo : ""
                              }&email=${JSON.stringify(email ? email : "")}&userName=${email ? email : ""
                              }&userPassword=${userPassword ? userPassword : ""
                              }&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${dob ? dob : ""
                              }&umap=${UserCredentialsArray
                                ? JSON.stringify(UserCredentialsArray)
                                : ""
                              }&umap_var=${email ? JSON.stringify(email) : ""}&username=${email ? email : ""
                              }&primary_user=${primary_user ? JSON.stringify(primary_user) : ""
                              }`;
                            route.push("/registration-iframe" + peram);
                          }
                        })
                        .catch((error) => {
                          handleRefreshButtonClick();
                          setLoading(false);
                          if (error?.response?.status && error.response.status === 300) {
                            setAlert({
                              open: true,
                              type: false,
                              message: error?.response?.data,
                            });
                          }

                          if (error?.response?.status && error.response.status === 400) {
                            setAlert({
                              open: true,
                              type: false,
                              message: error?.response?.data,
                            });
                          }
                        });
                    } else {
                      Swal.fire({
                        title: "Error",
                        html: `Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.`,
                        showCancelButton: false,
                        confirmButtonText: "Sign up",
                        showCloseButton: true,
                        customClass: {
                          title: "swal-title",
                          htmlContainer: "swal-text",
                        },

                        // cancelButtonText: 'No'
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          // Redirect to the login page using your router logic
                          // Replace 'your-login-route' with the actual route for your login page

                          if (service_id === "10000046") {
                            route.push("/registration");
                          } else if (!service_id) {
                            route.push("/registration");
                          } else {
                            const peram = `?service_id=${service_id ? service_id : ""}`;
                            route.push("/registration-iframe" + peram);
                          }
                        }
                      });
                    }

                  } catch (e) {
                    console.warn(e)
                  }
                }



              }




            } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      Swal.fire({
        title: "Error",
        html: "Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.",
        showCancelButton: false,
        confirmButtonText: "Sign up",
        confirmButtonColor: "#1876d1",
        showCloseButton: true,
        customClass: {
          title: "swal-title",
          htmlContainer: "swal-text",
        },

        // cancelButtonText: 'No'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Redirect to the login page using your router logic
          // Replace 'your-login-route' with the actual route for your login page
          if (service_id === "10000046") {
            route.push("/registration");
          } else {
            const peram = `?service_id=${service_id ? service_id : ""}`;
            route.push("/registration-iframe" + peram);
          }
        }
      });

      handleRefreshButtonClick();
    }
  };

  const authenticateOTP = async () => {
    if (otpValues.join("").length !== 5) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid OTP",
      });
      return;
    }

    const reqData = {
      mobile_number: mobile,
      otp: CryptoJS.AES.encrypt(
        otpValues.join(""),
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      service_id: service_id,
    };

    try {
      const response = await api.post("/otp-authentication", { data: encryptBody(JSON.stringify(reqData)) });
      const { flag } = response.data || {};
      if (flag) {
        sethideOTP(false);
        setLoading(false);
        VerifyUserWithOtp(mobile, ssoId);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data.error,
        });
      } else {
        setAlert({
          open: true,
          type: false,
          message: "Something went wrong. Please try again",
        });
      }
    }
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
      otp: password.length < 1 && otp.length < 1,
      term: !term,
    };

    setError(newError);

    if (
      Object.values(newError).every((value) => value !== true) &&
      captcha === true
    ) {
      try {
        setLoading(true);

        const userDetails = await fetch(getImagePath("/api/user-info"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userDetail = await userDetails.json();

        if (userDetail) {
          if (otp.length === 0) {
            const reqData = {
              username: userName,
              password: CryptoJS.AES.encrypt(
                password,
                process.env.NEXT_PUBLIC_API_SECRET_KEY
              ).toString(),

              service_id: service_id,
              userDetails: userDetail,
            };


            const response = await api.post("/user/login", { data: encryptBody(JSON.stringify(reqData)) });

 if (response.status === 201) {
              sethideOTP(true);

              const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

              var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
              decr = decr.toString(CryptoJS.enc.Utf8);

              // const encryptedData = CryptoJS.AES.decrypt(
              // 	response.data,
              // 	secretKey
              // ).toString();

              let data = {};

              if (decr) {
                try {
                  let json_data = JSON.parse(decr);
                  data = json_data;


                  const { sso_id, mobileNo, otpStatus } = data || {};
                  setMobile(mobileNo);
                  setssoId(sso_id);

                }
                catch(e){
                console.warn(e, "err")}
              }



            } else {
              handleRefreshButtonClick();

              let existence = await checkUserExistence();

              if (existence && existence.multipleUser) {
                if (existence.multipleUser.length > 1) {
                  const peram = `?service_id=${
                    service_id ? service_id : ""
                  }&username=${mobile ? mobile : ""}&user_accounts=${
                    existence ? JSON.stringify(existence) : ""
                  }&redirection_details=${JSON.stringify({})}`;
                  route.push("./multipleAccounts" + peram);
                } else if (existence.multipleUser.length === 1) {
                  let user_id = existence.multipleUser[0].id;

                  const reqData = {
                    user_id: user_id,
                    service_id: service_id,
                    BrowserDetails: userDetail,
                    login_type: "mobile",
                  };

                  const response = await api.post(
                    "/check-secondary-mapping",
                    { data: encryptBody(JSON.stringify(reqData)) }
                  );


                  if (response.status == 200) {

                    const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

                    var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
                    decr = decr.toString(CryptoJS.enc.Utf8);
                    let data = {};
                    if (decr) {
                      try {
                        let json_data = JSON.parse(decr)
                        data = json_data;
                        const { secondaryMapping, redirect, sso_id, PrimaryData } =
                          data || {};

                        let jsonString = JSON.stringify(secondaryMapping);

                        let base64String = Buffer.from(jsonString).toString("base64");
                        let urlEncodedString = encodeURIComponent(base64String);

                        let redirectionString = JSON.stringify(redirect);

                        let base64RedirectionString =
                          Buffer.from(redirectionString).toString("base64");
                        let redirecturlEncodedString = encodeURIComponent(
                          base64RedirectionString
                        );

                        if (secondaryMapping.length > 0) {
                          const peram = `?service_id=${service_id ? service_id : ""
                            }&sso_id=${sso_id}&mapped_list=${urlEncodedString}&redirection_details=${redirecturlEncodedString}&PrimaryData=${PrimaryData ? JSON.stringify(PrimaryData) : JSON.stringify({})
                            }`;
                          route.push("/mapping" + peram);
                        } else {
                          let url = redirect.success_url;

                          const parameter = "token=" + redirect.tempToken;

                          if (url.includes("?")) {
                            url += "&" + parameter;
                          } else {
                            url += "?" + parameter;
                          }
                          if (redirect.redirect_service_id) {
                            url += "&service_id=" + redirect.redirect_service_id;
                          }

                          if (service_id === "10000046") {
                            Cookies.set("role", "user", { expires: expirationDate });
                            Cookies.set("uid", redirect.user.id, { expires: expirationDate });
                            Cookies.set("name", redirect.user.name, { expires: expirationDate });

                            route.push("/dashboard");
                          }

                          redirectForLogin(url, redirect.service_logo, redirect.service_name);
                        }


                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        setLoading(false);
        handleRefreshButtonClick();

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
        Cookies.remove("credentials_array", { sameSite: "None", secure: true });

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
          handleRefreshButtonClick();
          // setAlert({ open: true, type: false, message: error.response.data });
        } else {
          // if (error?.response?.data?.error) {
          //     setAlert({ open: true, type: false, message: error.response.data.error });
          // } else {
          //     setAlert({ open: true, type: false, message: error.message });
          // }
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

  function maskPhoneNumber(phoneNumber) {
    // Check if the input is a valid 10-digit phone number
    if (/^\d{10}$/.test(phoneNumber)) {
      // Mask the first 6 digits with '*'
      var maskedNumber = "******";
      // Append the last 4 digits
      maskedNumber += phoneNumber.slice(-4);
      return maskedNumber;
    } else {
      return "Invalid phone number format";
    }
  }

  const [otp, setOTP] = useState("");
  const [loginWithOtp, setLoginWithOtp] = useState(false);

  // useEffect(() => {
  // 	setOTP("");
  // 	setPassword("");
  // }, [loginWithOtp]);

  const sendOtpNew = async () => {
    setLoading(false);
    setOTP("");

    const phoneNumberRegex = /^(?!0|1|2|3|4|5)\d{10}$/;

    if (!phoneNumberRegex.test(mobile)) {
      setAlert({
        open: true,
        type: false,
        message: "Please Enter Valid Mobile Number",
      });
      return;
    }

    if (mobile.length === 10) {
      const reqData = {
        mobile: mobile,
        // user_id: selected_user
      };

      try {
        const response = await api.post("/send-mobile-otp-new", { data: encryptBody(JSON.stringify(reqData)) });

        if (response.status === 200) {
          setAlert({
            open: true,
            type: true,
            message: "OTP sent to your mobile number.",
          });
          setMinutes(0);
          setSeconds(59);
        }
      } catch (error) {
        handleRefreshButtonClick();

        if (error?.response?.status && error.response.status === 404) {
          // const userData = await checkUser(mobile);

          Swal.fire({
            title: "Error",
            html: "Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.",
            showCancelButton: false,
            confirmButtonText: "Sign up",
            confirmButtonColor: "#1876d1",
            showCloseButton: true,
            customClass: {
              title: "swal-title",
              htmlContainer: "swal-text",
            },
            // cancelButtonText: 'No'
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Redirect to the login page using your router logic
              // Replace 'your-login-route' with the actual route for your login page

              if (service_id === "10000046") {
                route.push("/registration");
              } else {
                const peram = `?service_id=${service_id ? service_id : ""}`;
                route.push("/registration-iframe" + peram);
              }
            }
          });
        } else if (error?.response?.status && error.response.status === 500) {
          // const userData = await checkUser(mobile);

          setAlert({
            open: true,
            type: false,
            message: error.response.data.error,
          });
        }

        // if (error.response.data.error) {
        //   setAlert({
        //     open: true,
        //     type: false,
        //     message: error.response.data.error,
        //   });
        // } else {
        //   setAlert({ open: true, type: false, message: error.message });
        // }
      }
    } else {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid mobile number.",
      });
    }
  };

  const checkUserExistence = async () => {
    const reqData = {
      username: userName,
      otp: CryptoJS.AES.encrypt(
        otp,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
    };

    try {
      const response = await api.post("/user-check-mobile-email-otp", { data: encryptBody(JSON.stringify(reqData)) });

      if (response.status === 200) {
        let url = "";

        const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

        var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
        decr = decr.toString(CryptoJS.enc.Utf8);

        // const encryptedData = CryptoJS.AES.decrypt(
        // 	response.data,
        // 	secretKey
        // ).toString();

        let data = {};

        if (decr) {
          try {
            let json_data = JSON.parse(decr);
            data = json_data;

            return data;

          } catch (e) {

            console.warn(e);
          }
        }


        const peram = `?service_id=${service_id ? service_id : ""}&username=${
          mobile ? mobile : ""
        }&user_accounts=${
          response.data ? JSON.stringify(response.data) : ""
        }&redirection_details=${
          responseData ? JSON.stringify(responseData) : ""
        }`;

        if (response.data?.multipleUser.length > 1)
          route.push("./multipleAccounts" + peram);
      } else {
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
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      } else {
        if (error?.response?.data?.error) {
          setAlert({
            open: true,
            type: false,
            message: error.response.data.error,
          });
        } else {
          setAlert({
            open: true,
            type: false,
            message: error.response.data.error,
          });
        }
      }
    }
  };

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

  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Modal
        open={hideOTP}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid justifyContent={"center"} container xs={12}>
            <Grid xs={12} item style={{ justifyContent: "center" }}>
              <Stack style={{ marginLeft: 10 }} flexDirection={"row"}>
                <Image
                  src={getImagePath("/Himachal_Pradesh.png")}
                  width="40"
                  height="30"
                  alt="Himachal Pradesh Logo"
                />
                <Typography
                  textAlign={"center"}
                  style={{ fontSize: 18, marginLeft: 10, marginTop: 4 }}
                >
                  Him Access
                </Typography>
              </Stack>
              <Typography
                textAlign={"center"}
                style={{ fontSize: 16, marginTop: 16, color: "#1976d2" }}
              >
                Two Step Authentication
              </Typography>
            </Grid>

            <Typography
              textAlign={"center"}
              style={{ fontSize: 14 }}
              sx={{ mt: 1 }}
            >
              OTP successfully sent to registered Mobile {"+91"}
              {maskPhoneNumber(mobile)}
            </Typography>

            <InputOTP
              style={{ marginTop: 16, height: 50 }}
              inputClassName="input-classname"
              autoFocus
              inputType="numeric"
              length={5}
              value={otpValues}
              onChange={setOtpValues}
            />
          </Grid>

          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-end",
              marginTop: 2,
              marginRight: 2,
            }}
          >
            <div className="countdown-text-otp">
              {seconds > 0 || minutes > 0 ? (
                <Typography style={{ fontSize: 12 }}>
                  Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </Typography>
              ) : (
                <Typography style={{ fontSize: 12 }}>
                  {" Didn't recieve code?"}
                </Typography>
              )}

              <Button
                disabled={seconds > 0 || minutes > 0}
                style={{
                  fontSize: 12,

                  color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
                }}
                onClick={() => sendOtpNew()}
              >
                Resend OTP
              </Button>

              {/* <button
								disabled={seconds > 0 || minutes > 0}
								style={{
									fontSize: 12,

									color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
								}}
								// onClick={() => sendOtpNew()}
							>
								Resend OTP
							</button> */}
            </div>
          </Box>

          <Button
            // onClick={() => sethideOTP(false)}
            fullWidth
            style={{ marginTop: 24 }}
            variant="contained"
            onClick={() => authenticateOTP()}
          >
            Authenticate
          </Button>
        </Box>
      </Modal>

      {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={handleLoaderClose}
            >
                <Box style={{ background: '#FFF', padding: 20, borderRadius: 10 }}>


                    <CircularProgress color="primary" />
                </Box>
            </Backdrop> */}

      <Grid spacing={1} container>
        <Grid item xs={12}>
          <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
            {"Enter Username"}{" "}
          </Typography>
          <Input
            placeholder="Enter your username"
            size={"medium"}
            style={{ borderRadius: 5 }}
            maxLength={32}
            value={userName}
            variant={"outlined"}
            prefix={<UserOutlined className="site-form-item-icon" />}
            onChange={(e) => {
              const inputValue = e.target.value;
              setUserName(inputValue);
            }}
            allowClear
          />

          {/* <TextField focused size="small" required error={error.username && true} value={userName} onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
                                setUserName(inputValue);
                            }
                        }
                    } fullWidth label="Email / UserId" variant="outlined" /> */}
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

            <NumericInput
              label="Enter OTP"
              maxLength={5}
              value={otpValues}
              size={"medium"}
              onChange={setOtpValues}
            />

            {/* <TextField sx={{ mb: 3, ...stylesCSS.input }}
                            focused size="small" helperText="OTP sent to your email address." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" /> */}
          </Grid>
        ) : (
          <Grid item xs={12} mt={1}>
            {/* <Typography onClick={sendOtp} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using OTP?</small></Typography> */}
            <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
              {"Enter Password"}{" "}
            </Typography>
            <Input.Password
              placeholder="Enter password"
              size={"medium"}
              maxLength={32}
              style={{ borderRadius: 5 }}
              variant={"outlined"}
              prefix={<KeyOutlined className="site-form-item-icon" />}
              onChange={(e) => {
                const inputValue = e.target.value;

                if (!/[<>]/.test(inputValue)) {
                  setPassword(inputValue);
                }
              }}
              iconRender={(showPassword) =>
                showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />

            {/* <FormControl focused variant="outlined" sx={{ width: '100%' }}>
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
                        </FormControl> */}

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

        <Grid item xs={12} mt={1}>
          <Captcha ref={childRef} captcha={captcha} setCaptcha={setCaptcha} />
        </Grid>

        {/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={`I consent to Him Access Terms of use`} />

                    {error.term && (<FormHelperText error>Please Accept Terms of use</FormHelperText>)}

                </Grid> */}

        <Grid item xs={12}>
          <AntdButton
            style={{ background: "#1876D1" }}
            block
            loading={loading}
            onClick={submitHandler}
            type="primary"
          >
            Sign In
          </AntdButton>

          {/* <Button variant="contained" fullWidth onClick={submitHandler}>Sign In</Button> */}
        </Grid>
      </Grid>

      {alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
    </>
  );
};
export default UserNameIframe;
