import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import { getImagePath } from "../../../utils/CustomImagePath";
import HeaderUser from "../UI/HeaderUser";
import Swal from "sweetalert2";

import CryptoJS from "crypto-js";
import StepTwoNew from "./StepTowNew";

import { Divider, Steps } from "antd";
import Image from "next/image";
import AlertModal from "../AlertModal";
import { encryptBody } from "../../../utils/globalEncryption";
import expirationDate from "../../../utils/cookiesExpire";

const customStepLabelStyles = {
  "& .MuiStepLabel-label": {
    color: "black", // Change color
    fontWeight: "bold", // Change font weight
  },
};

const StepperForm = ({
  reqAadhaar_number,
  reqMobile,
  reqEmail,
  service_id,
  userPassword,
  userr_name,
  extra_email,
  is_iframe,
  users_list,
  mobile_verified,
  email_verified,
  umap,
  umap_var,
  username,
  primary_user,
  login_type,
  setaadhaarFoundUser,
  aadhaarFoundUser,
}) => {
  const router = useRouter();
  const [device, setDevice] = useState("desktop");
  const [activeStep, setActiveStep] = useState(0);

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [consent, setConsent] = useState(false);

  const [mobile, setMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);

  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("")
  const [emailVerified, setEmailVerified] = useState(false);

  const [ekyc_status, setEkyc_status] = useState(0);

  const [emailVerifiedStep, setEmailVerifiedStep] = useState(false);
  const [mobileVerifiedStep, setMobileVerifiedStep] = useState(false);

  const [aadhaarVerified, setAadhaarVerified] = useState(0);

  const [primaryUserDetail, setprimaryUserDetail] = useState({});

  const [loading, setLoading] = useState(false);

  const [pDetail, setPDetail] = useState([]);

  const [sDetail, setsDetail] = useState([]);

  const [ssoUsername, setssoUsername] = useState("");

  const [usernameValidated, setUsernameValidated] = useState(false);

  const [passwordType, setPasswordType] = useState("Yes");

  const [user_name, setUser_name] = useState("");
  const [user_password, setUser_password] = useState("");

  const [edistrictCheck, setEdistrictCheck] = useState(false);

  const [umapArray, setUmapArray] = useState([]);

  const [ssoId, setSsoId] = useState(0);
  const [emailAsUsername, setEmailAsUsername] = useState(false);
  const [dobVerify, setdobVerify] = useState(false);

  const [skipAadhaar, setskipAadhaar] = useState(false);

  const [vaultId, setVaultId] = useState("");

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [emailMinutes, setEmailMinutes] = useState(0);
  const [emailSeconds, setEmailSeconds] = useState(0);

  const [enableEmailOTP, seteEnableEmailOTP] = useState(false);

  const [enableOTP, seteEnableOTP] = useState(false);

  const [himMemberId, sethimMemberId] = useState("");

  const [enteredDob, setEnteredDob] = useState("");
  const [enteredFullname, setEnteredFullname] = useState("");

  const [himParivarId, sethimParivarId] = useState("");
  const [rationId, setRationId] = useState("");

  const [himparivarList, sethimparivarList] = useState([]);

  const [rationList, setRationList] = useState([]);

  const [verificationType, setVerificationType] = useState("Aadhaar");

  const [himDetail, sethimDetail] = useState("");

  const [rationDetail, setrationDetail] = useState("");

  let user_info = "";
  let primary_list_to_be_sent = [];
  let secondary_list_to_be_sent = [];

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [disableUsername, setDisableUsername] = useState(true);

  // let sso = 0;

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (emailSeconds > 0) {
        setEmailSeconds(emailSeconds - 1);
      }

      if (emailSeconds === 0) {
        if (emailMinutes === 0) {
          seteEnableEmailOTP(false);
          clearInterval(interval);
        } else {
          setEmailSeconds(59);
          setEmailMinutes(emailMinutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [emailSeconds]);

  useEffect(() => {
    if (primary_user) {
      try {
        let primary_users = JSON.parse(primary_user);
        setprimaryUserDetail(primary_users);

        setMobile(primary_users.mobileNo);
        setEmail(primary_users.email);
        setUser_name(primary_users.userName);
      } catch (error) {}
    }

    let umap_array = [];

    if (umap) {
      try {
        umap_array = JSON.parse(umap);
        setUmapArray(umap_array);
      } catch (error) {}
    }
  }, [primary_user]);

  const redirectForLogin = (url, logo, service_name) => {
    var iframe = document.getElementById("iframe");

    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
    setLoading(false);
    window.top.location.href = url;
  };

  function generateRandomString() {
    const randomPart = Math.floor(Math.random() * 10000);

    const timestamp = Date.now();

    const randomString = `Test_${timestamp}_${randomPart}`;

    return randomString;
  }

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [co, setCo] = useState("");
  const [street, setStreet] = useState("");
  const [lm, setLm] = useState("");
  const [loc, setLoc] = useState("");
  const [vtc, setVtc] = useState("");
  const [dist, setDist] = useState("");
  const [state, setState] = useState("Himachal Pradesh");
  const [pc, setPc] = useState("");

  const [userCalled, setUserCalled] = useState(true);

  const [usernameError, setUsernameError] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    type: false,
    message: null,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ open: false, type: false, message: null });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const steps = [
    "ID Verification",
    "Personal Details",
    // 'Contact Address',
    // 'Mobile Verification',
    // 'Email Verification'
  ];

  function isPasswordValid(password) {
    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/;

    if (!lengthRegex.test(password)) {
      return "Password must be at least 8 characters long.";
    }

    if (!uppercaseRegex.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!lowercaseRegex.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!digitRegex.test(password)) {
      return "Password must contain at least one digit.";
    }

    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
    }

    return true;
  }

  function isPasswordMatching(password, password2) {
    if (password === password2) {
      return true;
    } else return "Password must match with the new password.";
  }

  function isValidPhoneNumber(phoneNumber) {
    const phonePattern = /^\d{10}$/;

    if (mobileVerified) {
      return phonePattern.test(phoneNumber);
    } else {
      return "Please Validate your Phone number";
    }
  }

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailVerified) {
      return emailPattern.test(email);
    } else {
      return "Please Verify Your Email";
    }
  }

  function checkPrimaryUser(array) {
    if (array.some((item) => item.primaryUser === false) && array.length > 0) {
      return true; // If any primaryUser is false and array length is greater than 0, return true
    } else {
      return false; // If all primaryUser are true or array length is 0, return false
    }
  }

  function checkTruePrimaryUser(array) {
    if (array.some((item) => item.primaryUser === true) && array.length > 0) {
      return true; // If any primaryUser is false and array length is greater than 0, return true
    } else {
      return false; // If all primaryUser are true or array length is 0, return false
    }
  }

  const mapUserApi = async (
    primary_list,
    redirection_details,
    secondaryArray,
    userDetail,
    sso_id,
    message,
    PrimaryData
  ) => {
    let object_to_send = {
      user_id: redirection_details.user.id,
      UserCredentialsArray: primary_list,
    };

    try {
      const response = await api.post(
        "/user-service-mapping",
        object_to_send ? { data: encryptBody(JSON.stringify(object_to_send)) } : {}
      );

      setLoading(false);

      // const response = await api.post('/register-user', dataObject ? dataObject : {});

      setAlert({
        open: true,
        type: true,
        message: "Your Mapping was Successful",
      });

      setAlert({ open: false, type: true, message: undefined });

      if (service_id) {
        if (secondaryArray) {
          if (secondaryArray.length > 0) {
            const plainAadhaar = aadhaarNumber
              ? aadhaarNumber.replaceAll("-", "")
              : "";

            let dataObject = {
              user_id: ssoId,
              service_id,
              aadhaarNumber: plainAadhaar,
              mobile,
              email,
              name,
              gender: gender === "M" ? 1 : gender === "F" ? 2 : 3,
              dob: dob,
              userName: userName ? userName : userr_name,
              password: CryptoJS.AES.encrypt(
                password,
                process.env.NEXT_PUBLIC_API_SECRET_KEY
              ).toString(),
              co,
              street,
              lm,
              loc,
              vtc,
              dist,
              state,
              pc,
              UserCredentialsArray: secondaryArray,
              userDetails: userDetail,
            };

            let jsonString = JSON.stringify(secondaryArray);

            let base64String = Buffer.from(jsonString).toString("base64");
            let urlEncodedString = encodeURIComponent(base64String);

            const peram = `?service_id=${service_id ? service_id : ""}&umap=${
              umapArray ? JSON.stringify(umapArray) : JSON.stringify([])
            }&umap_var=${
              email ? JSON.stringify(email) : JSON.stringify("")
            }&username=${userName ? userName : ""}&data_object_to_send=${
              dataObject ? JSON.stringify(dataObject) : JSON.stringify({})
            }&primary_user_detail=${
              user_info ? JSON.stringify(user_info) : JSON.stringify({})
            }&sso_id=${sso_id}&primary_sso_user=${
              aadhaarFoundUser
                ? JSON.stringify(aadhaarFoundUser)
                : JSON.stringify({})
            }&mapped_list=${urlEncodedString}&primary_last_list=${
              primary_list ? JSON.stringify(primary_list) : JSON.stringify({})
            }&redirection_details=${
              redirection_details
                ? JSON.stringify(redirection_details)
                : JSON.stringify({})
            }
              &PrimaryData=${
                PrimaryData ? JSON.stringify(PrimaryData) : JSON.stringify({})
              }
              `;

            // Cookies.set('user_pop', JSON.stringify(redirection_details), { expires: expirationDate }, { sameSite: 'None', secure: true });

            Swal.fire({
              html: message,
              confirmButtonText: "LOGIN",
              customClass: {
                title: "swal-title",
                htmlContainer: "swal-text",
              },
              allowOutsideClick: false,
              allowEscapeKey: false,
              showCloseButton: false,
              didOpen: () => {
                // Blur background elements
                const backgroundElements = document.querySelectorAll(
                  "body > *:not(.swal2-container)"
                );
                backgroundElements.forEach((element) => {
                  element.style.filter = "blur(4px)"; // Adjust blur intensity as needed
                });

                const modal = Swal.getPopup();
                modal.addEventListener("click", (e) => {
                  e.stopPropagation();
                });
              },
              willClose: () => {
                // Remove blur from background elements when modal is closed
                const backgroundElements = document.querySelectorAll(
                  "body > *:not(.swal2-container)"
                );
                backgroundElements.forEach((element) => {
                  element.style.filter = "none";
                });
              },
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Redirect to the login page using your router logic
                // Replace 'your-login-route' with the actual route for your login page
                router.push("/mapping" + peram);
              }
            });
          } else {
            setLoading(true);

            let creds = redirection_details;

            if (creds) {
              let url = creds.success_url;

              const parameter = "token=" + creds.tempToken;

              if (url.includes("?")) {
                url += "&" + parameter;
              } else {
                url += "?" + parameter;
              }

              if (creds.redirect_service_id) {
                url += "&service_id=" + creds.redirect_service_id;
              }

              Swal.fire({
                title: "Success",
                html: message,
                showCancelButton: false,
                confirmButtonText: "LOGIN",
                customClass: {
                  title: "swal-title",
                  htmlContainer: "swal-text",
                },

                // cancelButtonText: 'No'
              }).then(async (result) => {
                if (result.isConfirmed) {
                  // Redirect to the login page using your router logic
                  // Replace 'your-login-route' with the actual route for your login page
                  redirectForLogin(
                    url,
                    creds?.service_logo,
                    creds?.service_name
                  );
                }
              });
            }
          }
        } else {
          setLoading(true);
          let creds = redirection_details;

          if (creds) {
            let url = creds.success_url;

            const parameter = "token=" + creds.tempToken;

            if (url.includes("?")) {
              url += "&" + parameter;
            } else {
              url += "?" + parameter;
            }

            if (creds.redirect_service_id) {
              url += "&service_id=" + creds.redirect_service_id;
            }

            Swal.fire({
              html: message,
              confirmButtonText: "LOGIN",
              customClass: {
                title: "swal-title",
                htmlContainer: "swal-text",
              },
              allowOutsideClick: false,
              allowEscapeKey: false,
              showCloseButton: false,
              didOpen: () => {
                // Blur background elements
                const backgroundElements = document.querySelectorAll(
                  "body > *:not(.swal2-container)"
                );
                backgroundElements.forEach((element) => {
                  element.style.filter = "blur(4px)"; // Adjust blur intensity as needed
                });

                const modal = Swal.getPopup();
                modal.addEventListener("click", (e) => {
                  e.stopPropagation();
                });
              },
              willClose: () => {
                // Remove blur from background elements when modal is closed
                const backgroundElements = document.querySelectorAll(
                  "body > *:not(.swal2-container)"
                );
                backgroundElements.forEach((element) => {
                  element.style.filter = "none";
                });
              },
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Redirect to the login page using your router logic
                // Replace 'your-login-route' with the actual route for your login page
                redirectForLogin(url, creds?.service_logo, creds?.service_name);
              }
            });
          }
        }
      } else {
        Cookies.set("role", "user", { expires: expirationDate });
        Cookies.set("uid", response.data.user.id, { expires: expirationDate });
        Cookies.set("name", response.data.user.name, { expires: expirationDate });
        router.push("/dashboard");
      }
    } catch (error) {
      if (error?.response?.status && error.response.status === 500) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data?.error,
        });
      }

      if (error?.response?.status && error.response.status === 403) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data?.error,
        });
      } else {
        if (error?.response?.data?.error?.errors) {
          setAlert({
            open: true,
            type: false,
            message: error.response.data.error.errors[0].message,
          });
        } else {
          setAlert({ open: true, type: false, message: error.message });
        }
      }
    }
  };

  const checkUserNameAvailable = async () => {
    let reqData = {
      user_name: ssoUsername,
      service_id: service_id,
      edistrictCheck: disableUsername,
    };

    try {
      let usernameRegex = "";
      if (!disableUsername) {
        usernameRegex =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,16}$/;
      }

      // const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9]{3,16}$/;

      // const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{3,16}$/;

      if (usernameRegex.test(ssoUsername)) {
        const response = await api.post("/check-username", { data: encryptBody(JSON.stringify(reqData)) });
        const { userNameFlag } = response.data || {};
        setUsernameValidated(!userNameFlag);
        setUserCalled(false);
        setUsernameError(false);

        return userNameFlag;
      } else {
        setUsernameError(true);
        return "Error Regex";
        // setAlert({ open: true, type: false, message: 'Please  Enter Correct Username' })
      }
    } catch (error) {}
  };

  const registerUser = async (dataObject, userDetail, pDetail, sDetail) => {
    let user_availability = await checkUserNameAvailable();

    if (user_availability === "Error Regex") {
      return setAlert({
        open: true,
        type: false,
        message: "Please Enter Correct Username",
      });
    }

    if (!consent) {
      return setAlert({
        open: true,
        type: false,
        message: "Please check the Acknowledge.",
      });
    }

    try {
      const response = await api.post("/user/registration", { data: encryptBody(JSON.stringify(dataObject)) });
      setLoading(false);
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

            // setAlert({
            // 	open: true,
            // 	type: true,
            // 	message: "Your Registration was Successful",
            // });

            const { user, secondaryArray, PrimaryData } = data || {};

            setLoading(false);
            if (secondaryArray && secondaryArray.length > 0) {
              var currentTime = new Date();

              // Calculate the expiration time (current time + 10 minutes)
              var expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

              Cookies.set("secondary_user_array", JSON.stringify(secondaryArray), {
                expires: expirationTime,
                sameSite: "None",
                secure: true,
              });
            }

            if (!data?.user?.id) {
              setAlert({
                open: true,
                type: false,
                message: "User Id Not Returned",
              });
              return;
            }

            setSsoId(data.user.id);
            // Cookies.set('sso_id', sso, { expires: 1, sameSite: 'None', secure: true });

            // setAlert({ open: false, type: true, message: undefined });

            if (!service_id) {
              Cookies.set("role", "user", { expires: expirationDate });
              Cookies.set("uid", data.user.id, { expires: expirationDate });
              Cookies.set("name", data.user.name, { expires: expirationDate });
              router.push("/dashboard");
              return;
            }

            let message = data?.registerMsg;

            if (pDetail && pDetail.length > 0) {
              mapUserApi(
                pDetail,
                data,
                secondaryArray,
                userDetail,
                data.user.id,
                message,
                PrimaryData
              );
            } else {
              if (secondaryArray && secondaryArray.length > 0) {
                const plainAadhaar = aadhaarNumber
                  ? aadhaarNumber.replaceAll("-", "")
                  : "";

                let dataObject = {
                  user_id: ssoId,
                  service_id,
                  aadhaarNumber: plainAadhaar,
                  mobile,
                  email,
                  name,
                  gender: gender === "M" ? 1 : gender === "F" ? 2 : 3,
                  dob: dob,
                  userName: userName ? userName : userr_name,
                  password: CryptoJS.AES.encrypt(
                    password,
                    process.env.NEXT_PUBLIC_API_SECRET_KEY
                  ).toString(),
                  co,
                  street,
                  lm,
                  loc,
                  vtc,
                  dist,
                  state,
                  pc,
                  UserCredentialsArray: secondaryArray,
                  userDetails: userDetail,
                };

                let jsonString = JSON.stringify(secondaryArray);

                let base64String = Buffer.from(jsonString).toString("base64");
                let urlEncodedString = encodeURIComponent(base64String);

                const peram = `?service_id=${service_id ? service_id : ""}&umap=${umapArray ? JSON.stringify(umapArray) : JSON.stringify([])
                  }&umap_var=${email ? JSON.stringify(email) : JSON.stringify("")
                  }&username=${userName ? userName : ""}&data_object_to_send=${dataObject ? JSON.stringify(dataObject) : JSON.stringify({})
                  }&primary_user_detail=${user_info ? JSON.stringify(user_info) : JSON.stringify({})
                  }&sso_id=${data.user.id}&primary_sso_user=${aadhaarFoundUser
                    ? JSON.stringify(aadhaarFoundUser)
                    : JSON.stringify({})
                  }&mapped_list=${urlEncodedString}&primary_last_list=${pDetail ? JSON.stringify(pDetail) : JSON.stringify({})
                  }&redirection_details=${data ? JSON.stringify(data) : JSON.stringify({})
                  }&PrimaryData=${data?.PrimaryData
                    ? JSON.stringify(data?.PrimaryData)
                    : JSON.stringify({})
                  }`;

                // Cookies.set('user_pop', JSON.stringify(response.data), { expires: expirationDate }, { sameSite: 'None', secure: true });

                let message = data?.registerMsg;

                Swal.fire({
                  html: message,
                  confirmButtonText: "LOGIN",
                  customClass: {
                    title: "swal-title",
                    htmlContainer: "swal-text",
                  },
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  showCloseButton: false,
                  didOpen: () => {
                    // Blur background elements
                    const backgroundElements = document.querySelectorAll(
                      "body > *:not(.swal2-container)"
                    );
                    backgroundElements.forEach((element) => {
                      element.style.filter = "blur(4px)"; // Adjust blur intensity as needed
                    });

                    const modal = Swal.getPopup();
                    modal.addEventListener("click", (e) => {
                      e.stopPropagation();
                    });
                  },
                  willClose: () => {
                    // Remove blur from background elements when modal is closed
                    const backgroundElements = document.querySelectorAll(
                      "body > *:not(.swal2-container)"
                    );
                    backgroundElements.forEach((element) => {
                      element.style.filter = "none";
                    });
                  },
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    // Redirect to the login page using your router logic
                    // Replace 'your-login-route' with the actual route for your login page
                    router.push("/mapping" + peram);
                  }
                });

                // Swal.fire({
                //   title: "Success",
                //   html: message,
                //   showCancelButton: false,
                //   confirmButtonText: "Proceed",
                //   customClass: {
                //     title: "swal-title",
                //     htmlContainer: "swal-text",
                //   },

                //   // cancelButtonText: 'No'
                // }).then(async (result) => {
                //   if (result.isConfirmed) {
                //     // Redirect to the login page using your router logic
                //     // Replace 'your-login-route' with the actual route for your login page
                //     router.push("/mapping" + peram);
                //   }
                // });

                // router.push('/mapping' + peram)

                // mapping
              } else {
                let creds = data;

                if (creds) {
                  let url = creds.success_url;

                  const parameter = "token=" + creds.tempToken;

                  if (url.includes("?")) {
                    url += "&" + parameter;
                  } else {
                    url += "?" + parameter;
                  }

                  if (creds.redirect_service_id) {
                    url += "&service_id=" + creds.redirect_service_id;
                  }

                  Swal.fire({
                    html: message,
                    confirmButtonText: "LOGIN",
                    customClass: {
                      title: "swal-title",
                      htmlContainer: "swal-text",
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: false,
                    didOpen: () => {
                      // Blur background elements
                      const backgroundElements = document.querySelectorAll(
                        "body > *:not(.swal2-container)"
                      );
                      backgroundElements.forEach((element) => {
                        element.style.filter = "blur(4px)"; // Adjust blur intensity as needed
                      });

                      const modal = Swal.getPopup();
                      modal.addEventListener("click", (e) => {
                        e.stopPropagation();
                      });
                    },
                    willClose: () => {
                      // Remove blur from background elements when modal is closed
                      const backgroundElements = document.querySelectorAll(
                        "body > *:not(.swal2-container)"
                      );
                      backgroundElements.forEach((element) => {
                        element.style.filter = "none";
                      });
                    },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      // Redirect to the login page using your router logic
                      // Replace 'your-login-route' with the actual route for your login page
                      redirectForLogin(
                        url,
                        creds?.service_logo,
                        creds?.service_name
                      );
                    }
                  });
                }
              }
            }




          } catch (e) {
            console.warn(e)
          }
        }



      }

    } catch (error) {
      setLoading(false);

      if (error?.response?.status && error.response.status === 500) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data?.error,
        });
      }

      if (error?.response?.status && error.response.status === 403) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data?.error,
        });

        setMobile("");
        setMobileVerified(false);
        setEmail("");
        setEmailVerified(false);
      }
      if (error?.response?.status && error.response.status === 400) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data?.error,
        });
      } else {
        if (error?.response?.data?.error) {
          setAlert({
            open: true,
            type: false,
            message: error.response.data?.error,
          });
        } else {
          // setAlert({ open: true, type: false, message: error.message });
        }
      }
    }
  };

  const finalSubmit = async () => {
    try {
      primary_list_to_be_sent = JSON.parse(Cookies.get("primary_user_array"));

      setPDetail(primary_list_to_be_sent);
    } catch (error) {}

    const userDetails = await fetch(getImagePath("/api/user-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let emailCheck = isValidEmail(email);

    const userDetail = await userDetails.json();

    let dataObject = {};

    const plainAadhaar = aadhaarNumber ? aadhaarNumber.replaceAll("-", "") : "";

    let gen = "";
    if (gender === "Male") {
      gen = 1;
    } else if (gender === "Female") {
      gen = 2;
    } else if (gender === "M") {
      gen = 1;
    } else if (gender === "F") {
      gen = 2;
    } else {
      gen = 3;
    }

    dataObject = {
      user_id: "0",
      service_id: service_id ? service_id : "10000046",
      aadhaarNumber: plainAadhaar,
      mobile,
      email,
      name,
      gender: gen,
      'profile-photo': profilePhoto,
      dob: dob,
      userName: userName ? userName : userr_name,
      password: CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      co,
      street,
      lm,
      loc,
      vtc,
      dist,
      state,
      pc,
      UserCredentialsArray: primary_list_to_be_sent,
      userDetails: userDetail,
      user_name: ssoUsername,
      vaultId: vaultId,
      dob_verify: dobVerify,
      ekyc_status: ekyc_status,
      request_type: verificationType,
      him_parivar_id: himParivarId,
      him_member_id: himMemberId,
      ration_id: rationId,
    };

    let checkvalidNum = isValidPhoneNumber(mobile);

    if (checkvalidNum !== true) {
      return setAlert({ open: true, type: false, message: checkvalidNum });
    }

    if (email && email.length > 0) {
      if (emailCheck !== true) {
        return setAlert({ open: true, type: false, message: emailCheck });
      }
    }

    const passCheck = isPasswordValid(password);

    const passMatchCheck = isPasswordMatching(password, password2);

    if (passCheck === true) {
      if (passMatchCheck === true) {
        if (ssoUsername) {
          registerUser(
            dataObject,
            userDetail,
            primary_list_to_be_sent,
            sDetail
          );
        } else {
          setAlert({
            open: true,
            type: false,
            message: "Please Validate your username",
          });
        }
      } else {
        setAlert({ open: true, type: false, message: passMatchCheck });
      }
    } else {
      setAlert({ open: true, type: false, message: passCheck });
    }
  };

  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <StepOne
            setProfilePhoto={setProfilePhoto}
            setConsent={setConsent}
            consent={consent}
            aadhaarVerified={aadhaarVerified}
            setAadhaarVerified={setAadhaarVerified}
            setCo={setCo}
            setStreet={setStreet}
            setLm={setLm}
            setLoc={setLoc}
            setVtc={setVtc}
            setDist={setDist}
            setState={setState}
            setPc={setPc}
            setName={setName}
            setGender={setGender}
            setDob={setDob}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            aadhaarNumber={aadhaarNumber}
            setAadhaarNumber={setAadhaarNumber}
            setAlert={setAlert}
            reqAadhaar_number={reqAadhaar_number}
            co={co}
            street={street}
            lm={lm}
            loc={loc}
            vtc={vtc}
            dist={dist}
            state={state}
            pc={pc}
            name={name}
            gender={gender}
            dob={dob}
            primary_user_detail={primaryUserDetail}
            umapArray={umapArray}
            setEmail={setEmail}
            setMobile={setMobile}
            setSsoId={setSsoId}
            setMobileVerified={setMobileVerified}
            setEmailVerified={setEmailVerified}
            setaadhaarFoundUser={setaadhaarFoundUser}
            aadhaarFoundUser={aadhaarFoundUser}
            setUser_name={setUser_name}
            service_id={service_id}
            umap_array={umapArray}
            setUser_password={setUser_password}
            ssoId={ssoId}
            setssoUsername={setssoUsername}
            setVaultId={setVaultId}
            setdobVerify={setdobVerify}
            dobVerify={dobVerify}
            setskipAadhaar={setskipAadhaar}
            skipAadhaar={skipAadhaar}
            setVerificationType={setVerificationType}
            verificationType={verificationType}
            himParivarId={himParivarId}
            sethimParivarId={sethimParivarId}
            rationId={rationId}
            setRationId={setRationId}
            himparivarList={himparivarList}
            sethimparivarList={sethimparivarList}
            setRationList={setRationList}
            rationList={rationList}
            himDetail={himDetail}
            rationDetail={rationDetail}
            sethimDetail={sethimDetail}
            setrationDetail={setrationDetail}
            sethimMemberId={sethimMemberId}
            himMemberId={himMemberId}
            enteredDob={enteredDob}
            setEnteredDob={setEnteredDob}
            enteredFullname={enteredFullname}
            setEnteredFullname={setEnteredFullname}
            setEkyc_status={setEkyc_status}
            ekyc_status={ekyc_status}
          />
        );
      case 1:
        return (
          <StepTwoNew
            email={email}
            setEmail={setEmail}
            emailVerifiedStep={emailVerifiedStep}
            setEmailVerifiedStep={setEmailVerifiedStep}
            mobileVerifiedStep={mobileVerifiedStep}
            setMobileVerifiedStep={setMobileVerifiedStep}
            userName={userName}
            user_password={userPassword}
            password={password}
            password2={password2}
            setPassword2={setPassword2}
            setPassword={setPassword}
            user_namme={userr_name}
            setUserName={setUserName}
            name={name}
            gender={gender}
            dob={dob}
            handleBack={handleBack}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAlert={setAlert}
            mobile={mobile}
            setMobile={setMobile}
            mobileVerified={mobileVerified}
            setMobileVerified={setMobileVerified}
            emailVerified={emailVerified}
            setEmailVerified={setEmailVerified}
            finalSubmit={finalSubmit}
            setConsent={setConsent}
            consent={consent}
            primary_user_detail={primaryUserDetail}
            umapArray={umapArray}
            ssoId={ssoId}
            setSsoId={setSsoId}
            setaadhaarFoundUser={setaadhaarFoundUser}
            aadhaarFoundUser={aadhaarFoundUser}
            setPasswordType={setPasswordType}
            passwordType={passwordType}
            setssoUsername={setssoUsername}
            ssoUsername={ssoUsername}
            emailAsUsername={emailAsUsername}
            setEmailAsUsername={setEmailAsUsername}
            setUsernameValidated={setUsernameValidated}
            usernameValidated={usernameValidated}
            setUsernameError={setUsernameError}
            setUserCalled={setUserCalled}
            usernameError={usernameError}
            userCalled={userCalled}
            setDisableUsername={setDisableUsername}
            disableUsername={disableUsername}
            edistrictCheck={edistrictCheck}
            setEdistrictCheck={setEdistrictCheck}
            service_id={service_id}
            setSeconds={setSeconds}
            setMinutes={setMinutes}
            seteEnableOTP={seteEnableOTP}
            enableOTP={enableOTP}
            minutes={minutes}
            seconds={seconds}
            setEmailMinutes={setEmailMinutes}
            emailMinutes={emailMinutes}
            emailSeconds={emailSeconds}
            setEmailSeconds={setEmailSeconds}
            enableEmailOTP={enableEmailOTP}
            seteEnableEmailOTP={seteEnableEmailOTP}
          />
        );
      // case 2:
      //     return <StepThree co={co} street={street} lm={lm} loc={loc} vtc={vtc} dist={dist} state={state} pc={pc} handleBack={handleBack} activeStep={activeStep} setActiveStep={setActiveStep} setAlert={setAlert} />
      // case 3:
      //     return <StepFour mobileVerifiedStep={mobileVerifiedStep} setMobileVerifiedStep={setMobileVerifiedStep} mobileVerified={mobileVerified} setMobileVerified={setMobileVerified} mobile={mobile} setMobile={setMobile} handleBack={handleBack} activeStep={activeStep} setActiveStep={setActiveStep} setAlert={setAlert} />
      // case 4:
      //     return <StepFive emailVerifiedStep={emailVerifiedStep} setEmailVerifiedStep={setEmailVerifiedStep} finalSubmit={finalSubmit} emailVerified={emailVerified} setEmailVerified={setEmailVerified} email={email} setEmail={setEmail} handleBack={handleBack} activeStep={activeStep} setActiveStep={setActiveStep} setAlert={setAlert} extra_email={extra_email} />
      default:
        throw new Error("Unknown step");
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const getDevice = async () => {
      try {
        const response = await fetch(getImagePath("/api/check-device"));

        const data = await response.json();

        setDevice(data.device);
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else if (error?.response?.data) {
          dispatch(callAlert({ message: error.response.data, type: "FAILED" }));
        } else {
          dispatch(
            callAlert({
              message: "Something went wrong, please try again later.",
              type: "FAILED",
            })
          );
        }
      }
    };

    getDevice();
  }, []);

  useEffect(() => {
    try {
      primary_list_to_be_sent = JSON.parse(Cookies.get("primary_user_array"));
    } catch (error) {}

    try {
      secondary_list_to_be_sent = JSON.parse(
        Cookies.get("secondary_user_array")
      );
    } catch (error) {}

    if (primary_list_to_be_sent) {
      setPDetail(primary_list_to_be_sent);
    }

    if (secondary_list_to_be_sent) {
      setsDetail(secondary_list_to_be_sent);
    }
  }, [ssoId]);

  const handleLoaderClose = () => {
    setLoading(false);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleLoaderClose}
      >
        <Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      </Backdrop>

      <Grid container alignItems="center" justifyContent="center" spacing={1}>
        <Grid item>
          <Image
            src={getImagePath("/Himachal_Pradesh.png")}
            width="45"
            height="30"
            alt="Himachal Pradesh Logo"
          />
        </Grid>
        <Grid item>
          <Typography
            textAlign={"center"}
            style={{
              color: "#015788",
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            Him Access
          </Typography>
        </Grid>
      </Grid>

      <Typography
        textAlign={"center"}
        style={{ fontSize: 16, color: "#1876D1" }}
      >
        {umapArray.length > 0 ? "Update Profile" : "Sign up"}
      </Typography>

      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel={device === "desktop" ? true : false}
          orientation={device === "desktop" ? "horizontal" : "vertical"}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>

              {device !== "desktop" && (
                <StepContent>{handleSteps(activeStep)}</StepContent>
              )}
            </Step>
          ))}
        </Stepper>
        {device === "desktop" && handleSteps(activeStep)}
      </Box>

      {alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
    </div>
  );
};
export default StepperForm;
