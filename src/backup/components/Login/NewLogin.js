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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserName from "./UserName";
import MobileLogin from "./MobileLogin";
import Link from "next/link";
import style from "./Login.module.css";
import classNames from "classnames";
import {
  Login,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "./AadhaarLogin";
import ParichayLogin from "./ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

import Tabs from "@mui/material/Tabs";
import { getImagePath } from "../../../utils/CustomImagePath";
import HeaderUser from "@/components/UI/HeaderUser";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import ParichayIcon from "../../../public/parichay_icon.png";
import MobileLoginIframe from "./LoginOpen/MobileLoginIframe";
import { useRouter } from "next/router";
import UserNameIframe from "./LoginOpen/UserNameIframe";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
const tabStyles = {
  selected: {
    backgroundColor: "#1876D1", // Change this to your desired background color
    "&.Mui-selected": {
      color: "white", // Change this to your desired text color
      borderBottom: "4px solid white",
      borderRadius: "5px",
    },
    "&:hover": {
      color: "white", // Change this to your desired text color for hover
    },
  },
};

const paperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px", // Set height as needed
};

const NewLogin = () => {
  const [value, setValue] = useState("1");
  const [valueMaster, setValueMaster] = useState("1");

  let router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeMaster = (event, newValue) => {
    setValueMaster(newValue);
  };

  const LoginParichay = () => {
    window.location.href =
      "https://sso.hp.gov.in/official/site/login?onboardingapp=himparivarsso";
  };

  const redirectForLogin = (url, logo, service_name) => {
    router.push("./dashboard");
  };

  // const getIframe = (service_id, service_type) => {
  //     getIframeSSO(service_id, service_type)

  // }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
        marginBottom: 60,
      }}
    >
      {/* <HeaderUser /> */}

      <Box className={style.backdrop} />
      <Container sx={{}}>
        <Box className={style.backdrop} />

        <Grid
          container
          justifyContent="center" // Centers horizontally
          alignItems="center" // Centers vertically
        >
          <Paper
            sx={{
              borderBottom: "5px solid #1876D0",
              borderTop: "5px solid #1876D0",
            }}
            elevation={20}
            style={{
              display: "flex",
              borderRadius: 10,
              width: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              container
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={1}
                style={{ marginTop: 1 }}
              >
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
                      marginTop: 10,
                      fontWeight: 500,
                      fontSize: 18,
                    }}
                  >
                    Him Access
                  </Typography>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <Box style={{ padding: "12px" }}>
                  {/* <Divider /> */}

                  <TabContext value={valueMaster}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <TabList
                        sx={{ height: "30px" }}
                        onChange={handleChangeMaster}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          sx={{ fontSize: "12px" }}
                          iconPosition="start"
                          onChange={(event) => {}}
                          label={
                            <>
                              <input
                                type="radio"
                                checked={valueMaster === "1" && true}
                              />
                              Citizen
                            </>
                          }
                          value="1"
                        />
                        <Tab
                          sx={{ fontSize: "12px" }}
                          iconPosition="start"
                          onChange={(event) => {}}
                          label={
                            <>
                              <input
                                type="radio"
                                checked={valueMaster === "2" && true}
                              />
                              Government employee
                            </>
                          }
                          value="2"
                        />
                      </TabList>
                    </Box>

                    <TabPanel value="1" sx={{ padding: "0" }}>
                      <Typography
                        marginBottom={2}
                        sx={{ marginTop: 1 }}
                        variant="body1"
                        textAlign={"center"}
                      >
                        <span style={{ color: "#1976d2" }}>
                          Sign in to your account{" "}
                        </span>
                      </Typography>

                      <TabContext value={value}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="fullwidth"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                          >
                            <Tab
                              sx={
                                value == 1
                                  ? tabStyles.selected
                                  : { fontSize: "12px" }
                              }
                              label="Username"
                              value="1"
                            />
                            <Tab
                              sx={
                                value == 2
                                  ? tabStyles.selected
                                  : { fontSize: "12px" }
                              }
                              label="Mobile"
                              value="2"
                            />
                            <Tab
                              sx={
                                value == 3
                                  ? tabStyles.selected
                                  : { fontSize: "12px" }
                              }
                              label="Others"
                              value="3"
                            />
                          </Tabs>

                          {/* <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                    <Tab sx={{ fontSize: '12px' }} label="Email" value="1" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Mobile" value="2" />
                                                    <Tab sx={{ fontSize: '12px' }} label="Aadhaar" value="3" />
                                                </TabList> */}
                        </Box>

                        <TabPanel value="1">
                          <UserNameIframe
                            handleChange={handleChange}
                            service_id={"10000046"}
                            redirectForLogin={redirectForLogin}
                            iframe={false}
                          />

                          {/* <UserName handleChange={handleChange} /> */}
                        </TabPanel>

                        <TabPanel value="2">
                          <MobileLoginIframe
                            handleChange={handleChange}
                            service_id={"10000046"}
                            redirectForLogin={redirectForLogin}
                            iframe={false}
                          />

                          {/* <MobileLogin handleChange={handleChange} /> */}
                        </TabPanel>

                        <TabPanel value="3">
                          <AadhaarLogin />
                        </TabPanel>

                        {/* <Box display={'flex'} alignItems={'center'} justifyContent={'center'} mb={2} >
                                            <Image src={'/aadhaar.svg'} height="50" width="50" />
                                            <Typography onClick={(e) => handleChange(e, '3')} sx={{ cursor: 'pointer' }} variant="body1"><small>Login using Aadhaar?</small></Typography>
                                        </Box> */}

                        <div style={{ textAlign: "right", marginRight: 20 }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "fit-content",
                            }}
                          >
                            <Link
                              href="/forgot-password"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography variant="body2" color="primary">
                                Forgot Password?
                              </Typography>
                            </Link>
                          </span>
                        </div>

                        <Divider
                          variant="middle"
                          style={{ marginTop: 10, marginBottom: 10 }}
                        ></Divider>

                        <Link href="/registration">
                          <Typography
                            textAlign={"center"}
                            variant="body2"
                            color={"primary"}
                          >
                            New user? Sign up for Citizen Login
                          </Typography>
                        </Link>
                      </TabContext>
                    </TabPanel>

                    <TabPanel value="2" sx={{ padding: "0" }}>
                      <ParichayLogin />
                    </TabPanel>
                  </TabContext>
                </Box>
              </Grid>

              {/* <Root>

                                   <Divider variant="middle" textAlign="center" style={{ marginBottom: 10 }} ><Typography style={{ color: "#015788" }}>
                                        OR</Typography></Divider>



                                   <Box mt={3} mb={2} display={'flex'} justifyContent={'center'}>

                                        <Box height={100} width={150} textAlign={'center'} sx={{ cursor: 'pointer' }}>
                                             <Image alt="parichay_logo" style={{ backgroundColor: '#0088af', cursor: 'pointer', border: '1px solid #eee' }} src={ParichayIcon} height={50} width={120} onClick={LoginParichay} />
                                             <Typography color={'#1976d2'} fontWeight={'bold'} variant="body2" textAlign={'center'}>Login With Parichay</Typography>
                                        </Box>

                                   </Box>


                              </Root> */}
            </Grid>
          </Paper>
        </Grid>
      </Container>
      {/* <AppBar style={{ height: 40, background: "#015788" }} position="fixed" sx={{ top: 'auto', bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                         <Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={2} >
                              Site designed, developed & hosted by Department of Digital Technologies & Governance, Himachal Pradesh
                         </Typography>
                    </Toolbar>
               </AppBar> */}
    </div>
  );
};
export default NewLogin;
