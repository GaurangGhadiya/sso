import { useRef, useState } from "react";
import AadhaarInput from "./AadhaarInput";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getImagePath } from "../../../utils/CustomImagePath";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Select, Space } from "antd";

import {
  InfoCircleOutlined,
  UserOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Input, Tooltip } from "antd";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { Button as AntdButton } from "antd";
import NumericInput from "@/components/NumericInput";
import AadhaarNumericInput from "../AadhaarTextInput";
import Swal from "sweetalert2";
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

const {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} = require("@mui/material");

const AadhaarLogin = ({ redirectForLogin, service_id, iframe }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otp, setOTP] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [term, setTerm] = useState(false);
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: false,
    message: null,
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [selectedUsername, setselectedUsername] = useState("");

  const [emailList, setEmailList] = useState([]);

  const [emailCount, setEmailCount] = useState(0);

  const [selectedDropdown, setSelectedDropdown] = useState("Aadhaar");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const childRef = useRef();

  const route = useRouter();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false, type: false, message: null });
  };

  const [error, setError] = useState({});

  const sendAadhaarOTP = async () => {
    setOTP("");
    const plainAadhaar = aadhaar.replaceAll("-", "");

    try {
      const reqData = {
        uid: CryptoJS.AES.encrypt(
          plainAadhaar,
          process.env.NEXT_PUBLIC_API_SECRET_KEY
        ).toString(),
      };

      const response = await api.post("/otp-aadhaar", reqData);

      if (response.status === 200) {
        // dispatch(callAlert({ message: "OTP sent to your registered mobile number (" + response.data + ")", type: 'SUCCESS' }))
        setOtpSent(response.data);
        setLoginWithOtp(true);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(
          callAlert({ message: error.response.data.error, type: "FAILED" })
        );
      } else if (error?.response?.data) {
        dispatch(
          callAlert({ message: error.response.data.error, type: "FAILED" })
        );
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
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
      formData.append(
        "login_type",
        selectedDropdown === "Email" ? "email" : ""
      );

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
      } else if (response.data.statusCode === "300") {
        return response.data.statusDesc;
      } else if (response.data.statusCode === "400") {
        return response.data.statusDesc;
      }

      return null; // Return null if no data or statusCode isn't '200 OK'
    } catch (error) {
      if (error?.response?.status && error.response.status === 400) {
        setAlert({
          open: true,
          type: false,
          message: error?.response?.data.error,
        });
      } else if (error?.response?.status && error.response.status === 404) {
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
      }

      return null; // Return null in case of an error
    }
  }

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const checkEmailExistence = async () => {
    if (isValidEmail(email)) {
      try {
        const reqData = {
          email: email,
        };

        const responseURL = await api.post("/check-email", reqData);

        const { emailCount, emailUsers } = responseURL.data || {};
        if (emailCount) {
          setEmailCount(emailCount);
        }

        if (emailUsers.length > 0) {
          let array = [];
          for (let a = 0; a < emailUsers.length; a++) {
            let object = {
              label: emailUsers[a].userName,
              value: emailUsers[a].userName,
            };

            let obj = {
              label: "Please Select Username",
              value: "0000",
            };
            if (a === 0) {
              setselectedUsername("0000");
              array.push(obj);
            }

            array.push(object);

            if (emailUsers.length == 1) {
              setselectedUsername(emailUsers[a].userName);
            }
          }

          setEmailList(array);
        }
        if (emailUsers.length == 0) {
          setselectedUsername(email);
        }
      } catch (e) {}
    }
  };

  const AadhaarEmailLogin = async () => {
    const userDetails = await fetch(getImagePath("/api/user-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (captcha !== true) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter the CAPTCHA code to proceed",
      });
      return;
    }

    if (password.length < 4) {
      setAlert({
        open: true,
        type: false,
        message: "Please Enter Correct Password",
      });
      return;
    }
    if (selectedDropdown === "Email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailPattern.test(email)) {
        setAlert({
          open: true,
          type: false,
          message: "Please Enter Valid Email",
        });
        return;
      }

      if (email.length < 4) {
        setAlert({
          open: true,
          type: false,
          message: "Please Enter Valid Email",
        });
        return;
      }
    }
    if (selectedDropdown === "Aadhaar") {
      if (aadhaar.length < 14) {
        setAlert({
          open: true,
          type: false,
          message: "Please enter valid 12 digit Aadhaar number",
        });
        return;
      }
    }

    const userDetail = await userDetails.json();

    try {
      const plainAadhaar = aadhaar.replaceAll("-", "");
      let usr = "";
      if (selectedUsername) {
        usr = selectedUsername;
      } else if (selectedDropdown === "Aadhaar" && !selectedUsername) {
        usr = plainAadhaar;
      } else if (selectedDropdown === "Email" && !selectedUsername) {
        usr = email;
      }

      const reqData = {
        userName: usr,
        email: email,
        aadhaar: plainAadhaar,
        login_type: selectedDropdown,
        service_id: service_id ? service_id : "1000046",
        browserDetails: userDetail,
        password: password
          ? CryptoJS.AES.encrypt(
              password,
              process.env.NEXT_PUBLIC_API_SECRET_KEY
            ).toString()
          : "",
      };

      const responseURL = await api.post("/aadhaar-email-login", reqData);

      const { secondaryMapping, redirectobj, userData, PrimaryData } =
        responseURL.data || {};

      setLoading(false);

      if (secondaryMapping.length > 0) {
        const peram = `?service_id=${service_id ? service_id : ""}&sso_id=${
          userData.id
        }&mapped_list=${
          secondaryMapping
            ? JSON.stringify(secondaryMapping)
            : JSON.stringify({})
        }&redirection_details=${
          redirectobj ? JSON.stringify(redirectobj) : JSON.stringify({})
        }&PrimaryData=${
          PrimaryData ? JSON.stringify(PrimaryData) : JSON.stringify({})
        }`;
        route.push("/mapping" + peram);
      } else {
        if (redirectobj && redirectobj.success_url) {
          let url = redirectobj.success_url;

          const parameter = "token=" + redirectobj.tempToken;

          if (url.includes("?")) {
            url += "&" + parameter;
          } else {
            url += "?" + parameter;
          }
          if (redirectobj.redirect_service_id) {
            url += "&service_id=" + redirectobj.redirect_service_id;
          }

          redirectForLogin(
            url,
            redirectobj.service_logo,
            redirectobj.service_name
          );
        } else {
          if (!service_id) {
            Cookies.set("role", "user", { expires: expirationDate });
            Cookies.set("uid", userData.id, { expires: expirationDate });
            Cookies.set("name", userData.name, { expires: expirationDate });

            route.push("/dashboard");
          }
        }
      }
    } catch (error) {
      if (error?.response?.status && error.response.status === 404) {
        handleRefreshButtonClick();
        if (service_id) {
          if (selectedDropdown === "Email") {
            const userData = await checkUser("933165437");
          } else {
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
                  const peram = `?service_id=${service_id ? service_id : ""}`;
                  route.push("/registration-iframe" + peram);
                } else if (!service_id) {
                  route.push("/registration");
                } else {
                  const peram = `?service_id=${service_id ? service_id : ""}`;
                  route.push("/registration-iframe" + peram);
                }
              }
            });
          }

          // if (userData && userData.status === 200) {
          //   // ${userData.data.aadhaar_number}
          //   // const peram = `?service_id=${service_id}&aadhaar_number=489772669045&mobile=8963957654&email=pankajbatham27@gmail.com`;
          //   // route.push("/registration");
          // } else {

          //   setAlert({
          //     open: true,
          //     type: false,
          //     message: error.response.data.error,
          //   });
          // }
        } else {
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
                const peram = `?service_id=${service_id ? service_id : ""}`;
                route.push("/registration-iframe" + peram);
              } else if (!service_id) {
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
          //   message: error.response.data.error,
          // });
        }

        // setAlert({ open: true, type: false, message: error.response.data });
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

  const handleRefreshButtonClick = () => {
    // Handle the captcha refresh button click in the parent component
    if (childRef.current && childRef.current.refreshCaptcha) {
      childRef.current.refreshCaptcha();
    }
  };

  const checkUser = async () => {
    try {
      const reqData = {
        service_id: service_id,
      };

      const responseURL = await api.post("/checkUserUrl", reqData);

      if (responseURL.status === 200) {
        const responseData = responseURL.data;

        if (responseData.user_check_api) {
          const reqCLData = {
            service_id: service_id,
            user_name: selectedDropdown === "Email" ? email : aadhaar,
          };

          getUser(
            responseData.user_check_api,
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
                const peram = `?service_id=${
                  service_id ? service_id : ""
                }&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${
                  mobileNo ? mobileNo : ""
                }&email=${JSON.stringify(email ? email : "")}&userName=${
                  email ? email : ""
                }&userPassword=${
                  userPassword ? userPassword : ""
                }&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${
                  dob ? dob : ""
                }&umap=${
                  UserCredentialsArray
                    ? JSON.stringify(UserCredentialsArray)
                    : ""
                }&umap_var=${email ? JSON.stringify(email) : ""}&username=${
                  email ? email : ""
                }&primary_user=${
                  primary_user ? JSON.stringify(primary_user) : ""
                }`;
                route.push("/registration-iframe" + peram);
              }

              // const { firstName, middleName, lastName, gender, dob, UserCredentialsArray, aaadharNo, email, userPassword, mobileNo } = user || {}

              // let primary_user = {};

              // for (let i = 0; i < UserCredentialsArray.length; i++) {
              //     if (UserCredentialsArray[i].primaryUser) {
              //         primary_user = UserCredentialsArray[i];
              //     }

              // }

              // setLoading(false);
              // // return user;

              // if (email.length > 1) {

              //     const peram = `?service_id=${service_id ? service_id : ""}&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${mobileNo ? mobileNo : ""}&email=${JSON.stringify(email ? email : "")}&userName=${aadhaar ? aadhaar : ""}&userPassword=${userPassword ? userPassword : ""}&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${dob ? dob : ""}&umap=${UserCredentialsArray ? JSON.stringify(UserCredentialsArray) : ""}&umap_var=${email ? JSON.stringify(email) : ""}&username=${userName ? aadhaar : ""}&primary_user=${primary_user ? JSON.stringify(primary_user) : ""}`;
              //     route.push('/registration-iframe' + peram)

              //     // const peram = `?service_id=${service_id ? service_id : ""}&umap=${UserCredentialsArray ? JSON.stringify(UserCredentialsArray) : ""}&umap_var=${email ? JSON.stringify(email) : ""}&username=${userName ? userName : ""}`;

              //     // route.push('/mapping' + peram)

              // }
              // else {
              //     const peram = `?service_id=${service_id ? service_id : ""}&aadhaar_number=${aaadharNo ? aaadharNo : ""}&mobile=${mobileNo ? mobileNo : ""}&email=${JSON.stringify(email ? email : "")}&userName=${aadhaar ? aadhaar : ""}&userPassword=${userPassword ? userPassword : ""}&is_iframe=${true}&gender=${gender ? gender : ""}&dob=${dob ? dob : ""}`;
              //     route.push('/registration-iframe' + peram)

              // }
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

              console.error("Error occurred while getting user:", error);
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
      }
    } catch (error) {
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
          } else if (!service_id) {
            route.push("/registration");
          } else {
            const peram = `?service_id=${service_id ? service_id : ""}`;
            route.push("/registration-iframe" + peram);
          }
        }
      });
      console.error("Error:", error);
    }
  };

  const submitHandlerOtp = async () => {
    const plainAadhaar = aadhaar ? aadhaar.replaceAll("-", "") : "";

    if (password.length > 0) {
      try {
        const userDetails = await fetch(getImagePath("/api/user-info"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const userDetail = await userDetails.json();

        const reqData = {
          username: CryptoJS.AES.encrypt(
            plainAadhaar,
            process.env.NEXT_PUBLIC_API_SECRET_KEY
          ).toString(),
          password: CryptoJS.AES.encrypt(
            password,
            process.env.NEXT_PUBLIC_API_SECRET_KEY
          ).toString(),
          otp: otp,
          userDetails: userDetail,
        };

        if (service_id) {
          const reqData = {
            mobile: loginWithOtp ? otpSent.toString() : "",
            username: plainAadhaar
              ? CryptoJS.AES.encrypt(
                  plainAadhaar,
                  process.env.NEXT_PUBLIC_API_SECRET_KEY
                ).toString()
              : plainAadhaar,
            password: password
              ? CryptoJS.AES.encrypt(
                  password,
                  process.env.NEXT_PUBLIC_API_SECRET_KEY
                ).toString()
              : "",
            otp: otp,
            service_id: service_id,
            userDetails: userDetail,
          };

          const response = await api.post("/user-login-mobile-open", reqData);

          if (response.status === 200) {
            const responseData = response.data;

            let url = responseData.success_url;

            const parameter = "token=" + responseData.tempToken;

            if (url.includes("?")) {
              url += "&" + parameter;
            } else {
              url += "?" + parameter;
            }

            if (responseData.redirect_service_id) {
              url += "&service_id=" + responseData.redirect_service_id;
            }

            if (iframe) {
              redirectForLogin(
                url,
                responseData.service_logo,
                responseData.service_name
              );

              // window.top.location.href = url;
            } else {
              redirectForLogin(
                url,
                responseData.service_logo,
                responseData.service_name
              );
            }
          }
        } else {
          const reqData = {
            mobile: otpSent.toString(),
            otp: otp,
            userDetails: userDetail,
            username: otp
              ? ""
              : plainAadhaar
              ? CryptoJS.AES.encrypt(
                  plainAadhaar,
                  process.env.NEXT_PUBLIC_API_SECRET_KEY
                ).toString()
              : plainAadhaar,
            password: password
              ? CryptoJS.AES.encrypt(
                  password,
                  process.env.NEXT_PUBLIC_API_SECRET_KEY
                ).toString()
              : "",
          };

          const response = await api.post("/user-login", reqData);

          if (response.status === 200) {
            const responseData = response.data;

            Cookies.set("role", "user", { expires: expirationDate });
            Cookies.set("uid", responseData.id, { expires: expirationDate });
            Cookies.set("name", responseData.name, { expires: expirationDate });

            route.push("/dashboard");
          }
        }
      } catch (error) {
        if (error?.response?.status && error.response.status === 404) {

          if (service_id) {
            const userData = await checkUser("933165437");

            if (userData && userData.status === 200) {
              // ${userData.data.aadhaar_number}
              // const peram = `?service_id=${service_id}&aadhaar_number=489772669045&mobile=8963957654&email=pankajbatham27@gmail.com`;

              route.push("/registration");
            } else {
              setAlert({
                open: true,
                type: false,
                message: error.response.data.error,
              });
            }
          } else {
            setAlert({
              open: true,
              type: false,
              message: error.response.data.error,
            });
          }

          // setAlert({ open: true, type: false, message: error.response.data });
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
      const newError = {
        mobile: otpSent.length < 1,
        otp: otp.length < 1,
        term: false,
      };


      setError(newError);

      if (
        Object.values(newError).every((value) => value !== true) &&
        captcha === true
      ) {
        try {
          const userDetails = await fetch(getImagePath("/api/user-info"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const userDetail = await userDetails.json();

          if (userDetail) {
            if (service_id) {
              const reqData = {
                mobile: loginWithOtp ? otpSent.toString() : "",
                otp: otp,
                service_id: service_id,
                userDetails: userDetail,
              };

              const response = await api.post(
                "/user-login-mobile-open",
                reqData
              );

              if (response.status === 200) {
                const responseData = response.data;

                let url = responseData.success_url;

                const parameter = "token=" + responseData.tempToken;

                if (url.includes("?")) {
                  url += "&" + parameter;
                } else {
                  url += "?" + parameter;
                }

                if (responseData.redirect_service_id) {
                  url += "&service_id=" + responseData.redirect_service_id;
                }

                if (service_id) {
                  redirectForLogin(
                    url,
                    responseData.service_logo,
                    responseData.service_name
                  );

                  // window.top.location.href = url;
                } else {
                  redirectForLogin(
                    url,
                    responseData.service_logo,
                    responseData.service_name
                  );
                }
              }
            } else {
              const reqData = {
                mobile: otpSent.toString(),
                otp: otp,
                userDetails: userDetail,
              };

              const response = await api.post("/user-login-mobile", reqData);

              if (response.status === 200) {
                const responseData = response.data;

                Cookies.set("role", "user", { expires: expirationDate });
                Cookies.set("uid", responseData.id, { expires: expirationDate });
                Cookies.set("name", responseData.name, { expires: expirationDate });

                route.push("/dashboard");
              }
            }
          }
        } catch (error) {
          if (error?.response?.status && error.response.status === 404) {
            if (service_id) {
              const userData = await checkUser("933165437");

              if (userData && userData.status === 200) {
                // ${userData.data.aadhaar_number}
                // const peram = `?service_id=${service_id}&aadhaar_number=489772669045&mobile=8963957654&email=pankajbatham27@gmail.com`;

                route.push("/registration");
              } else {
                // setAlert({ open: true, type: false, message: error.response.data });
              }
            } else {
              setAlert({
                open: true,
                type: false,
                message: error.response.data.error,
              });
            }

            // setAlert({ open: true, type: false, message: error.response.data });
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
          message: "Please Enter Correct Credentials",
        });
      }
    }
  };

  const handleChange = (value) => {
    setSelectedDropdown(value);
    setEmail("");
    setAadhaar("");
    setPassword("");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Grid spacing={3} container>
      <Grid item xs={12}>
        <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
          {"Select Login Type"}{" "}
        </Typography>
        <Select
          defaultValue="Aadhaar Number"
          placeholder={"Select Login Type"}
          size="medium"
          variant={"outlined"}
          style={{ width: "100%", marginBottom: 16, borderRadius: 5 }}
          onChange={handleChange}
          options={[
            {
              value: "Aadhaar",
              label: "Aadhaar Number",
            },
            {
              value: "Email",
              label: "Email ",
            },
          ]}
        />

        <Box mb={1}>
          {selectedDropdown === "Aadhaar" && (
            <>
              <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
                {"Enter Aadhaar "}{" "}
              </Typography>

              <AadhaarNumericInput
                maxLength={14}
                style={{ borderRadius: 5 }}
                value={aadhaar}
                label={"Enter your Aadhaar Number"}
                onChange={setAadhaar}
                allowClear
                size={"medium"}
              />
            </>
          )}

          {selectedDropdown === "Email" && (
            <>
              <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
                {"Enter Email "}{" "}
              </Typography>
              <Input
                placeholder="Enter your Email Address"
                size={"medium"}
                variant={"outlined"}
                style={{ borderRadius: 5 }}
                value={email}
                prefix={<UserOutlined className="site-form-item-icon" />}
                onChange={(e) => {
                  setEmailList([]);
                  setselectedUsername("");
                  setEmail(e.target.value);
                }}
                onBlur={() => {
                  checkEmailExistence();
                }}
                allowClear
              />
            </>
          )}

          {emailList.length > 2 && (
            <>
              <Typography
                color={"#1876d1"}
                style={{ fontSize: 12, marginTop: 10 }}
              >
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

                  // setOTP("");
                  // sendOtpNew(e);
                }}
              />
            </>

            // <Select
            //   placeholder="Please select Username"
            //   className="custom-select"
            //   style={{ width: "100%", borderRadius: 5, borderColor: "red" }}
            //   defaultValue={selectedUsername}
            //   options={emailList}
            //   onChange={(e) => {
            //     setselectedUsername(e);
            //   }}
            // />
          )}

          <Typography color={"#1876d1"} style={{ fontSize: 12, marginTop: 16 }}>
            {"Enter Password "}{" "}
          </Typography>

          <Input.Password
            style={{ borderRadius: 5 }}
            placeholder="Enter password"
            maxLength={32}
            value={password}
            size={"medium"}
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

          {/* <AadhaarInput aadhaar={aadhaar} setAadhaar={setAadhaar} /> */}
        </Box>

        {loginWithOtp ? (
          <Grid item xs={12}>
            <Typography
              onClick={() => {
                setLoginWithOtp(false);
                setOTP("");
              }}
              color={"#4CAF50"}
              sx={{ cursor: "pointer" }}
              textAlign={"right"}
              variant="body2"
            >
              <small>Login using Password?</small>
            </Typography>
            {/* <TextField helperText="OTP sent to your mobile number." required error={error.otp && true} onChange={(e) => setOTP(e.target.value)} value={otp} fullWidth label="OTP" variant="outlined" /> */}
          </Grid>
        ) : (
          <Grid item xs={12} mb={2} mt={2}>
            {/* <Typography onClick={() => sendAadhaarOTP()} color={'#4CAF50'} sx={{ cursor: 'pointer' }} textAlign={'right'} variant="body2"><small>Login using OTP?</small></Typography> */}

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

        {loginWithOtp && (
          <>
            <Grid item xs={12} mb={2}>
              <TextField
                sx={{ mb: 3, ...stylesCSS.input }}
                size="small"
                helperText={`OTP sent to your mobile number (XXX-XXX-${otpSent
                  .toString()
                  .slice(-4)}).`}
                required
                onChange={(e) => setOTP(e.target.value)}
                value={otp}
                fullWidth
                label="OTP"
                variant="outlined"
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} mb={1}>
          <Captcha ref={childRef} captcha={captcha} setCaptcha={setCaptcha} />
        </Grid>

        {/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={<small style={{ fontSize: '11px' }}>I consent to Him Access Terms of use</small>} />
                    {error.term && (<FormHelperText error>Please Accept Terms of use</FormHelperText>)}
                </Grid> */}

        <Grid item xs={12}>
          {
            loginWithOtp && (
              <AntdButton
                style={{ background: "#1876D1" }}
                block
                loading={loading}
                onClick={() => AadhaarEmailLogin()}
                type="primary"
              >
                Sign In
              </AntdButton>
            )

            // <Button variant="contained" fullWidth onClick={otpSent ? submitHandlerOtp : sendAadhaarOTP}>{"Sign In"}</Button>
          }

          {
            !loginWithOtp && (
              <AntdButton
                style={{ background: "#1876D1" }}
                block
                loading={loading}
                onClick={() => AadhaarEmailLogin()}
                type="primary"
              >
                Sign In
              </AntdButton>
            )

            // <Button variant="contained" fullWidth onClick={submitHandlerOtp}>{"Sign In"}</Button>
          }

          {/* <Button variant="contained" fullWidth onClick={otpSent ? submitHandlerOtp : sendAadhaarOTP}>{otpSent ? "Sign In" : "Send OTP"}</Button> */}
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {alert.message && (
          <Alert severity={alert.type === true ? "success" : "error"}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </Grid>
  );
};
export default AadhaarLogin;
