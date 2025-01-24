import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import StepContainer from "./StepContainer";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getImagePath } from "../../../utils/CustomImagePath";
import DoneIcon from "@mui/icons-material/Done";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DeleteIcon from "@mui/icons-material/Delete";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import api from "../../../utils/api";
import CryptoJS from "crypto-js";

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import AadhaarInput from "../Login/AadhaarInput";
import Swal from "sweetalert2";
import { CancelOutlined } from "@mui/icons-material";
import AadhaarNumericInput from "../AadhaarTextInput";
import NumericInput from "../NumericInput";
import { ConfigProvider, DatePicker, Space } from "antd";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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

const StepOne = ({
  consent,
  setConsent,
  aadhaarVerified,
  setAadhaarVerified,
  aadhaarNumber,
  setAadhaarNumber,
  setAlert,
  activeStep,
  setActiveStep,
  setName,
  setGender,
  setDob,
  setCo,
  setStreet,
  setLm,
  setLoc,
  setVtc,
  setDist,
  setState,
  setPc,
  reqAadhaar_number,

  name,
  gender,
  dob,
  co,
  street,
  lm,
  loc,
  vtc,
  dist,
  state,
  pc,
  primaryUserDetail,
  setEmail,
  setMobile,
  setSsoId,
  setMobileVerified,
  setEmailVerified,
  setaadhaarFoundUser,
  aadhaarFoundUser,
  setUser_name,
  service_id,
  umap_array,

  setUser_password,
  ssoId,
  setssoUsername,
  setVaultId,
  setdobVerify,
  dobVerify,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [otp, setOtp] = useState("");

  const [tnxID, setTnxID] = useState();

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const [parentPage, setParentPage] = useState("");

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [alreadyExist, setAlreadyExist] = useState(false);
  const [alreadyExistMsg, setAlreadyExistMsg] = useState("");

  const abortController = new AbortController();
  const signal = abortController.signal;

  const handleLoaderClose = () => {
    setLoading(false);
  };

  useEffect(() => {
    // Cancel the fetch request when the component is unmounted or the page changes
    return () => {
      abortController.abort();
    };
  }, [router.asPath]);

  useEffect(() => {
    const referer = document.referrer || "";
    const parentPage = referer.substring(referer.lastIndexOf("/") + 1);
    setParentPage(parentPage);
  }, []);

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

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function getDayAndMonth(dateOfBirth) {
    // Regular expression to match the allowed date formats
    const dateFormats = [
      /^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/,
      /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/,
    ];

    // Check if the date of birth matches any of the allowed formats
    const isValidFormat = dateFormats.some((format) =>
      format.test(dateOfBirth)
    );

    if (!isValidFormat) {
      return null; // Date format is invalid
    }

    // If the date format is valid, but it's only a year, return null
    if (!dateOfBirth.includes("/") && !dateOfBirth.includes("-")) {
      return null; // Year only is not allowed
    }

    // Extract day and month
    const [first, second, third] = dateOfBirth.split(/[/-]/);

    // Check if both day and month are present
    if (!first || !second) {
      return null; // Day or month is missing
    }

    // Return day and month as numbers
    return { day: parseInt(first), month: parseInt(second) };
  }

  async function sendAadhaarOTP() {
    if (parentPage === "deloitte-login") {
      setName("Vijay Premi");
      setGender("M");

      setCo("C/O: Karm Chand Premi");
      setStreet("Awah Devi");
      setLm("N.A");
      setLoc("Chamboh");
      setVtc("N.A");
      setDist("Hamirpur");
      setState("Himachal Pradesh");
      setPc("N.A");

      setAadhaarVerified(2);

      let date_of_birth = "2024/12/12";

      try {
        // let date = getDayAndMonth(uidData.Poi.$.dob);
        const formattedDate = convertToDDMMYYYY(date_of_birth);

        if (formattedDate) {
          //setDob(uidData.Poi.$.dob);
          setDob(formattedDate);
          setdobVerify(true);
        } else {
          setDob("");
          setdobVerify(false);
        }
      } catch (e) {
      }

      setAlert({ open: true, type: true, message: "Successfully verified!" });

      setLoading(false);
    } else {
      const plainAadhaar = aadhaarNumber.replaceAll("-", "");

      if (aadhaarNumber.length > 11) {
        setLoading(true);
        setOpen(true);
        const dataToSend = {
          aadhaarNumber: plainAadhaar,
          signal: abortController.signal,
        };

        fetch(getImagePath("/api/aadhaar-otp"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify(dataToSend), // Convert the data to JSON format
        })
          .then((response) => {
            setLoading(false);

            setMinutes(0);
            setSeconds(59);
            setOpen(false);
            if (response.status === 500) {
              // dispatch(
              //   setAlert({
              //     open: true,
              //     type: false,
              //     message: "Unable to send OTP. Please try again.",
              //   })
              // );

              setAlert({
                open: true,
                type: false,
                message: "Unable to send OTP. Please try again.",
              });

              return;
            }

            if (!response.ok) {
              // throw new Error("Failed to post data");
            }
            return response.json();
          })
          .then((data) => {

            if (data) {
              setTnxID(data);
              setOtpSent(true);
              setAadhaarVerified(1);
            }
            setLoading(false);
          })
          .catch((error) => {
            // Handle errors

            setLoading(false);

            if (error?.response?.data?.error) {
              callAlert({
                message: error.response.data.error,
                type: "FAILED",
              });
            } else if (error?.response?.data) {
              callAlert({ message: error.response.data, type: "FAILED" });
            } else {
              callAlert({ message: error.message, type: "FAILED" });
            }
          });
      }
    }
  }

  const getOtp = async () => {
    setOtp("");
    setOtpSent(false);
    setAadhaarVerified(0);

    const plainAadhaar = aadhaarNumber.replaceAll("-", "");

    if (plainAadhaar.length > 11) {
      var credsArray = "";

      try {
        let basicUserCookie = Cookies.get("user_data");
        if (basicUserCookie) {
          credsArray = JSON.parse(basicUserCookie);
        } else {
        }
      } catch (error) {
      }

      // let lists = [];

      // if (credsArray) {
      //     lists = credsArray;
      // }
      // else {
      //     lists = umap_array;
      // }

      const { singleRowData, primaryUsersArray, secondaryUsersArray } =
        credsArray || {};

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


      const dataToSend = {
        service_id: service_id ? service_id : "10000046",
        aadhaarNumber: CryptoJS.AES.encrypt(
          plainAadhaar,
          process.env.NEXT_PUBLIC_API_SECRET_KEY
        ).toString(),
        UserCredentialsArray: UserCredentialsArray ? UserCredentialsArray : [],
      };

      try {
        const response = await api.post("/user-aadhaar-check", dataToSend);


        const { user, primaryUsersArray, secondaryUsersArray } =
          response.data || {};

        if (response.data) {
          let message = response?.data?.msg;

          setAlreadyExist(true);
          setAlreadyExistMsg(message);
          sendAadhaarOTP();

          // setaadhaarFoundUser(response.data.user)

          // setMobile(user.mobile);
          // setEmail(user.email);
          // setUser_name(user.userName);

          // if (user.email) {
          //     setEmail(user.email)
          //     setEmailVerified(true)

          // }
          // else {
          //     setEmail("")
          //     setEmailVerified(false)
          // }

          // if (user.mobile) {
          //     setMobileVerified(true)
          //     setMobile(user.mobile)
          // }
          // else {
          //     setMobileVerified(false)
          //     setMobile("")
          // }

          // setUser_password(user.password)

          // var currentTime = new Date();

          // // Calculate the expiration time (current time + 10 minutes)
          // var expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

          // Cookies.set('user_info', JSON.stringify(user), { expires: expirationTime, sameSite: 'None', secure: true });

          // Cookies.set('primary_user_array', JSON.stringify(primaryUsersArray), { expires: expirationTime, sameSite: 'None', secure: true });

          // setSsoId(user.id);
          }
      } catch (error) {
        if (error?.response?.status && error.response.status === 404) {
          sendAadhaarOTP();
          setSsoId(0);
        }

      }
    } else {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid 12 digit Aadhaar number",
      });
    }
  };

  const verifyDob = () => {
    let isvalid = convertToDDMMYYYY(dob);
    if (isvalid) {
      setActiveStep(activeStep + 1);
      setDob(isvalid);
    } else {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid Date Of Birth",
      });
      return;
    }
  };

  function convertToDDMMYYYY(dateString) {
    // Regular expression to match various date formats
    const dateFormatRegex =
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})|(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})|(\d{1,2})th\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,\s(\d{4})$/;

    // Match the input date string with the regular expression
    const match = dateString.match(dateFormatRegex);

    if (!match) {
      return false;
    }

    // Extract date parts from the matched groups
    let [
      ,
      year1,
      month1,
      day1,
      day2,
      month2,
      year2,
      day3,
      month3,
      monthName,
      year3,
    ] = match;

    // Convert month name to numeric representation
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = monthNames.indexOf(monthName);
    if (monthIndex !== -1) {
      month3 = monthIndex + 1;
    }

    // Choose the correct date parts based on the matched groups
    const year = year1 || year2 || year3;
    const month = month1 || month2 || month3;
    const day = day1 || day2 || day3;

    // Create a Date object
    const dateObj = new Date(year, month - 1, day);

    // Format date as dd-mm-yyyy
    const formattedDate = `${padZero(dateObj.getDate())}-${padZero(
      dateObj.getMonth() + 1
    )}-${dateObj.getFullYear()}`;
    return formattedDate;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  // function parseDate(input) {
  //   if (/^\d{4}$/.test(input)) {
  //     return input;
  //   }

  //   const supportedFormats = [
  //     "DD-MM-YYYY",
  //     "DD/MM/YYYY",
  //     "YYYY/MM/DD",
  //     "YYYY-MM-DD",
  //   ];

  //   // Iterate through supported formats
  //   for (const format of supportedFormats) {
  //     const parsedDate = dayjs(input, { format }).startOf("day");

  //     // Check if the parsed date is valid
  //     if (parsedDate.isValid()) {
  //       return parsedDate.format("DD-MM-YYYY");
  //     }
  //   }

  //   return null;
  // }

  const verifyOTP = () => {
    const plainAadhaar = aadhaarNumber.replaceAll("-", "");

    if (otp.length === 6) {
      setLoading(true);

      const dataToSend = {
        aadhaarNumber: plainAadhaar,
        otp: otp,
        tnxID: tnxID,
      };
      fetch(getImagePath("/api/verify-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(dataToSend), // Convert the data to JSON format
      })
        .then((response) => {
          if (!response.ok) {
            setAlert({
              open: true,
              type: false,
              message: "Unable to connect to UIDAI Please try again",
            });

            // throw new Error("Unable to connect to UIDAI Please try again");
          }
          return response.json();
        })
        .then(async (data) => {
          const { uidData, vault } = data || {};




          if (vault.$.aadhaarReferenceNumber) {
            setVaultId(vault.$.aadhaarReferenceNumber);
          }
          setName(uidData.Poi.$.name);
          setGender(uidData.Poi.$.gender);
          setCo(uidData.Poa.$.co);
          setStreet(uidData.Poa.$.street);
          setLm(uidData.Poa.$.lm);
          setLoc(uidData.Poa.$.loc);
          setVtc(uidData.Poa.$.vtc);
          setDist(uidData.Poa.$.dist);
          setState(uidData.Poa.$.state);
          setPc(uidData.Poa.$.pc);

          setAadhaarVerified(2);

          try {
            // let date = getDayAndMonth(uidData.Poi.$.dob);
            const formattedDate = convertToDDMMYYYY("20/11/1993");

            if (formattedDate) {
              //setDob(uidData.Poi.$.dob);
              setDob(formattedDate);
              setdobVerify(true);
            } else {
              setDob("");
              setdobVerify(false);
            }
          } catch (e) {
          }

          let object = {
            aadhaarNumber: CryptoJS.AES.encrypt(
              plainAadhaar,
              process.env.NEXT_PUBLIC_API_SECRET_KEY
            ).toString(),
            dob: CryptoJS.AES.encrypt(
              uidData.Poi.$.dob,
              process.env.NEXT_PUBLIC_API_SECRET_KEY
            ).toString(),
            service_id: service_id ? service_id : "10000046",

            name: CryptoJS.AES.encrypt(
              uidData.Poi.$.name,
              process.env.NEXT_PUBLIC_API_SECRET_KEY
            ).toString(),

            vaultId: CryptoJS.AES.encrypt(
              vault.$.aadhaarReferenceNumber
                ? vault.$.aadhaarReferenceNumber
                : "",
              process.env.NEXT_PUBLIC_API_SECRET_KEY
            ).toString(),
          };
          try {
            const response = await api.post("/GET-SSO-ID", object);

            const { user_name } = response.data || {};
            if (user_name) {
              setssoUsername(user_name);
            }
          } catch (error) {}

          setAlert({
            open: true,
            type: true,
            message: "Successfully verified!",
          });

          setLoading(false);

          if (alreadyExist) {
            Swal.fire({
              html: alreadyExistMsg,
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
                if (!service_id || service_id === "1000046") {
                  router.push(`/login`);
                } else {
                  router.push(`/login-iframe?service_id=${service_id}`);
                }
              }
            });

            return;
          }

          // setActiveStep(activeStep + 1)
        })
        .catch((error) => {
          // Handle errors

          setLoading(false);

          if (error?.response?.data?.error) {
            callAlert({ message: error.response.data.error, type: "FAILED" });
          } else if (error?.response?.data) {
            callAlert({ message: error.response.data, type: "FAILED" });
          } else {
            callAlert({ message: error.message, type: "FAILED" });
          }
        });
    } else {
      callAlert({ message: "Please Enter Correct OTP", type: "FAILED" });
    }
  };

  const resetAadhaar = (redirect) => {
    setAadhaarNumber("");
    setConsent(false);
    setOtpSent(false);
    setAadhaarVerified(0);
    setOtp("");

    setName("");
    setVtc("");
    setDist("");
    setDob("");
    setGender("");
    setLm("");


    if (service_id) {
      router.push("./login-iframe?service_id=" + service_id);
    } else {
      router.push("./login");
    }
  };

  const handleClick = () => {
    // console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    // console.info('You clicked the delete icon.');
  };

  const handleCheckboxChange = (event) => {
    setConsent(event.target.checked);
    // Do something with the checked value if needed
  };

  return (
    <StepContainer loading={loading}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleLoaderClose}
      >
        <Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      </Backdrop>

      <Grid spacing={1} container mb={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <AadhaarNumericInput
              maxLength={14}
              value={aadhaarNumber}
              label={"Enter your Aadhaar Number"}
              onChange={setAadhaarNumber}
              disabled={name ? true : false}
              style={{ borderRadius: 5 }}
            />
          </Stack>

          {otpSent && !name && (
            <NumericInput
              maxLength={6}
              style={{ marginTop: 16 }}
              value={otp}
              size={"medium"}
              label={"Enter OTP"}
              onChange={(e) => {
                setOtp(e);
              }}
            />
          )}
        </Grid>
      </Grid>
      {otpSent && !name && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
              onClick={() => getOtp()}
            >
              Resend OTP
            </button>
          </div>
        </Box>
      )}

      {name && (
        <Box>
          <div className="table">
            <div className="row header">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>Name{""} </Typography>
              </div>
              <div className="cell">
                {" "}
                <Typography style={{ fontSize: 12 }}>
                  {name ? name : "N.A"}
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>Date of Birth</Typography>
              </div>
              <div className="cell">
                {!dobVerify ? (
                  <DatePicker
                    // defaultValue={dayjs('2015-06-06', dateFormat)}

                    defaultValue={dob ? dayjs(dob, "DD-MM-YYYY") : null}
                    autoFocus={true}
                    disabled={dobVerify ? true : false}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "0.8rem", // Adjust font size if needed
                        padding: 1.2,
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "0.8rem", // Adjust font size for the label
                        marginTop: "-6px", // Adjust margin-bottom for spacing
                      },
                      "& .MuiInputBase-root": {
                        marginBottom: "8px", // Adjust margin-bottom for spacing
                      },
                    }}
                    size="small"
                    formatDensity={"dense"}
                    format="DD-MM-YYYY"
                    label="Start Date"
                    onChange={(newValue) => {
                      if (newValue) {
                        setDob(newValue.format("DD-MM-YYYY"));
                      }
                    }}
                  />
                ) : (
                  <Typography style={{ fontSize: 12 }}>
                    {" "}
                    {dob ? dob : "N.A"}
                  </Typography>
                )}
              </div>
            </div>

            <div className="row header">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>
                  Care of S/o {""}{" "}
                </Typography>
              </div>
              <div className="cell">
                {" "}
                <Typography style={{ fontSize: 12 }}>
                  {co ? co : "N.A"}
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>Gender:{""} </Typography>
              </div>
              <div className="cell">
                {" "}
                <Typography style={{ fontSize: 12 }}>
                  {" "}
                  {gender ? gender : "N.A"}
                </Typography>
              </div>
            </div>

            <div className="row header">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>State </Typography>
              </div>
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>
                  {state ? state : "N.A"}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>District</Typography>
              </div>
              <div className="cell">
                <Typography style={{ fontSize: 12 }}>
                  {dist ? dist : "N.A"}
                </Typography>
              </div>
            </div>

            {/* Add more rows and cells as needed */}
          </div>
        </Box>
      )}

      <Box mt={2} sx={{ display: "flex", flexDirection: "column", width: 300 }}>
        {!name && (
          <>
            <Typography
              textAlign={"center"}
              style={{ background: "#EEEEEE", flex: 1, fontSize: 15 }}
            >
              Consent for Aadhaar eKYC
            </Typography>

            <Stack direction="row" spacing={0} alignItems="flex-start">
              <Checkbox
                style={{ marginTop: 8 }}
                checked={consent}
                onChange={handleCheckboxChange}
                defaultChecked
              />

              <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                <Typography mt={2} style={{ flex: 1, fontSize: 12 }}>
                  {/* Your long text content here */}
                  I hereby give my consent to Government of Himachal Pradesh for
                  fetching my identity and other information for purpose of
                  e-KYC through UIDAI, using the Aadhaar OTP or Biometric
                  authentication with UIDAI and seeding it with family data base
                  (Him Parivar), Government of Himachal Pradesh and Himachal
                  Pradesh Him Access  which is an integral part of
                  Him Parivar. I also give my consent for using my Aadhaar
                  Number for disbursement of benefits through DBT for the
                  Government Welfare Scheme notified under section 7 of Aadhaar
                  Act. The consent and purpose of collecting Aadhaar has been
                  explained to me in local language. The department has informed
                  me that my Aadhaar shall not be used for any purpose other
                  than mentioned above.
                  <br />
                  I have been given other alternative means by the department
                  for KYC purposes including physical KYC by submitting
                  officially valid documents and I have voluntarily chosen
                  Aadhaar based KYC.
                  <br />
                  I understand that the Biometrics and/or OTP I provide for
                  authentication shall be used only for authenticating my
                  identity through the Aadhaar Authentication system for that
                  specific transaction and for no other purposes.
                  <br />
                  Further, I hereby give my consent to use my personal data
                  available with various departments of State and Central for
                  creating the family database of Government of Himachal. I am
                  aware that this database shall be used for deciding my
                  eligibility for various schemes, service and projects of the
                  Government.
                  <br />
                </Typography>
              </div>

              {/* <Typography mt={2} style={{ flex: 1, fontSize: 12, textAlign: 'justify' }}>I, the holder of above given Aadhaar number(VID), hereby give my consent to HP Him Access to obtain my Aadhaar number(VID), Name and Fingerprint / Iris for authentication with UIDAI. HP Him Access will use the identity information only for authentication and notifications. HP Him Access will not store / share your biometrics other than to CIDR for the purpose of authentication.
                              </Typography> */}
            </Stack>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Stack
          direction="row"
          spacing={4}
          mt={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Button
            variant="text"
            // onClick={() => aadhaarVerified === 2 ? setActiveStep(activeStep + 1) : aadhaarVerified === 1 ? verifyOTP() : aadhaarVerified == 0 ? getOtp() : console.warn("")}
            onClick={() => resetAadhaar(true)}
          >
            Cancel
          </Button>

          <Button
            variant="text"
            disabled={consent ? false : true}
            onClick={() =>
              aadhaarVerified === 2
                ? verifyDob()
                : aadhaarVerified === 1
                ? verifyOTP()
                : aadhaarVerified == 0
                ? getOtp()
                : console.warn("")
            }
          >
            {aadhaarVerified === 2
              ? "Next"
              : aadhaarVerified === 0
              ? "Get OTP"
              : "Verify OTP"}
          </Button>
        </Stack>
      </Box>
    </StepContainer>
  );
};
export default StepOne;
