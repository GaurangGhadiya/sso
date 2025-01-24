import {
  Alert,
  Box,
  Container,
  Snackbar,
  Step,
  StepContent,
  StepLabel,
  Stepper,
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
import expirationDate from "../../../../utils/cookiesExpire";

const StepperForm = ({
  reqAadhaar_number,
  reqMobile,
  reqEmail,
  service_id,
  userPassword,
  userr_name,
  extra_email,
  is_iframe,
}) => {

  const router = useRouter();
  const [device, setDevice] = useState("desktop");
  const [activeStep, setActiveStep] = useState(0);

  const [aadhaarNumber, setAadhaarNumber] = useState("");

  const [mobile, setMobile] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [emailVerifiedStep, setEmailVerifiedStep] = useState(false);
  const [mobileVerifiedStep, setMobileVerifiedStep] = useState(false);

  const [aadhaarVerified, setAadhaarVerified] = useState(0);

  const [user_name, setUser_name] = useState("");
  const [user_password, setUser_password] = useState("");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    setAadhaarNumber(reqAadhaar_number);
    setMobile(reqMobile);
    setEmail(reqEmail);
    setUser_password(userPassword);
    setUser_name(userr_name);
  }, [reqAadhaar_number, reqMobile, reqEmail]);

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
  const [state, setState] = useState("");
  const [pc, setPc] = useState("");

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
    "Aadhaar Number",
    "Personal Details",
    "Contact Address",
    "Mobile Verification",
    "Email Verification",
  ];

  const finalSubmit = async () => {
    let dataObject = {};

    if (userPassword && userr_name) {
      // let password_to_be_sent = "";

      // if (password && password2) {
      //     password_to_be_sent = password
      // }
      // else {
      //     password_to_be_sent = userPassword
      // }
      if (password && password2) {
        dataObject = {
          aadhaarNumber,
          mobile,
          email,
          name,
          gender: gender === "M" ? 1 : gender === "F" ? 2 : 3,
          dob: dob.split("-").reverse().join("-"),
          userName: userName ? userName : userr_name,
          password: password,
          co,
          street,
          lm,
          loc,
          vtc,
          dist,
          state,
          pc,
          encrypted: "",
        };
      } else {
        dataObject = {
          aadhaarNumber,
          mobile,
          email,
          name,
          gender: gender === "M" ? 1 : gender === "F" ? 2 : 3,
          dob: dob.split("-").reverse().join("-"),
          userName: userName ? userName : userr_name,
          password: "",
          co,
          street,
          lm,
          loc,
          vtc,
          dist,
          state,
          pc,
          encrypted: userPassword,
        };
      }
    } else {
      dataObject = {
        aadhaarNumber,
        mobile,
        email,
        name,
        gender: gender === "M" ? 1 : gender === "F" ? 2 : 3,
        dob: dob.split("-").reverse().join("-"),
        userName: userName ? userName : userr_name,
        password,
        co,
        street,
        lm,
        loc,
        vtc,
        dist,
        state,
        pc,
      };
    }

    try {
      const response = await api.post("/register-user", dataObject);

      if (response.status === 200) {
        if (service_id) {
          router.push("/login-iframe?service_id=" + service_id);
        } else {
          Cookies.set("role", "user", { expires: expirationDate });
          Cookies.set("uid", response.data.id, { expires: expirationDate });
          Cookies.set("name", response.data.name, { expires: expirationDate });
          router.push("/dashboard");
        }
      }
    } catch (error) {
      if (error?.response?.status && error.response.status === 500) {
        setAlert({ open: true, type: false, message: error.response.data });
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

  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          <StepOne
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
          />
        );
      case 1:
        return (
          <StepTwo
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
          />
        );
      case 2:
        return (
          <StepThree
            co={co}
            street={street}
            lm={lm}
            loc={loc}
            vtc={vtc}
            dist={dist}
            state={state}
            pc={pc}
            handleBack={handleBack}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAlert={setAlert}
          />
        );
      case 3:
        return (
          <StepFour
            mobileVerifiedStep={mobileVerifiedStep}
            setMobileVerifiedStep={setMobileVerifiedStep}
            mobileVerified={mobileVerified}
            setMobileVerified={setMobileVerified}
            mobile={mobile}
            setMobile={setMobile}
            handleBack={handleBack}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAlert={setAlert}
          />
        );
      case 4:
        return (
          <StepFive
            emailVerifiedStep={emailVerifiedStep}
            setEmailVerifiedStep={setEmailVerifiedStep}
            finalSubmit={finalSubmit}
            emailVerified={emailVerified}
            setEmailVerified={setEmailVerified}
            email={email}
            setEmail={setEmail}
            handleBack={handleBack}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAlert={setAlert}
            extra_email={extra_email}
          />
        );
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

  return (
    <>
      <Container maxWidth="md">
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
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alert.type === true ? "success" : "error"}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default StepperForm;
