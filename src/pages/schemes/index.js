import Layout from "@/components/Dashboard/layout";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getImagePath } from "../../../utils/CustomImagePath";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import CryptoJS from "crypto-js";

const Schemes = () => {
  const router = useRouter();
  const [department, setDepartment] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");

  const getService = async () => {
    setLoader(true);
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL_JAVA}/schemes/api/schemes/DepartmentsScheme?search=${search}`
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

              setDepartment(data);
              setLoader(false);

            } catch (e) {
              console.warn(e)
            }
          }



        }
        // setDepartment(response?.data?.data);
              // setLoader(false);

      })
      .catch((e) => {
        setLoader(false);

        console.warn("e", e);
      });
  };
  useEffect(() => {
    // dispatch(getServiceList())

    getService();
  }, []);

  const handleSeach = () => {
    getService();
  };

  const tttv = [
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
    "linear-gradient(to bottom, #5b912a 0%,#466f20 100%)",
    "linear-gradient(to bottom, #862a91 0%,#67206f 100%)",
    "linear-gradient(to bottom, #c67e30 0%,#986125 100%)",
    "linear-gradient(to bottom, #912a2a 0%,#712121 100%)",
    "linear-gradient(to bottom, #0d5684 0%,#0a4265 100%)",
    "linear-gradient(to bottom, #7c7129 0%,#5f5720 100%)",
    "linear-gradient(to bottom, #ea2c2b 0%,#b52221 100%)",
  ];
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
                <Typography style={{ color: "#0e8193" }} mb={2} mt={2} ml={2}>
                  Department Wise Schemes
                </Typography>
                {/* <Box>
                                  <input
                                      style={{
                                          outline: "none",
                                          border: "1px solid gray",
                                          padding: "7px",
                                          marginRight: "10px",
                                          borderRadius: "4px",
                                          fontSize: "16px",
                                          marginTop: "5px"
                                      }}
                                      placeholder='Search...'
                                      onChange={(e) => setSearch(e.target.value)}
                                      value={search}
                                  />
                                  <Button variant="contained" size='small' style={{ marginRight: "20px", marginTop: "-4px" }} onClick={handleSeach}>Search</Button>

                              </Box> */}
              </Box>

              <Divider variant="middle" />
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
                <Grid container spacing={3} style={{ padding: 15 }}>
                  {department?.map((v, i) => (
                    <Grid
                      key={i}
                      item
                      xs={12}
                      md={3}
                      mb={2}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/scheme-list?id=${v?.department}`)
                      }
                    >
                      <Box
                        padding={2}
                        // display={"flex"}
                        // flexDirection={"column"}
                        // alignItems={"center"}
                        // justifyContent={"space-between"}
                        minHeight={"90%"}
                        // bgcolor={"#ffffff"}

                        sx={{
                          //   background :tttv[i] , // Apply random gradient
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          border: "1px solid #eceff1",
                          // "&:hover": {
                          //     transform: "translateY(-3px)",
                          //     boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                          // }
                        }}
                      >
                        <Typography
                          fontSize={16}
                          height={"100px"}
                          fontWeight={"bold"}
                        >
                          {v?.department}
                        </Typography>
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          mt={2}
                          alignItems={"center"}
                        >
                          <Box mr={2}>
                            <Box
                              fontSize={20}
                              fontWeight={"bold"}
                              backgroundColor={"#1976D2"}
                              borderRadius={"5px"}
                              height={"30px"}
                              width={"30px"}
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              color={"white"}
                            >
                              {v?.scheme_count}
                            </Box>
                          </Box>
                          <Box>
                            <img
                              //   src={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + v?.dept_logo}
                              //   src={v?.dept_logo || "https://sso.hp.gov.in/nodeapi/uploads/1698662325190-logo.png"}
                              src={
                                "https://sso.hp.gov.in/nodeapi/uploads/1698662325190-logo.png"
                              }
                              alt={`scheme logo`}
                              style={{
                                background: "white",
                                // borderRadius : "100%"
                              }}
                              height={50} // Adjust logo size
                              width={60} // Adjust logo size
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
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

export default Schemes;
