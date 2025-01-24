import {
  Box,
  Container,
  Divider,
  Typography,
  Paper,
  Tab,
  Grid,
  useMediaQuery,
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
import ResetPassword from "./ResetPassword";
import ResetUsingEmail from "./ResetUsingEmail";
import ResetUsingPassword from "./ResetUsingMobile";
import ResetUsingAadhaar from "./ResetUsingAadhaar";
import { getImagePath } from "../../../utils/CustomImagePath";
import { useRouter } from "next/router";

const ForgotPasswordOpenIframe = (props) => {
  const [value, setValue] = useState("1");
  const [valueMaster, setValueMaster] = useState("1");
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeMaster = (event, newValue) => {
    setValueMaster(newValue);
  };

  const isXsScreen = useMediaQuery("(max-width:600px)");

  return (
    <>
      {/* <Box className={style.fullbg}></Box> */}

      <Container
        maxWidth="md"
        sx={{ marginTop: 6, marginBottom: 6, position: "relative" }}
      >
        <Box className={style.backdrop} />
        <Paper elevation={1}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <Box style={{}}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab sx={{ fontSize: "12px" }} label="MOBILE" value="1" />
                      {/*    <Tab sx={{ fontSize: '12px' }} label="EMAIL" value="2" /> */}
                      <Tab
                        sx={{ fontSize: "12px" }}
                        label="Aadhaar"
                        value="2"
                      />
                    </TabList>
                  </Box>

                  <TabPanel value="1">
                    <ResetUsingPassword
                      handleChange={handleChange}
                      iframe_redirect={true}
                      service_id={router.query.service_id}
                      login_type={router.query.login_type}
                    />
                  </TabPanel>

                  {/* <TabPanel value="2">
                                        <ResetUsingEmail handleChange={handleChange} iframe_redirect={true} service_id={router.query.service_id} login_type={router.query.login_type} />
                                    </TabPanel> */}
                  <TabPanel value="2">
                    <ResetUsingAadhaar
                      handleChange={handleChange}
                      iframe_redirect={true}
                      service_id={router.query.service_id}
                      login_type={router.query.login_type}
                    />
                  </TabPanel>

                  <div
                    onClick={() => {
                      let param = `?service_id=${props.service_id}&login_type=${props.login_type}`;

                      // let param = `?service_id=${props.service_id}`;

                      router.push("./login-iframe" + param);
                    }}
                  >
                    {/* <Link href={`/login-iframe?service_id=${props.service_id}`}> */}
                    <Typography
                      style={{ marginBottom: 22, cursor: "pointer" }}
                      textAlign={"center"}
                      variant="body2"
                      color={"primary"}
                    >
                      Sign in to Citizen Login
                    </Typography>
                    {/* </Link> */}
                  </div>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
export default ForgotPasswordOpenIframe;
