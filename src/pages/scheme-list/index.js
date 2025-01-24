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
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const SchemeList = () => {
  const router = useRouter();

  const [serviceList, setServiceList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    const getService = async () => {
      const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;

      const encryptedData = CryptoJS.AES.encrypt(router?.query?.id, secretKey).toString();
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL_JAVA}/schemes/api/schemes/SchemeList?department=${encryptedData}`
        )
        .then((response) => {
          if (response.status === 200 || response.status === "OK") {
            let url = "";
            const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
            var decr = CryptoJS.AES.decrypt(response?.data?.data, secretKey);
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
  return (
    <Layout>
      {/* <Box p={5} pt={3}> */}
      <Grid container spacing={4} sx={{ padding: 2, marginBottom: 10 }}>
        <Grid item={true} xs={12}>
          <Card elevation={10}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                {router?.query?.id} Schemes List
              </Typography>
            </Box>

            <Divider variant="middle" />
            <Box p={5} pt={3}>
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
                <Grid container spacing={3}>
                  {serviceList?.map((v, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Box
                        border={"1px solid #ddd"}
                        p={2}
                        textAlign="center"
                        position="relative"
                        style={{
                          backgroundColor: "#fff",
                          boxShadow: "0 10px 26px -17px #00000052",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                          cursor: "pointer",
                        }}
                        sx={{
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "5px", // Adjust the height of the border
                            background:
                              "linear-gradient(135deg, #0d6efd, #002a67)",
                            //   borderRadius: '10px', // Optional: for rounded corners
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                          },
                        }}
                        onClick={() =>
                          window.open(
                            `https://himparivar.hp.gov.in/scheme-details/${encodeURIComponent(
                              v?.dept_id
                            )}/${encodeURIComponent(v?.name_of_scheme)}`
                          )
                        }
                      >
                        {/* <Link to={`https://himparivar.hp.gov.in/scheme-details/${encodeURIComponent(v?.dept_id)}/${encodeURIComponent(v?.name_of_scheme)}`} target="_blank" > */}
                        <Typography color={"#5A5C69"} fontSize={"15px"}>
                          {v?.name_of_scheme}
                        </Typography>{" "}
                        {/* </Link> */}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* </Box> */}
    </Layout>
  );
};

export default SchemeList;

// {
//     data?.map(v => (
//         <Grid item sx={12} md={4} borderRadius={"10px"} border={"1px solid #ddd"} mb={3} pb={3}
//             style={{ backgroundColor: "#fff", boxShadow: "0 10px 26px -17px #00000052" }}>

//             <Typography color={"#5A5C69"} fontSize={"15px"}>{v}</Typography>
//         </Grid>
//     ))
// }
