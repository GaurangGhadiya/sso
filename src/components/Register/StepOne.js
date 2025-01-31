import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Modal,
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
import SearchIcon from "@mui/icons-material/Search";

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import AadhaarInput from "../Login/AadhaarInput";
import Swal from "sweetalert2";
import { CancelOutlined } from "@mui/icons-material";
import AadhaarNumericInput from "../AadhaarTextInput";
import NumericInput from "../NumericInput";
import { ConfigProvider, DatePicker, Input, Select, Space } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TextArea from "antd/lib/input/TextArea";
import encryptEmployeeCode, { encryptBody } from "../../../utils/globalEncryption";
import axios from "axios";

dayjs.extend(customParseFormat);

const BlurredBackdrop = (props) => {
  return (
    <Backdrop
      {...props}
      sx={{ backdropFilter: "blur(1px)", borderRadius: 4 }}
    />
  );
};

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
  setProfilePhoto,
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
  setskipAadhaar,
  skipAadhaar,
  setVerificationType,
  verificationType,
  himParivarId,
  sethimParivarId,
  rationId,
  setRationId,
  himparivarList,
  sethimparivarList,
  setRationList,
  rationList,
  himDetail,
  rationDetail,
  sethimDetail,
  setrationDetail,
  sethimMemberId,
  himMemberId,
  enteredDob,
  setEnteredDob,
  enteredFullname,
  setEnteredFullname,
  setEkyc_status,
  ekyc_status,
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
  const [selectedRow, setSelectedRow] = useState(null);

  const [disableName, setdisableName] = useState(false);
  const [disableCo, setdisableCo] = useState(false);
  const [disableDob, setdisableDob] = useState(false);
  const [disableState, setdisableState] = useState(false);
  const [disableDist, setdisableDist] = useState(false);
  const [disableGender, setdisableGender] = useState(false);

  const [confirmDetailsOpen, setconfirmDetailsOpen] = useState(false);
  const handleconfirmOpen = () => setconfirmDetailsOpen(true);
  const handleconfirmClose = () => setconfirmDetailsOpen(false);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    boxShadow: 34,
    borderRadius: 1,
    p: 2,
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

  const clearData = () => {
    setName("");
    setGender("");
    setDob("");
    setdisableCo(false);
    setdisableDist(false);
    setdisableDob(false);
    setdisableGender(false);
    setdisableName(false);
    setdisableState(false);
    setName("");
    setDist("");
    setProfilePhoto("")
    setState("Himachal Pradesh");
    setLoc("");
    setStreet("");
    setCo("");
    setAadhaarNumber("");
  };



  const searchRation = async () => {
    clearData();
    if (!enteredFullname) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter full name",
      });
      return;
    }

    if (!enteredDob) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter Date Of Birth",
      });
      return;
    }
    if (!rationId) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid Ration ID",
      });
      return;
    }

    const url =
      `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/himparivar-dashboard/api/fcs/fetch-ration-details?rationCardNo=` +
       encodeURIComponent(encryptEmployeeCode(rationId)) +
      "&name=" +
      encodeURIComponent(encryptEmployeeCode(enteredFullname)) +
      "&dob=" +
        encodeURIComponent(encryptEmployeeCode(enteredDob));

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {

        if (
          data.data &&
          data.data.length > 0 &&
          data.status === "OK" &&
          data.message === "SUCCESS"
        ) {
          const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;

                          var decr1 = CryptoJS.AES.decrypt(data?.data, secretKey);
                          decr1 = decr1.toString(CryptoJS.enc.Utf8);

                          let data1 = {};
          if (decr1) {
            let json_data = JSON.parse(decr1);
            data1 = json_data;
            const {
              aadhaarNumber,
              address,
              dateOfBirth,
              district,
              gender,
              memberName,
              rationCardNumber,
              relationName,
              ekycStatus,
            } = data1[0] || {};


            if (ekycStatus === "eKYC Compliant") {
              setEkyc_status(1);
            } else {
              setEkyc_status(0);
            }
            if (aadhaarNumber) {
              setAadhaarNumber(aadhaarNumber);
            }

            if (memberName) {
              setName(memberName);
              setdisableName(true);
              // setEnteredFullname(name);
            }
            if (dateOfBirth) {
              setDob(dateOfBirth);
              setdisableDob(true);
              // setDob(dob);
            }
            // if (relative_name) {
            // 	// setCo(relative_name);
            // 	setdisableCo(true);
            // }
            setState("Himachal Pradesh");
            setdisableState(true);

            if (district) {
              setDist(district);
              setdisableDist(true);
            }
            if (gender) {
              setGender(
                gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"
              );
              setdisableGender(true);
            }
            if (address) {
              setLoc(address);
            }

            if (!aadhaarNumber) {
              setAlert({
                open: true,
                type: false,
                message: "Please perform e-KYC ",
              });
            } else {
              setconfirmDetailsOpen(true);
            }

          }

        } else if (data.status === "NOT_FOUND") {
          setAlert({
            open: true,
            type: false,
            message: "No records found",
          });
        } else {
          setAlert({
            open: true,
            type: false,
            message: "Please enter correct Ration Number",
          });
        }

        // setRationList(data.data);
      })
      .catch((error) => {
        setAlert({
          open: true,
          type: false,
          message: "Please enter correct Ration Number",
        });
      });
  };

  const searchHimMemId = async () => {
    const url = "https://himparivaranalytics.hp.gov.in/api/sso/get-familymember";

    clearData();

    if (!enteredFullname) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter full name",
      });
      return;
    }

    if (!enteredDob) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter Date Of Birth",
      });
      return;
    }
    if (!himMemberId) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid HimMember ID",
      });
      return;
    }

    const params = {
      him_member_id: himMemberId,
      name: enteredFullname,
      dob: enteredDob,
      request_id: "member",
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptEmployeeCode(JSON.stringify(params))  // Only stringify params once
      }),
    };

    axios.post(url, {
      data: encryptEmployeeCode(JSON.stringify(params))  // Only stringify params once
    })
      // .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          if (response.status === 200 || response.status === "OK") {
            let url = "";
            const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;

            var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
            decr = decr.toString(CryptoJS.enc.Utf8);

            let data = {};

            if (decr) {
              try {
                let json_data = JSON.parse(decr);
                data = json_data;
                if (data.data) {
                  const {
                    dob,
                    aadhaar_no,
                    district,
                    gender,
                    him_parivar_id,
                    name,
                    ration_card_number,
                    relative_name,
                    state,
                    status,
                    him_member_id,
                  } = data.data || {};

                  if (him_member_id) {
                    sethimMemberId(him_member_id);
                  }
                  if (status) {
                    setEkyc_status(status);
                  }

                  if (aadhaar_no) {
                    setAadhaarNumber(aadhaar_no);
                  }

                  if (name) {
                    setName(name);
                    setdisableName(true);
                    // setEnteredFullname(name);
                  }
                  if (dob) {
                    const [year, month, day] = dob.split("-");

                    // Rearrange and format the date
                    const formattedDate = `${day}-${month}-${year}`;

                    setDob(formattedDate);
                    setdisableDob(true);
                    // setDob(dob);
                  }
                  if (relative_name) {
                    // setCo(relative_name);
                    setdisableCo(true);
                  }
                  if (state) {
                    setState(state);
                    setdisableState(true);
                  }
                  if (district) {
                    setDist(district);
                    setdisableDist(true);
                  }
                  if (gender) {
                    setGender(
                      gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"
                    );
                    setdisableGender(true);
                  }
                  setconfirmDetailsOpen(true);
                }


              } catch (e) {
                console.warn(e)
              }
            }



          }

        } else if (data.status === 404) {
          setAlert({
            open: true,
            type: false,
            message: data.message ? data.message : "Something went wrong",
          });
        } else if (data.status === 500) {
          setAlert({
            open: true,
            type: false,
            message: data.message ? data.message : "Something went wrong",
          });
        }
      })
      .catch((error) => {
        clearData();
      });
  };

  const searchHimId = async () => {
    if (!enteredFullname) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter full name",
      });
      return;
    }

    if (!enteredDob) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter Date Of Birth",
      });
      return;
    }
    if (!himParivarId) {
      setAlert({
        open: true,
        type: false,
        message: "Please enter valid HimParivar ID",
      });
      return;
    }

    clearData();

    const url = "https://himparivaranalytics.hp.gov.in/api/sso/get-familymember";

    // const url =
    // 	"https://himparivaranalytics.hp.gov.in/api/search-member/get-member-data";

    // const params = {
    // 	searchBy: "HimParivarID",
    // 	SearchId: himParivarId,
    // };

    const params = {
      him_member_id: himParivarId,
      name: enteredFullname,
      dob: enteredDob,
      request_id: "parivar",
    };



    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptEmployeeCode(JSON.stringify(params))  // Only stringify params once
      }),    };

    axios.post(url, {
      data: encryptEmployeeCode(JSON.stringify(params))  // Only stringify params once
    })      // .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          if (response.status === 200 || response.status === "OK") {
            let url = "";
            const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;

            var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
            decr = decr.toString(CryptoJS.enc.Utf8);

            let data = {};

            if (decr) {
              try {
                let json_data = JSON.parse(decr);
                data = json_data;
                if (data.data) {
                  const {
                    dob,
                    aadhaar_no,
                    district,
                    gender,
                    him_parivar_id,
                    name,
                    ration_card_number,
                    relative_name,
                    state,
                    status,
                    him_member_id,
                  } = data.data || {};

                  if (him_member_id) {
                    sethimMemberId(him_member_id);
                  }
                  if (status) {
                    setEkyc_status(status);
                  }

                  if (aadhaar_no) {
                    setAadhaarNumber(aadhaar_no);
                  }

                  if (name) {
                    setName(name);
                    setdisableName(true);
                    // setEnteredFullname(name);
                  }
                  if (dob) {
                    const [year, month, day] = dob.split("-");

                    // Rearrange and format the date
                    const formattedDate = `${day}-${month}-${year}`;

                    setDob(formattedDate);
                    setdisableDob(true);
                    // setDob(dob);
                  }
                  if (relative_name) {
                    // setCo(relative_name);
                    setdisableCo(true);
                  }
                  if (state) {
                    setState(state);
                    setdisableState(true);
                  }
                  if (district) {
                    setDist(district);
                    setdisableDist(true);
                  }
                  if (gender) {
                    setGender(
                      gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"
                    );
                    setdisableGender(true);
                  }
                  setconfirmDetailsOpen(true);
                }


              } catch (e) {
                console.warn(e)
              }
            }



          }

        } else if (data.status === 404) {
          setAlert({
            open: true,
            type: false,
            message: data.message ? data.message : "Something went wrong",
          });
        } else if (data.status === 500) {
          setAlert({
            open: true,
            type: false,
            message: data.message ? data.message : "Something went wrong",
          });
        }
      })
      .catch((error) => {
        // if (error.response.data === 500) {
        // 	// dispatch(
        // 	//   setAlert({
        // 	//     open: true,
        // 	//     type: false,
        // 	//     message: "Unable to send OTP. Please try again.",
        // 	//   })
        // 	// );

        // 	setAlert({
        // 		open: true,
        // 		type: false,
        // 		message: "Unable to send OTP. Please try again.",
        // 	});

        // 	return;
        // }

        clearData();
      });
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
    // if (parentPage === "deloitte-login") {
    // 	setName("Vijay Premi");
    // 	setGender("M");

    // 	setCo("C/O: Karm Chand Premi");
    // 	setStreet("Awah Devi");
    // 	setLm("N.A");
    // 	setLoc("Chamboh");
    // 	setVtc("N.A");
    // 	setDist("Hamirpur");
    // 	setState("Himachal Pradesh");
    // 	setPc("N.A");

    // 	setAadhaarVerified(2);

    // 	let date_of_birth = "2024";

    // 	try {
    // 		// let date = getDayAndMonth(uidData.Poi.$.dob);
    // 		const formattedDate = convertToDDMMYYYY(date_of_birth);

    // 		if (formattedDate) {
    // 			//setDob(uidData.Poi.$.dob);
    // 			setDob(formattedDate);
    // 			setdobVerify(true);
    // 		} else {
    // 			setDob("");
    // 			setdobVerify(false);
    // 		}
    // 	} catch (e) {}

    // 	setAlert({ open: true, type: true, message: "Successfully verified!" });

    // 	setLoading(false);
    // } else {
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
    // }
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
        }
      } catch (error) {
        console.error("Error while parsing the cookie:", error);
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
        const response = await api.post("/user-aadhaar-check", { data: encryptBody(JSON.stringify(dataToSend)) });


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
            let message = data?.msg;

            setAlreadyExist(true);
            setAlreadyExistMsg(message);
            sendAadhaarOTP();

          } catch (e) {
            console.warn(e)
          }
        }

          //
          //   const { user, primaryUsersArray, secondaryUsersArray } =
          // response.data || {};

        // if (response.data) {
        //   let message = response?.data?.msg;
        //
        //   setAlreadyExist(true);
        //   setAlreadyExistMsg(message);
        //   sendAadhaarOTP();
        // }
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

  const verifyDetails = async () => {
    if (name.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please enter Full Name",
      });
    }

    if (co.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please enter Father / Husband Name (Care Of)",
      });
    }

    if (gender.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please select Gender",
      });
    }
    if (dob.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please enter Date of Birth",
      });
    }

    if (dist.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please select District",
      });
    }

    if (state.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please select State",
      });
    }

    if (loc.length === 0) {
      return setAlert({
        open: true,
        type: false,
        message: "Please enter Address Line 1 ",
      });
    }

    if (!street) {
      return setAlert({
        open: true,
        type: false,
        message: "Please enter Address Line 2 ",
      });
    }

    // if (!aadhaarNumber) {
    // 	Swal.fire({
    // 		html: "Your Aadhaar is not mapped with HimParivar. Kindly contact  the Admin.",
    // 		confirmButtonText: "LOGIN",
    // 		customClass: {
    // 			title: "swal-title",
    // 			htmlContainer: "swal-text",
    // 			container: "my-swal",
    // 		},
    // 		allowOutsideClick: false,
    // 		allowEscapeKey: false,
    // 		showCloseButton: false,
    // 		didOpen: () => {
    // 			// Blur background elements
    // 			const backgroundElements = document.querySelectorAll(
    // 				"body > *:not(.swal2-container)"
    // 			);
    // 			backgroundElements.forEach((element) => {
    // 				element.style.filter = "blur(4px)"; // Adjust blur intensity as needed
    // 			});

    // 			const modal = Swal.getPopup();
    // 			modal.addEventListener("click", (e) => {
    // 				e.stopPropagation();
    // 			});
    // 		},
    // 		willClose: () => {
    // 			// Remove blur from background elements when modal is closed
    // 			const backgroundElements = document.querySelectorAll(
    // 				"body > *:not(.swal2-container)"
    // 			);
    // 			backgroundElements.forEach((element) => {
    // 				element.style.filter = "none";
    // 			});
    // 		},
    // 	}).then(async (result) => {
    // 		if (result.isConfirmed) {
    // 			if (!service_id || service_id === "10000046") {
    // 				router.push(`/registration`);
    // 			} else {
    // 				router.push(`/registration-iframe?service_id=${service_id}`);
    // 			}
    // 		}
    // 	});
    // } else {
    let object = {
      aadhaarNumber: aadhaarNumber
        ? CryptoJS.AES.encrypt(
            aadhaarNumber,
            process.env.NEXT_PUBLIC_API_SECRET_KEY
          ).toString()
        : "",
      dob: CryptoJS.AES.encrypt(
        dob,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      service_id: service_id ? service_id : "10000046",

      name: CryptoJS.AES.encrypt(
        name,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),

      vaultId: "",
    };
    try {
      const response = await api.post("/GET-SSO-ID", { data: encryptBody(JSON.stringify(object)) });

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
            const { user_name } = data || {};

            if (user_name) {
              setssoUsername(user_name);
              setconfirmDetailsOpen(false);
              setActiveStep(activeStep + 1);
            }


          } catch (e) {
            console.warn(e)
          }
        }



      }

    } catch (error) {}

    // }
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };

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
          if (uidData?.Pht) {
            if (uidData?.Pht) {
              const resData = {
                aadhaarNo: plainAadhaar,
                profilePhoto: uidData?.Pht
              };
              const phtResponse = await fetch(
                `${process?.env?.NEXT_PUBLIC_NODE_HIMPARIVAR}ekyc/upload-ekyc-photo`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(resData)
                }
              );
            }

          }
          setProfilePhoto(uidData?.Pht)
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
            const formattedDate = convertToDDMMYYYY(uidData.Poi.$.dob);

            if (formattedDate) {
              //setDob(uidData.Poi.$.dob);
              setDob(formattedDate);
              setdobVerify(true);
            } else {
              setDob("");
              setdobVerify(false);
            }
          } catch (e) {}

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
            const response = await api.post("/GET-SSO-ID", { data: encryptBody(JSON.stringify(object)) });

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
                const { user_name } = data || {};
                if (user_name) {
                  setssoUsername(user_name);
                }
              } catch (e) {
                console.warn(e)
              }

            }

          } catch (error) {}

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
                if (!service_id || service_id === "10000046") {
                  router.push(`/login`);
                } else {
                  router.push(`/login-iframe?service_id=${service_id}`);
                }
              }
            });

            return;
          } else {
            setAlert({
              open: true,
              type: true,
              message: "Successfully verified!",
            });
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

  const handleUsingTypeChange = (value) => {
    setVerificationType(value);
    setName("");
    setProfilePhoto("")
    setDob("");
    setCo("");
    setDist("");
    setState("Himachal Pradesh");
    setEnteredDob("");
    setEnteredFullname("");
    sethimMemberId("");
    sethimParivarId("");
    setRationId("");
    setAadhaarNumber("");
    setdisableCo(false);
    setdisableDist(false);
    setdisableDob(false);
    setdisableGender(false);
    setdisableName(false);
    setdisableState(false);
  };

  const resetAadhaar = (redirect) => {
    setAadhaarNumber("");
    setConsent(false);
    setOtpSent(false);
    setAadhaarVerified(0);
    setOtp("");
    setProfilePhoto("")
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

  const handleCheckboxChange = (event) => {
    setConsent(event.target.checked);
    // Do something with the checked value if needed
  };

  return (
    <StepContainer loading={loading}>
      <Grid container xs={12} style={{ width: "100%" }}>
        <Modal
          BackdropComponent={BlurredBackdrop}
          open={confirmDetailsOpen}
          onClose={handleconfirmClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              style={{
                background: "#1876d1",
                borderRadius: 9,
                marginBottom: 10,
              }}
              color={"#FFF"}
              textAlign={"center"}
            >
              {verificationType === "HimId"
                ? "HimParivar"
                : verificationType === "Ration"
                ? "Ration"
                : "Him Member"}{" "}
              Detail
            </Typography>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <Box style={{ width: "100%" }}>
                <div className="table-details">
                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Name:<span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      {" "}
                      <Typography style={{ fontSize: 12 }}>
                        <Input
                          readOnly={disableName}
                          placeholder="Enter Name"
                          value={name}
                          // disabled={disableName}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Typography>
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Father / Husband Name:
                        <span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      {" "}
                      <Typography style={{ fontSize: 12 }}>
                        <Input
                          placeholder="Enter Father / Husband Name"
                          value={co}
                          onChange={(e) => setCo(e.target.value)}
                        />
                      </Typography>
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Gender:<span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Grid item xs={12}>
                        <Select
                          disabled={disableGender} // Using disabled prop to make it appear readonly
                          style={{
                            color: "rgba(0, 0, 0, 0.65)",
                            width: "100%",
                          }}
                          getPopupContainer={(node) => node.parentNode}
                          defaultValue={gender}
                          onChange={handleGenderChange}
                          options={[
                            { value: "M", label: "Male" },
                            { value: "F", label: "Female" },
                            { value: "O", label: "Other" },
                          ]}
                        />
                      </Grid>
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Date Of Birth:
                        <span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Grid item xs={12}>
                        <DatePicker
                          disabled={disableDob}
                          // defaultValue={dayjs('2015-06-06', dateFormat)}
                          getPopupContainer={(triggerNode) => {
                            return triggerNode.parentNode;
                          }}
                          defaultValue={dob ? dayjs(dob, "DD-MM-YYYY") : null}
                          autoFocus={true}
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
                          style={{ width: "100%" }}
                          size="medium"
                          formatDensity={"dense"}
                          format="DD-MM-YYYY"
                          label="Start Date"
                          onChange={(newValue) => {
                            if (newValue) {
                              setDob(newValue.format("DD-MM-YYYY"));
                            }
                          }}
                        />
                      </Grid>
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        State:<span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Input
                        placeholder="Enter State"
                        value={state}
                        readOnly={disableState}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        District:<span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Input
                        placeholder="Enter District"
                        value={dist}
                        readOnly={disableDist}
                        onChange={(e) => setDist(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Address Line 1:
                        <span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Input
                        placeholder="Enter Address Line 1"
                        value={loc}
                        onChange={(e) => setLoc(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row-details header-details">
                    <div className="cell-details">
                      <Typography style={{ fontSize: 14, fontWeight: "500" }}>
                        Address Line 2:
                        <span style={{ color: "#FF0000" }}>*</span>
                      </Typography>
                    </div>
                    <div className="cell-details">
                      <Input
                        placeholder="Enter Address Line 2"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Add more rows and cells as needed */}
                </div>
              </Box>
            </div>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack direction="row" spacing={4} mt={2}>
                <Button variant="text" onClick={() => handleconfirmClose()}>
                  Cancel
                </Button>

                <Button variant="text" onClick={() => verifyDetails()}>
                  Confirm
                </Button>
              </Stack>
            </Box>
          </Box>
        </Modal>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleLoaderClose}
        >
          <Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        </Backdrop>

        <Grid item xs={12} mb={2} style={{ width: "100%" }}>
          <Typography color={"#1876d1"} style={{ fontSize: 12 }}>
            {"Sign up using"}{" "}
          </Typography>
          <Select
            defaultValue="Aadhaar Number"
            style={{ width: "100%" }}
            value={verificationType}
            onChange={handleUsingTypeChange}
            options={[
              { value: "Aadhaar", label: "Aadhaar Number" },
              { value: "HimId", label: "Him Parivar ID" },
              { value: "HimMemberId", label: "Him Member ID" },
              { value: "Ration", label: "Ration Card" },
            ]}
          />
        </Grid>

        {/* {!skipAadhaar && ( */}
        {verificationType === "Aadhaar" && (
          <Box style={{ width: "100%" }}>
            <Grid spacing={1} container mb={2}>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  <AadhaarNumericInput
                    maxLength={14}
                    value={aadhaarNumber}
                    label={"Enter your Aadhaar Number"}
                    onChange={setAadhaarNumber}
                    disabled={name ? true : false}
                    size="medium"
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
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        Name{""}{" "}
                      </Typography>
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
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        Date of Birth
                      </Typography>
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
                              color: "#000",
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
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        Care of {""}{" "}
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
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        Gender{""}{" "}
                      </Typography>
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
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        State{" "}
                      </Typography>
                    </div>
                    <div className="cell">
                      <Typography style={{ fontSize: 12 }}>
                        {state ? state : "N.A"}
                      </Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="cell">
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        District
                      </Typography>
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

            <Box mt={2} sx={{ display: "flex", flexDirection: "column" }}>
              {verificationType === "Aadhaar" && !name && (
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
                    />

                    <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                      <Typography mt={2} style={{ flex: 1, fontSize: 12 }}>
                        {/* Your long text content here */}
                        I hereby give my consent to Government of Himachal
                        Pradesh for fetching my identity and other information
                        for purpose of e-KYC through UIDAI, using the Aadhaar
                        OTP or Biometric authentication with UIDAI and seeding
                        it with family data base (Him Parivar), Government of
                        Himachal Pradesh and Him Access which is an integral
                        part of Him Parivar. I also give my consent for using my
                        Aadhaar Number for disbursement of benefits through DBT
                        for the Government Welfare Scheme notified under section
                        7 of Aadhaar Act. The consent and purpose of collecting
                        Aadhaar has been explained to me in local language. The
                        department has informed me that my Aadhaar shall not be
                        used for any purpose other than mentioned above.
                        <br />
                        I have been given other alternative means by the
                        department for KYC purposes including physical KYC by
                        submitting officially valid documents and I have
                        voluntarily chosen Aadhaar based KYC.
                        <br />
                        I understand that the Biometrics and/or OTP I provide
                        for authentication shall be used only for authenticating
                        my identity through the Aadhaar Authentication system
                        for that specific transaction and for no other purposes.
                        <br />
                        Further, I hereby give my consent to use my personal
                        data available with various departments of State and
                        Central for creating the family database of Government
                        of Himachal. I am aware that this database shall be used
                        for deciding my eligibility for various schemes, service
                        and projects of the Government.
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
                <Button variant="text" onClick={() => resetAadhaar(true)}>
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
          </Box>
        )}
        {/* )} */}

        {verificationType === "HimId" && (
          <Box style={{ width: "100%" }}>
            <Grid spacing={1} container mb={2}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      width: "100%",
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Enter Full Name:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>
                  <Input
                    size={"medium"}
                    placeholder="Enter Full Name"
                    value={enteredFullname}
                    onChange={(e) => {
                      setEnteredFullname(e.target.value);
                    }}
                  />

                  <Typography
                    style={{
                      width: "100%",
                      marginTop: 16,
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Date Of Birth:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <DatePicker
                    // defaultValue={dayjs('2015-06-06', dateFormat)}

                    defaultValue={
                      enteredDob ? dayjs(enteredDob, "DD-MM-YYYY") : null
                    }
                    autoFocus={true}
                    style={{ width: "100%", marginBottom: 20 }}
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
                    size="medium"
                    formatDensity={"dense"}
                    format="DD-MM-YYYY"
                    placeholder="Date Of Birth"
                    onChange={(newValue) => {
                      if (newValue) {
                        setEnteredDob(newValue.format("DD-MM-YYYY"));
                      }
                    }}
                  />

                  <Typography
                    style={{
                      width: "100%",
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    {verificationType === "HimId"
                      ? "HimParivar Id"
                      : "HimMember ID"}
                    :<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <Stack
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      alignContent: "center",
                    }}
                    direction="row"
                    spacing={2}
                  >
                    <NumericInput
                      maxLength={8}
                      value={himParivarId}
                      size={"medium"}
                      label={"Enter HimParivar ID"}
                      onChange={(e) => {
                        sethimParivarId(e);
                      }}
                    />

                    <IconButton
                      onClick={() => searchHimId()}
                      style={{
                        backgroundColor: "#1876D1", // Set your desired background color
                        borderRadius: "50%", // Make it circular
                      }}
                      aria-label="search"
                    >
                      <SearchIcon style={{ color: "#FFF" }} />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {verificationType === "HimMemberId" && (
          <Box style={{ width: "100%" }}>
            <Grid spacing={1} container mb={2}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      width: "100%",
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Enter Full Name:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>
                  <Input
                    size={"medium"}
                    placeholder="Enter Full Name"
                    value={enteredFullname}
                    onChange={(e) => {
                      setEnteredFullname(e.target.value);
                    }}
                  />

                  <Typography
                    style={{
                      width: "100%",
                      marginTop: 16,
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Date Of Birth:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <DatePicker
                    // defaultValue={dayjs('2015-06-06', dateFormat)}

                    defaultValue={
                      enteredDob ? dayjs(enteredDob, "DD-MM-YYYY") : null
                    }
                    autoFocus={true}
                    style={{ width: "100%", marginBottom: 20 }}
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
                    size="medium"
                    formatDensity={"dense"}
                    format="DD-MM-YYYY"
                    placeholder="Date Of Birth"
                    onChange={(newValue) => {
                      if (newValue) {
                        setEnteredDob(newValue.format("DD-MM-YYYY"));
                      }
                    }}
                  />

                  <Typography
                    style={{
                      width: "100%",
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    {verificationType === "HimMemberId"
                      ? "Him Member ID"
                      : "Him Parivar Id"}
                    :<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <Stack
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      alignContent: "center",
                    }}
                    direction="row"
                    spacing={2}
                  >
                    <NumericInput
                      maxLength={9}
                      value={himMemberId}
                      size={"medium"}
                      label={"Enter Him Member ID"}
                      onChange={(e) => {
                        sethimMemberId(e);
                      }}
                    />

                    <IconButton
                      onClick={() => searchHimMemId()}
                      style={{
                        backgroundColor: "#1876D1", // Set your desired background color
                        borderRadius: "50%", // Make it circular
                      }}
                      aria-label="search"
                    >
                      <SearchIcon style={{ color: "#FFF" }} />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<Stack
								direction="row"
								spacing={4}
								mt={2}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Button variant="text" onClick={() => resetAadhaar(true)}>
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
									Next
								</Button>
							</Stack>
						</Box> */}
          </Box>
        )}

        {verificationType === "Ration" && (
          <Box style={{ width: "100%" }}>
            <Grid spacing={1} container mb={2}>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      width: "100%",
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Enter Full Name:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>
                  <Input
                    size={"medium"}
                    placeholder="Enter Full Name"
                    value={enteredFullname}
                    onChange={(e) => setEnteredFullname(e.target.value)}
                  />

                  <Typography
                    style={{
                      width: "100%",
                      marginTop: 16,
                      fontSize: 12,
                      color: "#1876d1",
                    }}
                  >
                    Date Of Birth:<span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <DatePicker
                    // defaultValue={dayjs('2015-06-06', dateFormat)}

                    defaultValue={
                      enteredDob ? dayjs(enteredDob, "DD-MM-YYYY") : null
                    }
                    autoFocus={true}
                    style={{ width: "100%", marginBottom: 20 }}
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
                    size="medium"
                    formatDensity={"dense"}
                    format="DD-MM-YYYY"
                    placeholder="Date Of Birth"
                    onChange={(newValue) => {
                      if (newValue) {
                        setEnteredDob(newValue.format("DD-MM-YYYY"));
                      }
                    }}
                  />

                  <Typography
                    style={{ width: "100%", fontSize: 12, color: "#1876d1" }}
                  >
                    Ration Number: <span style={{ color: "#FF0000" }}>*</span>
                  </Typography>

                  <Stack
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      alignContent: "center",
                    }}
                    direction="row"
                    spacing={2}
                  >
                    <Input
                      maxLength={15}
                      value={rationId}
                      size={"medium"}
                      placeholder={"Enter Ration Number"}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\w\s]/gi, "");

                        setRationId(value.toUpperCase());
                      }}
                    />

                    <IconButton
                      onClick={() => searchRation()}
                      style={{
                        backgroundColor: "#1876D1", // Set your desired background color
                        borderRadius: "50%", // Make it circular
                      }}
                      aria-label="search"
                    >
                      <SearchIcon style={{ color: "#FFF" }} />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<Stack
								direction="row"
								spacing={4}
								mt={2}
								justifyContent={"center"}
								alignItems={"center"}
							>
								<Button variant="text" onClick={() => resetAadhaar(true)}>
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
									Next
								</Button>
							</Stack>
						</Box> */}
          </Box>
        )}
      </Grid>
    </StepContainer>
  );
};
export default StepOne;
