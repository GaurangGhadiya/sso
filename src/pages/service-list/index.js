import Layout from "@/components/Dashboard/layout";
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { callAlert } from "../../../redux/actions/alert";
import { getImagePath } from "../../../utils/CustomImagePath";
import { useDispatch } from "react-redux";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import encryptEmployeeCode, { encryptBody } from "../../../utils/globalEncryption";

const ServiceList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [serviceList, setServiceList] = useState([]);
  const uid = Cookies.get("uid");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // dispatch(getServiceList())
    setLoader(true);
    const getService = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-service-deptid`, {
          data: encryptBody(JSON.stringify({
            dept_user_id: router?.query?.id,
          })) } )
        .then((response) => {
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
          console.warn("e", e);
        });
    };
    getService();
  }, [router]);

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
        const response = await api.post("/redirectToSuccessUrl", { service_id: "10000046", data :encryptBody(JSON.stringify(reqData))});




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


                // let url = response.data.success_url;


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
    <Layout>
      <main className="p-6 space-y-6">
        <Grid container spacing={4} sx={{ padding: 2, marginBottom: 10 }}>
          <Grid item={true} xs={12}>
            <Card elevation={10}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                   Services List
                </Typography>
              </Box>

              <Divider variant="middle" />

              {/* <Grid container spacing={3} mb={4} ml={1} mr={2}> */}

              {loader ? (
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  height={"70vh"}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Grid
                  style={{ margin: 15 }}
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 3, sm: 8, md: 12 }}
                >
                  {serviceList &&
                    serviceList?.length > 0 &&
                    serviceList?.map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => redirectToService(item?.service_id)}
                      >
                        <div
                          key={index}
                          class="card human-resources"
                          style={{ cursor: "pointer" }}
                        >
                          <div key={index} class="overlay"></div>
                          <div key={index} class="circle">
                            <img
                              key={index}
                              src={
                                process.env.NEXT_PUBLIC_API_BASE_URL +
                                "/uploads/" +
                                item.logo
                              }
                              alt={item?.name}
                              style={{ maxWidth: 80 }}
                            />
                          </div>
                          <Typography
                            style={{
                              color: "#1876d1",
                              marginLeft: 10,
                              fontWeight: "500",
                              fontSize: 16,
                              wordWrap: "break-word",
                            }}
                          >
                            {item?.name}
                          </Typography>
                        </div>
                      </Box>
                    ))}
                </Grid>
              )}
            </Card>
          </Grid>
        </Grid>
      </main>
    </Layout>
  );
};

export default ServiceList;
