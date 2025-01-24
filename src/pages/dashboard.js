import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import withAuth from "../../utils/withAuth";
import HeaderUser from "@/components/UI/HeaderUser";
import AllServices from "@/components/Dashboard/User/AllServices";
import Layout from "@/components/Dashboard/layout";
import Container from "@/components/Dashboard/Container";
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import api from "../../utils/api";

import styles from "../components/Login/Login.module.css";
import axios from "axios";
import { callAlert } from "../../redux/actions/alert";
import { getImagePath } from "../../utils/CustomImagePath";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import encryptEmployeeCode, { encryptBody } from "../../utils/globalEncryption";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [serviceList, setServiceList] = useState([]);
  const uid = Cookies.get("uid");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const getService = async () => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-service-list`)
        .then((response) => {


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

                setServiceList(data);
                setLoader(false);

              } catch (e) {
                console.warn(e)
              }
            }



              }


        })
        .catch((e) => {
          setLoader(false);

        });
    };
    getService();
  }, []);

  function openInNewWindow(url) {
    // Open the URL in a new window with specific window features
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");

    // Check if the window was successfully opened
    if (newWindow) {
      // Focus the new window (optional)
      newWindow.focus();
    }
  }

  const redirectToService = async (service_id) => {
    const userDetails = await fetch(getImagePath("/api/user-info"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userDetail = await userDetails.json();

    if (userDetail) {
      const reqData = {
        uid: uid,
        service_id: service_id,
        userDetails: userDetail,
      };

      try {
        const response = await api.post("/redirectToSuccessUrl", { service_id: "10000046",data :CryptoJS.AES.encrypt(JSON.stringify(reqData), process.env.NEXT_PUBLIC_API_SECRET_KEY).toString()});

        if (response.status === 200) {
          let url = "";

            const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;
            var decr = CryptoJS.AES.decrypt(response.data, secretKey);
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

               url = data.success_url
                let parameter = "";

                if (service_id === 10000038) {
                  parameter = "token=" + data.tempToken + "&service_id=" + 0;
                } else {
                  parameter = "token=" + data.tempToken;
                }

                if (url.includes("?")) {
                  url += "&" + parameter;
                } else {
                  url += "?" + parameter;
                }

                openInNewWindow(url);

              } catch (e) {
                console.error(e);
              }
            }



        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    }
  };

  return (
    <>
      <Layout>
        <main className="p-6 space-y-6">
          <Grid container spacing={4} sx={{ padding: 2, marginBottom: 10 }}>
            <Grid item={true} xs={12}>
              <Card elevation={10}>
                {/* <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                >
                                    <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                                        All Services
                                    </Typography>
                                </Box>

                                <Divider variant="middle" /> */}

                {/* <Grid container spacing={3} mb={4} ml={1} mr={2}> */}

                <Grid
                  style={{ padding: 15 }}
                  container
                  spacing={{ xs: 2, md: 3 }}
                  // columns={{ xs: 6, sm: 6, md: 12 }}
                >
                  {loader ? (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      height={"70vh"}
                      width={"100%"}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    serviceList?.map((item, index) => (
                      <Grid
                        item
                        sm={6}
                        key={index}
                        onClick={() => redirectToService(item.service_id)}
                      >
                        <div
                          key={index}
                          class="cardInner human-resources"
                          style={{ cursor: "pointer" }}
                        >
                          <div key={index} class=""></div>
                          <div key={index} class="circle">
                            <img
                              key={index}
                              src={
                                process.env.NEXT_PUBLIC_API_BASE_URL +
                                "/uploads/" +
                                item.logo
                              }
                              alt={"icon"}
                              style={{ maxWidth: 90 }}
                            />
                          </div>
                          <Typography
                            style={{
                              color: "#1876d1",
                              marginTop: 10,
                              fontWeight: "600",
                              fontSize: 18,
                              wordWrap: "break-word",
                            }}
                          >
                            {item?.name}
                          </Typography>
                          <Typography
                            style={{
                              color: "#1876d1",
                              marginTop: 10,
                              fontWeight: "500",
                              fontSize: 15,
                              wordWrap: "break-word",
                            }}
                          >
                            {item?.desp}
                          </Typography>
                        </div>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </main>
      </Layout>
    </>
  );
};
export default withAuth(Dashboard);
