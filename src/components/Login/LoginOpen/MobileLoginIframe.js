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
import { getImagePath } from "../../../../utils/CustomImagePath";
import CryptoJS from "crypto-js";
import { Input, Tooltip } from "antd";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import NumericInput from "@/components/NumericInput";
import { Button as AntdButton } from "antd";
import { Select, Space } from "antd";
import Swal from "sweetalert2";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
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

const MobileLoginIframe = ({ service_id, handleChange, redirectForLogin }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [term, setTerm] = useState(true);
  const [captcha, setCaptcha] = useState(false);
  const [selectedUsername, setselectedUsername] = useState("");

  const [alert, setAlert] = useState({
    open: false,
    type: false,
    message: null,
  });

  const [otp, setOTP] = useState("");
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState([]);

  const [serviceRedirect, setserviceRedirect] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [enableOTP, seteEnableOTP] = useState(false);

  const [recheckUser, setrecheckUser] = useState(0);

  const [verifiedUser, setverifiedUser] = useState(false);

  const [hideOTP, setHideOTP] = useState(true);

  const childRef = useRef();

  const [error, setError] = useState({
    mobile: false,
    password: false,
    term: false,
  });

  const route = useRouter();

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
      formData.append("login_type", "otp");

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
      }

      return null; // Return null if no data or statusCode isn't '200 OK'
    } catch (error) {
      handleRefreshButtonClick();

      if (error?.response?.status && error.response.status === 400) {
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      }

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
      } else {
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      }

      return null; // Return null in case of an error
    }
  }

  const checkUser = async (mobile) => {
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




         }
    } catch (error) {
      handleRefreshButtonClick();
    }
  };

  const sendOtpNew = async (selected_user) => {
    setLoading(false);
    setEmailList([]);
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
          seteEnableOTP(true);
          setHideOTP(false);
          setLoginWithOtp(true);
          setOtpSent(true);
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false, type: false, message: null });
  };

  const checkExistingUser = async () => {
    if (otp.length < 5) {
      return setAlert({
        open: true,
        type: false,
        message: "Please Enter Correct OTP",
      });
    }

    // if (captcha !== true) {
    //   return setAlert({
    //     open: true,
    //     type: false,
    //     message: "Please Enter Correct Captcha",
    //   });
    // }

    let existence = await checkUserExistence();

    // let reqData ={};
    // const peram = `?service_id=${service_id ? service_id : ""}&username=${mobile ? mobile : ""}&user_accounts=${existence ? JSON.stringify(existence) : ""}&redirection_details=${JSON.stringify({})}`;
    // route.push('./multipleAccounts' + peram)
    const { multipleUser, service_id: redirect_service_ids } = existence || {};

    setserviceRedirect(redirect_service_ids);
    setHideOTP(false);

    if (multipleUser && multipleUser.length > 0) {
      let array = [];
      for (let a = 0; a < multipleUser.length; a++) {
        let object = {
          label: multipleUser[a].userName,
          value: multipleUser[a].id,
        };
        setHideOTP(true);

        let obj = {
          label: "Please Select Username",
          value: "0000",
        };
        if (a === 0) {
          setselectedUsername("0000");
          array.push(obj);
        }

        array.push(object);
      }
      setEmailList(array);
    }
    if (multipleUser && multipleUser.length === 1) {
      setverifiedUser(true);
      // sendOtpNew("");

      setselectedUsername(multipleUser[0].id);
    }

    if (multipleUser && multipleUser.length === 0) {
      setverifiedUser(true);
      setHideOTP(true);
      // sendOtpNew("");

      setselectedUsername(null);
      setrecheckUser(1);

      if (recheckUser > 0) {
        handleRefreshButtonClick();

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
      }
    }
  };

  const handleRefreshButtonClick = () => {
    // Handle the captcha refresh button click in the parent component
    setCaptcha("");
    if (childRef.current && childRef.current.refreshCaptcha) {
      childRef.current.refreshCaptcha();
    }
  };

  const submitHandlerOtp = async () => {
    if (mobile.length !== 10) {
      setAlert({
        open: true,
        type: false,
        message: "Please Enter Correct Mobile Number",
      });

      return;
    }

    if (otp.length !== 5) {
      setAlert({
        open: true,
        type: false,
        message: "Please Enter Correct OTP",
      });

      return;
    }

    if (captcha !== true) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter the CAPTCHA code to proceed",
      });

      return;
    }

    if (selectedUsername === "0000") {
      setAlert({
        open: true,
        type: false,
        message: "Please Select Username",
      });

      return;
    }

    const newError = {
      mobile: mobile.length < 1,
      otp: otp.length < 1,
      term: !term,
    };

    setLoading(false);
    setError(newError);

    if (Object.values(newError).every((value) => value !== true)) {
      try {
        const userDetails = await fetch(getImagePath("/api/user-info"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userDetail = await userDetails.json();

        if (emailList && emailList.length > 0) {
          const reqData = {
            user_id: selectedUsername,
            service_id: service_id,
            BrowserDetails: userDetail,
            login_type: "mobile",
          };

          const response = await api.post("/check-secondary-mapping", { data: encryptBody(JSON.stringify(reqData)) });

          // const { secondaryMapping, redirect, sso_id, PrimaryData } =
          // 	response.data || {};

          if (response.status == 200) {
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
                    PrimaryData
                      ? JSON.stringify(PrimaryData)
                      : JSON.stringify({})
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
                    return;
                  }

                  redirectForLogin(
                    url,
                    redirect.service_logo,
                    redirect.service_name
                  );
                }
              } catch (e) {}
            }
          }

          setLoading(false);
        }
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
    }
  };

  const checkFinalUsernameSubmit = async () => {
    if (emailList.length > 0) {
      if (serviceRedirect.includes("10000038")) {
        if (password.length < 4) {
          return setAlert({
            open: true,
            type: false,
            message: "Please Enter Correct Password",
          });
        }
        if (captcha !== true) {
          return setAlert({
            open: true,
            type: false,
            message: "Please enter the CAPTCHA code to proceed",
          });
        }
        if (selectedUsername === "0000") {
          setAlert({
            open: true,
            type: false,
            message: "Please Select Username",
          });

          return;
        }

        let user = checkUser(selectedUsername);
      } else {
        submitHandlerOtp();
      }
    } else {
      checkExistingUser();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          seteEnableOTP(false);
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

  const checkUserExistence = async () => {
    const reqData = {
      username: mobile,
      otp: CryptoJS.AES.encrypt(
        otp,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      service_id: service_id,
    };

    setEmailList([]);
    setselectedUsername("");

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
            setHideOTP(false);
            return data;
          }
          catch(e){
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
      handleRefreshButtonClick();
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

        // setAlert({
        //   open: true,
        //   type: false,
        //   message: error?.response?.data.error,
        // });
      } else {
        if (error?.response?.data?.error) {
          setAlert({
            open: true,
            type: false,
            message: error?.response?.data?.error,
          });
        } else {
          setAlert({
            open: true,
            type: false,
            message: error?.response?.data?.error,
          });
        }
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid spacing={1} container>
        <Grid item xs={12}>
          <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
            {"Enter Mobile Number"}{" "}
          </Typography>
          <Space.Compact style={{ width: "100%" }}>
            <NumericInput
              maxLength={10}
              value={mobile}
              size={"medium"}
              label={"Enter your Mobile Number"}
              onChange={(e) => {
                const inputValue = e;
                if (/^[\d+]*$/.test(inputValue)) {
                  setMobile(inputValue);
                  setEmailList([]);
                  setOTP("");
                  setselectedUsername("");
                  setserviceRedirect("");
                  setOtpSent(false);
                  setHideOTP(true);

                  if (inputValue.length === 10) {
                    setMobile(inputValue);
                    setEmailList([]);
                    setverifiedUser(false);
                    setOTP("");
                    setselectedUsername("");
                    setserviceRedirect("");

                    // setTimeout(() => {

                    //     UserCheckMobile(inputValue)
                    //     // sendOtp(inputValue)
                    // }, 800)
                  }
                }
              }}
            />
            <AntdButton
              disabled={enableOTP}
              onClick={() => sendOtpNew()}
              type="primary"
            >
              Get OTP
            </AntdButton>
          </Space.Compact>
        </Grid>
        {/* otpSent && emailList.length === 0 */}
        {!hideOTP && (
          <Grid item xs={12}>
            <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
              {"Enter OTP"}{" "}
            </Typography>
            <NumericInput
              style={{ borderRadius: 5 }}
              maxLength={6}
              label={"Enter OTP"}
              onBlur={() => checkExistingUser()}
              // onBlur={() => submitHandlerOtp()}
              onChange={(e) => setOTP(e)}
              value={otp}
            />

            {/* <TextField sx={{ mb: 3, ...stylesCSS.input }} focused size="small" required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" /> */}
          </Grid>
        )}

        {emailList.length > 1 && (
          <Stack direction="row" spacing={1} ml={1}>
            <TaskAltIcon fontSize="small" color="success" />
            <Typography color={"green"} style={{ fontSize: 12, marginLeft: 5 }}>
              OTP verified successfully
            </Typography>
          </Stack>
        )}

        <Grid item xs={12}>
          {emailList.length > 2 && (
            <>
              <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
                {"Select Username"}{" "}
              </Typography>

              <Select
                placeholder="Please select Username"
                className="custom-select"
                style={{ width: "100%", borderRadius: 5, borderColor: "red" }}
                options={emailList}
                value={selectedUsername ? selectedUsername : null}
                onChange={(e, options) => {
                  setselectedUsername(e);
                  setOtpSent(false);
                  setverifiedUser(true);
                }}
              />
            </>
          )}

          {serviceRedirect &&
            serviceRedirect.includes("10000038") &&
            emailList.length > 1 && (
              <>
                <Typography
                  color={"#1876d1"}
                  style={{
                    fontSize: 12,
                    marginTop: emailList.length > 1 ? 10 : 0,
                  }}
                >
                  {"Enter Password"}{" "}
                </Typography>
                <Input.Password
                  placeholder="Enter password"
                  size={"medium"}
                  style={{
                    borderRadius: 5,
                  }}
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
              </>
            )}
        </Grid>

        {otpSent && (
          <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
            <div className="countdown-text">
              {seconds > 0 || minutes > 0 ? (
                <Typography variant="body2">
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
                onClick={() => sendOtpNew()}
              >
                Resend OTP
              </button>
            </div>
          </Box>
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
            disabled={verifiedUser ? false : true}
            loading={loading}
            onClick={() => checkFinalUsernameSubmit()}
            type="primary"
          >
            {"Sign In"}
          </AntdButton>

          {/* <Button variant="contained" fullWidth onClick={loginWithOtp ? submitHandlerOtp : submitHandler}>Sign In</Button> */}
        </Grid>
      </Grid>

      {alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
    </>
  );
};
export default MobileLoginIframe;
