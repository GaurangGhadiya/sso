import {
  Box,
  Container,
  Divider,
  Typography,
  Paper,
  Tab,
  Grid,
  useMediaQuery,
  Button,
  Card,
  Avatar,
  AppBar,
  Toolbar,
  Stack,
  TextField,
  FormControl,
  Input,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserName from "../components/Login/UserName";
import MobileLogin from "../components/Login/MobileLogin";
import Link from "next/link";
import style from "../components/Login/Login.module.css";
import classNames from "classnames";
import {
  CheckOutlined,
  Login,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "../components/Login/AadhaarLogin";
import ParichayLogin from "../components/Login/ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

import Tabs from "@mui/material/Tabs";
import { getImagePath } from "../../utils/CustomImagePath";
import HeaderUser from "@/components/UI/HeaderUser";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import CryptoJS from "crypto-js";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CommentIcon from "@mui/icons-material/Comment";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";

import { useRouter } from "next/router";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import api from "../../utils/api";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "@mui/material/Modal";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { Progress } from "antd";

import { Button as AntdButton } from "antd";
import AlertModal from "@/components/AlertModal";
import { encryptBody } from "../../utils/globalEncryption";
import expirationDate from "../../utils/cookiesExpire";

const listItemStyle = {
  border: "0.5px solid #000", // Initial border
  marginBottom: 8,
  borderRadius: "4px", // Initial border radius
  transition: "border 0.3s ease-in-out", // Adding transition for a smooth effect
};

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 340,
  bgcolor: "background.paper",
  border: "0px solid #000",
  borderRadius: 2,
  boxShadow: 4,
  p: 4,
};

const handleHover = (event) => {
  event.currentTarget.style.border = "1px solid #2196f3"; // Change border on hover
  event.currentTarget.style.borderRadius = "4px"; // Add border-radius for a smoother look
};

const handleHoverExit = (event) => {
  event.currentTarget.style.border = "none"; // Remove border on hover exit
};

let primary_aadhaar_get = {};

const Mapping = () => {
  const [value, setValue] = useState("1");
  const [valueMaster, setValueMaster] = useState("1");
  const [checked, setChecked] = useState([]);

  const [userList, setuserList] = useState([]);

  const [allUsers, setallUsers] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState();

  // const [sso_id, setSsoId] = useState();

  const [loading, setLoading] = useState(false);

  const [selectedValueIndex, setselectedValueIndex] = useState();

  const [loadingPage, setLoadingPage] = useState(false);

  const [service_name, setService_name] = useState("");

  const [user, setUser] = useState("");

  const [username, setusername] = useState("");

  // const [dataObjecttoSend, setdataObjecttoSend] = useState({});

  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [alert, setAlert] = useState({
    open: false,
    type: false,
    message: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSnackClose = () =>
    setAlert({ open: false, type: false, message: "" });
  const router = useRouter();
  let service_id = router.query.service_id ? router.query.service_id : "";
  let umap = router.query.umap ? router.query.umap : "";
  let umap_var = router.query.umap_var ? router.query.umap_var : "";
  let user_name = router.query.username ? router.query.username : "";

  let decodedValue = [];

  let ssoId = router.query.sso_id ? router.query.sso_id : "";

  let primary_user_detail = router.query.primary_user_detail
    ? router.query.primary_user_detail
    : [];

  let data_object_to_send = router.query.data_object_to_send
    ? router.query.data_object_to_send
    : JSON.stringify({});

  let aadhaarFoundUser = router.query.aadhaarFoundUser
    ? router.query.aadhaarFoundUser
    : "";

  let mapped_list = router.query.mapped_list ? router.query.mapped_list : "";

  let primary_last_list = router.query.primary_last_list
    ? router.query.primary_last_list
    : "";

  let redirection_details = router.query.redirection_details
    ? router.query.redirection_details
    : "";

  let PrimaryData = router.query.PrimaryData ? router.query.PrimaryData : "";

  try {
    // Decode the URL and get the Base64 string
    if (mapped_list) {
      const base64String = decodeURIComponent(mapped_list);

      // Decode the Base64 string to JSON
      const jsonString = Buffer.from(base64String, "base64").toString("utf-8");

      // Parse the JSON string to retrieve the original array
      decodedValue = JSON.parse(jsonString);
    }
  } catch (error) {
    console.warn(error, "asdmsadas");
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeMaster = (event, newValue) => {
    setValueMaster(newValue);
  };

  const redirectForLogin = (url, logo, service_name) => {
    var iframe = document.getElementById("iframe");

    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }

    setLoading(false);
    window.top.location.href = url;
  };

  useEffect(() => {
    let creds = [];

    let emails = [];

    let decodedValue = [];

    try {
      creds = JSON.parse(redirection_details);
      if (creds.user_fullname) {
        setusername(creds.user_fullname);
      }
    } catch (error) {}

    try {
      // Decode the URL and get the Base64 string
      const base64String = decodeURIComponent(mapped_list);

      // Decode the Base64 string to JSON
      const jsonString = Buffer.from(base64String, "base64").toString("utf-8");

      // Parse the JSON string to retrieve the original array
      decodedValue = JSON.parse(jsonString);
    } catch (error) {}

    if (decodedValue) {
      let final_array = [];
      if (decodedValue.length > 0) {
        for (let i = 0; i < decodedValue.length; i++) {
          let object = {};

          const { mobileNo, email, service_id, userName, userPassword } =
            decodedValue[i] || {};

          object = {
            mobileNo,
            email,
            service_id,
            userName,
            userPassword: userPassword,
            is_mapped: false,
            password_validated: false,
            primary_user: false,
          };

          final_array.push(object);
          // }
        }

        setuserList(final_array);
      }
    }

    try {
      creds = JSON.parse(PrimaryData);
      if (creds) {
        setUser(creds);
      }
    } catch (error) {}
  }, []);

  const LoginParichay = () => {
    window.location.href =
      "https://sso.hp.gov.in/official/site/login?onboardingapp=himparivarsso";
  };

  const SkipButton = async () => {
    submitData("skip");
  };

  const nextButton = async () => {
    submitData("next");
  };

  const getPasswordValidation = async (item) => {
    const reqData = {
      service_id: item.service_id,
      encrypted: item.userPassword,
      username: CryptoJS.AES.encrypt(
        item.userName,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
      password: CryptoJS.AES.encrypt(
        password,
        process.env.NEXT_PUBLIC_API_SECRET_KEY
      ).toString(),
    };

    try {
      const response = await api.post("/password-decrypt", reqData);

      if (response.status === 200) {
        if (response.data) {
          const newData = [...userList];

          newData[selectedValueIndex].is_mapped =
            !newData[selectedValueIndex].is_mapped;

          newData[selectedValueIndex].password_validated =
            !newData[selectedValueIndex].password_validated;

          setuserList(newData);

          // setSelectedIndex(value)
          setOpen(false);

          if (newData) {
            let object_to_send = {
              user_id: ssoId,
              UserCredentialsArray: [newData[selectedValueIndex]],
            };

            try {
              setLoading(true);

              const response = await api.post(
                "/user-service-mapping",
                object_to_send ? { data: encryptBody(JSON.stringify(object_to_send)) } : {}
              );
              setLoading(false);

              if (response.status === 200) {
                setLoading(false);

                setAlert({
                  open: true,
                  type: true,
                  message: "Your mapping was Successful",
                });
              } else {
                setLoading(false);

                const newData = [...userList];

                newData[selectedValueIndex].is_mapped =
                  !newData[selectedValueIndex].is_mapped;

                newData[selectedValueIndex].password_validated =
                  !newData[selectedValueIndex].password_validated;

                setuserList(newData);
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
              }

              const newData = [...userList];

              newData[selectedValueIndex].is_mapped =
                !newData[selectedValueIndex].is_mapped;

              newData[selectedValueIndex].password_validated =
                !newData[selectedValueIndex].password_validated;

              setuserList(newData);
            }
          }
        }
      } else {
        setAlert({
          open: true,
          type: false,
          message: "Please Enter Correct Credentials",
        });

        setTimeout(() => {
          setAlert({
            open: false,
            type: false,
            message: "Please Enter Correct Credentials",
          });
        }, 200);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        setAlert({
          open: true,
          type: false,
          message: error.response.data.error,
        });
      }
    }
  };

  const submitData = async (button_type) => {
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
        browserDetails: userDetail,
        service_id,
      };

      const response = await api.post("/user-logged", { data: encryptBody(JSON.stringify(reqData)) });

      setLoading(true);

      let dataObject = {};

      if (service_id) {
        let creds = "";

        try {
          // creds = JSON.parse(redirection_details);

          try {
            // Decode the URL and get the Base64 string
            const base64String = decodeURIComponent(redirection_details);

            // Decode the Base64 string to JSON
            const jsonString = Buffer.from(base64String, "base64").toString(
              "utf-8"
            );

            // Parse the JSON string to retrieve the original array
            creds = JSON.parse(jsonString);
          } catch (error) {
            console.warn(error, "asdmsadas");
          }
        } catch (error) {
          console.warn(error, "error in parsing redirection");
        }

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
          // setLoading(false);

          // window.top.location.href = url;
          setLoading(false);
          setLoading(false);

          setLoadingPage(true);

          setService_name(creds?.service_name);

          setTimeout(() => {
            //   setLoadingPage(false);
            redirectForLogin(url, creds?.service_logo, creds?.service_name);
          }, 5000);
        } else {
          router.push("/login-iframe?service_id=" + service_id);
        }
      } else {
        setLoading(false);
        Cookies.set("role", "user", { expires: expirationDate });
        Cookies.set("uid", response.data.id, { expires: expirationDate });
        Cookies.set("name", response.data.name, { expires: expirationDate });
        router.push("/dashboard");
      }
    } catch (error) {
      console.warn(error, "error in redirection");
    }
  };

  const handleCheckboxChange = (index) => (event) => {
    const newData = [...userList];

    if (value.password_validated) {
      newData[index].is_mapped = !newData[index].is_mapped;
      newData[index].password_validated = !newData[index].password_validated;

      setuserList(newData);
    } else {
      setSelectedIndex(newData[index]);
      setselectedValueIndex(index);
      setOpen(true);
    }
  };

  const handleLoaderClose = () => {
    setLoading(false);
  };

  return (
    <>
      {loadingPage ? (
        <>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>

            <Typography variant="body2" mb={5} mt={4} textAlign={"center"}>
              Please wait... <br />
              You are being redirected{" "}
            </Typography>

            {service_id.includes("10000038") && (
              <Typography
                textAlign={"left"}
                style={{
                  color: "#015788",
                  fontWeight: 700,
                  fontSize: 14,
                  textAlign: "center",

                  marginTop: 20,
                }}
              >
                {`You can map your existing account(s) in the ${service_name} profile.`}
              </Typography>
            )}

            {/* <Box className={style.loaderRedirect}></Box> */}
          </Box>
        </>
      ) : (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={handleLoaderClose}
          >
            <Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          </Backdrop>

          {/* <HeaderUser /> */}

          {/* <Box className={style.fullbg}></Box> */}

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box key={selectedValueIndex} sx={modalstyle}>
              <Stack
                key={selectedValueIndex}
                direction="row"
                spacing={0}
                justifyContent={"right"}
                onClick={handleClose}
              >
                <IconButton aria-label="delete">
                  <HighlightOffIcon color="error" />
                </IconButton>
              </Stack>

              <Typography
                textAlign={"left"}
                style={{ color: "#015788", fontWeight: 700, fontSize: 12 }}
              >
                Please enter your password for the below mentioned username
                before Linking / Merging.{" "}
              </Typography>

              {selectedIndex?.userName && (
                <Typography
                  textAlign={"left"}
                  style={{
                    color: "green",
                    marginTop: 10,
                    fontWeight: 500,
                    fontSize: 12,
                    marginBottom: 10,
                  }}
                >
                  Username: {selectedIndex.userName}
                </Typography>
              )}

              <FormControl
                focused
                size="small"
                variant="outlined"
                sx={{ width: "100%", marginTop: 1 }}
              >
                <InputLabel
                  focused
                  size="small"
                  htmlFor="outlined-adornment-password"
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  size="small"
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
                    if (!/[<>]/.test(inputValue)) {
                      setPassword(inputValue);
                    }
                  }}
                />
              </FormControl>

              {/* <Typography textAlign={"left"} style={{ color: "#015788", marginTop: 10, fontWeight: 700, fontSize: 12 }} >Please Click Esc for </Typography> */}

              <Button
                onClick={() => getPasswordValidation(selectedIndex)}
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "flex-end", // Align button to the right horizontally
                  marginLeft: "auto",
                }}
                size="small"
                variant="contained"
              >
                Verify Password
              </Button>
            </Box>
          </Modal>

          <Container sx={{ position: "relative" }}>
            <Box className={style.backdrop} />

            <Grid
              container
              justifyContent="center" // Centers horizontally
              alignItems="center" // Centers vertically
            >
              <Grid
                container
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid container spacing={1} style={{ marginTop: 16 }}>
                  <Grid item ml={2} mt={1}>
                    {/* <IconButton onClick={() => router.back()}>
                                                  <KeyboardBackspaceIcon />
                                             </IconButton> */}
                  </Grid>

                  <Grid item ml={4}>
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
                        marginTop: 10,
                        fontWeight: 500,
                        fontSize: 18,
                      }}
                    >
                      Him Access
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1} style={{}}>
                  <Grid item ml={3}>
                    <Typography
                      style={{
                        color: "#015788",
                        marginTop: 10,
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      Link/Merge Confirmation
                    </Typography>
                    <Typography
                      textAlign={"flex-start"}
                      style={{
                        color: "#015788",
                        marginTop: 10,
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      Dear{" "}
                      <span style={{ color: "green", fontWeight: 700 }}>
                        {username ? username : "User"}
                      </span>{" "}
                      ,
                    </Typography>

                    <Typography
                      textAlign={"flex-start"}
                      style={{
                        color: "#015788",
                        marginTop: 10,
                        fontWeight: 500,
                        fontSize: 12,
                        marginRight: 20,
                        textAlign: "justify",
                      }}
                    >
                      We have noticed that you have multiple accounts on our
                      portal. To improve your experience and make access easier,
                      you have the option to link or merge these accounts.
                    </Typography>
                    {user?.username && (
                      <>
                        <Typography
                          textAlign={"flex-start"}
                          style={{
                            color: "#015788",
                            marginTop: 10,
                            fontWeight: 500,
                            fontSize: 12,
                            marginRight: 20,
                          }}
                        >
                          <span style={{ color: "red", fontWeight: 700 }}>
                            Primary Account:
                          </span>{" "}
                        </Typography>

                        <Box
                          style={{
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <Stack
                            direction="column"
                            spacing={1}
                            alignItems="flex-start"
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="flex-start"
                            >
                              <AccountCircleIcon
                                fontSize="small"
                                color="success"
                              />
                              <ListItemText
                                primaryTypographyProps={{
                                  style: { fontSize: "12px" },
                                }} // Change primary text font size
                                id={"labelId"}
                                primary={`Username: ${
                                  user?.username ? user?.username : "N.A"
                                }`}
                              />
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="flex-start"
                            >
                              <CallIcon fontSize="small" color="info" />
                              <ListItemText
                                primaryTypographyProps={{
                                  style: { fontSize: "12px" },
                                }}
                                id={"labelId"}
                                primary={`Mobile: ${
                                  user?.mobile ? user?.mobile : "N.A"
                                }`}
                              />
                            </Stack>

                            {/* <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <AccountCircleIcon fontSize="small" color="warning" />
                          <ListItemText
                            primaryTypographyProps={{
                              style: { fontSize: "12px" },
                            }}
                            id={"labelId"}
                            primary={"Username: "}
                          />
                        </Stack> */}
                          </Stack>
                        </Box>
                      </>
                    )}

                    <Typography
                      textAlign={"flex-start"}
                      style={{
                        color: "#015788",
                        marginTop: 10,
                        fontWeight: 500,
                        fontSize: 12,
                        marginRight: 20,
                      }}
                    >
                      <span style={{ color: "red", fontWeight: 700 }}>
                        List of Account(s):
                      </span>{" "}
                    </Typography>
                  </Grid>
                  <Grid item></Grid>
                </Grid>

                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    maxHeight: 180,
                    height: 180,
                    overflow: "auto",
                  }}
                >
                  {userList &&
                    userList.map((value, index) => {
                      const labelId = `checkbox-list-label-${value}`;

                      return (
                        <ListItem
                          key={index}
                          style={listItemStyle}
                          // onMouseEnter={handleHover}
                          // onMouseLeave={handleHoverExit}

                          // secondaryAction={
                          //      <IconButton edge="end" aria-label="comments">
                          //           <CommentIcon />
                          //      </IconButton>
                          // }
                          disablePadding
                        >
                          <ListItemButton
                            key={index}
                            role={undefined}
                            onClick={
                              !value.is_mapped
                                ? handleCheckboxChange(index)
                                : null
                            }
                            dense
                          >
                            <ListItemIcon>
                              {/* <Checkbox
                                                                      edge="start"
                                                                      // checked={checked.indexOf(value) !== -1}
                                                                      checked={value.is_mapped}
                                                                      tabIndex={-1}
                                                                      disableRipple
                                                                      inputProps={{ 'aria-labelledby': labelId }}
                                                                 /> */}

                              <>
                                {!value.is_mapped && (
                                  <AntdButton
                                    style={{
                                      marginRight: 10,
                                      color: "#FFF",
                                      background: "green",
                                      borderRadius: 10,
                                    }}
                                  >
                                    MAP
                                  </AntdButton>
                                )}

                                {value.is_mapped && (
                                  <CheckOutlined size="large" />
                                )}
                              </>
                            </ListItemIcon>
                            <Stack
                              key={index}
                              direction="column"
                              spacing={1}
                              alignItems="flex-start"
                            >
                              <Stack
                                key={index}
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >
                                <EmailIcon fontSize="small" color="success" />
                                <ListItemText
                                  primaryTypographyProps={{
                                    style: { fontSize: "12px" },
                                  }} // Change primary text font size
                                  id={labelId}
                                  primary={value.email ? value.email : "N.A"}
                                />
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >
                                <CallIcon fontSize="small" color="info" />
                                <ListItemText
                                  primaryTypographyProps={{
                                    style: { fontSize: "12px" },
                                  }}
                                  id={labelId}
                                  primary={value.mobileNo}
                                />
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >
                                <AccountCircleIcon
                                  fontSize="small"
                                  color="warning"
                                />
                                <ListItemText
                                  primaryTypographyProps={{
                                    style: { fontSize: "12px" },
                                  }}
                                  id={labelId}
                                  primary={value.userName}
                                />
                              </Stack>

                              {value.is_mapped && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent={"flex-end"}
                                  alignContent={"flex-end"}
                                >
                                  <CheckCircleIcon
                                    fontSize="small"
                                    color="success"
                                  />
                                  <Typography
                                    style={{ fontSize: 11, color: "green" }}
                                  >
                                    Account Verified & mapped with HP Him Access
                                  </Typography>
                                  {/* <AccountCircleIcon color="warning" /> */}
                                  {/* <ListItemText style={{ fontSize: '8px' }} id={labelId} primary={"Mapped with Him Access"} /> */}
                                </Stack>
                              )}
                            </Stack>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </List>

                <Grid container style={{}}>
                  <Grid item ml={3} mr={1}>
                    {/* <Typography
                      textAlign={"flex-start"}
                      style={{
                        color: "#015788",
                        marginTop: 5,
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{ color: "red", fontWeight: 700, fontSize: 12 }}
                      >{`You can map your existing account(s) in the ${service_name} profile.`}</span>
                      <br />
                    </Typography> */}
                  </Grid>
                </Grid>
                <Grid container justifyContent={"right"}>
                  {/*
                                        <div onClick={() => router.back()} style={{ textAlign: 'right', marginRight: 20 }}>
                                             <span style={{ display: 'inline-block', width: 'fit-content' }}>
                                                  <Link href={``} style={{ textDecoration: 'none' }}>
                                                       <Typography variant="body1" color="primary">
                                                            Back
                                                       </Typography>
                                                  </Link>
                                             </span>
                                        </div> */}

                  {/* <Button style={{ marginRight: 10 }} onClick={() => proceedForMappings()} variant="text">MAP</Button> */}

                  <Button
                    style={{
                      marginRight: 10,
                      color: "#FFF",
                      background: "green",
                      marginTop: 16,
                    }}
                    onClick={() => SkipButton()}
                    variant="contained"
                  >
                    LOGIN
                  </Button>

                  {/* <div style={{ textAlign: 'right', marginRight: 20 }}>
                                             <span style={{ display: 'inline-block', width: 'fit-content' }}>
                                                  <Link href={`/validate_mapping?users_list=${JSON.stringify(checked)}&service_id=${service_id}`} style={{ textDecoration: 'none' }}>
                                                       <Typography variant="body1" color="primary">
                                                            Proceed
                                                       </Typography>
                                                  </Link>
                                             </span>
                                        </div> */}

                  {/* <Button variant="contained" onClick={() => proceedForMappings()}>Proceed</Button> */}
                </Grid>
              </Grid>
            </Grid>
          </Container>

          {alert.message && (
            <AlertModal alert={alert} handleClose={handleSnackClose} />
          )}

          {/* <AppBar style={{ height: 40, background: "#015788" }} position="fixed" sx={{ top: 'auto', bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                         <Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={2} >
                              Site designed, developed & hosted by Department of Digital Technologies & Governance, Himachal Pradesh
                         </Typography>
                    </Toolbar>
               </AppBar> */}
        </>
      )}
    </>
  );
};
export default Mapping;
