import style from "./Card.module.css";

// import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { PDFDownloadLink, Document, Page } from "@react-pdf/renderer";
import QRCode from "qrcode.react";

import Cookies from "js-cookie";

import axios from "axios";
import Image from "next/image";
import CryptoJS from "crypto-js";

import { getImagePath } from "../../../utils/CustomImagePath";
import { encryptBody } from "../../../utils/globalEncryption";

import { useDispatch } from "react-redux";
import Layout from "@/components/Dashboard/layout";
// import axiosInstance from "../../../utils/axiosInstance";

// const widthInInches = 3.38; // Example width in inches
// const heightInInches = 2.13;

const DownloadPVCcard = () => {
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  console.log('uid', uid)

  const [memberDetail, setMemberDetail] = useState({});
  const [loader, setLoader] = useState(false);
  const [cards, setCards] = useState(["123"]);
  const [photo, setphoto] = useState("");

  useEffect(() => {
    setLoader(true);
    const data = async () => {
      const reqData = {
        user_id: uid,
      };

          try {


            let body = {
              // aadharNumber: response?.data?.aadhaarNumber,
              // dob: response?.data?.dob,
              sso_id: uid,
            };
            axios
              .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/himaccess-card`, { data: CryptoJS.AES.encrypt(JSON.stringify(body), process.env.NEXT_PUBLIC_API_SECRET_KEY).toString() })
              .then(async (res) => {

                const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

                var decr1 = CryptoJS.AES.decrypt(res.data.data, secretKey);
                decr1 = decr1.toString(CryptoJS.enc.Utf8);

                let data = {};

                if (decr1) {
                    let json_data = JSON.parse(decr1);
                    data = json_data;

                    setMemberDetail(data);
                    setLoader(false);


                    console.log(data, "adjkansdsjkad")

                  try {
                    // setIsPhotoLoading(true);

                    const response1 = await fetch(
                      process.env.NEXT_PUBLIC_NODE_HIMPARIVAR +
                      "member/getMember_aadhaar_Photo?aadhaar_number=" +
                      data.aadhaarNumber,
                      {
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          // 'Authorization': tokenStore
                        },
                      }
                    );

                    setphoto(response1.url)
                    // const data1 = await response1.json();
                    // // Process the retrieved data
                    // if (data1.status === 200) {
                    //   console.log(data1.image, "asdhjbasjbhdashjdjhd  ");
                    //   setphoto("data:image/png;base64," + data1.image);
                    //   // setIsPhotoLoading(false);
                    // } else {
                    //   // setUserImage('Not Available');
                    //   // setIsPhotoLoading(false);
                    // }
                  } catch (error) {
                    // Handle any errors that occurred during the request
                    console.error("Error:", error);
                    // setIsPhotoLoading(false);
                  }


                }

              })
              .catch((e) => {
                console.warn("e", e);
                setLoader(false);
              });

          }
          catch (e) {
            console.warn(e);



      }
    };
    data();
  }, []);

  const downloadPDF = () => {
    // alert("fsdfd")
    let input = document.getElementById("download");

    // Increase the scale to improve canvas resolution
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Use higher resolution dimensions
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth; // Full-page width
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add more pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("himAccessCard.pdf");
    });
  };

  return (
    <Layout>
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
        <>


     <>
          <div
            id="download"
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {memberDetail && Object.keys(memberDetail).length > 0 && (
              <>
                <div>
                  <div id="main-page">
                    <div style={{ background: "#FFF" }}>
                      <div className={style.flexWapper}>
                        <div className={style.cardCoverpvc2}>
                          <img
                            src={getImagePath("/images/card_bg_hp.png")}
                            className={style.mountainBg}
                          />

                          <div
                            className={style.cardHeaderpvc}
                            style={{ marginTop: 0 }}
                          >
                            <div className={style.leftLogo}>
                              {/* <img src={require('./../../assets/images/emblem_india.png')} alt='mySvgImage' /> */}

                              <img
                                src={getImagePath("/images/hplogo.png")}
                                height={"30px"}
                              />
                            </div>
                            <div className={style.cardHeaderNames}>
                            <p style={{fontSize:13}}>
                                                          <b>Government of Himachal Pradesh</b>
                                                        </p>
                             <p>
                                        <b>Him Access Card</b>
                                      </p>
                              <p style={{ fontWeight: 600, fontSize: 9, fontSize: 12  }}>
                                Him Access Number:{" "}
                                {memberDetail?.himAccessId || ""}
                              </p>
                            </div>
                            <div className={style.rightLogo}>
                              <img
                                src={getImagePath("/images/him-logo.png")}
                                height={"40px"}
                              />
                            </div>
                          </div>

                          <Grid container spacing={0} mt={2}>
                            {/* First Row */}
                            <Grid item xs={2.5}>
                              <div>
                                <Image
                                  src={photo?photo:getImagePath("/images/user.jpg")}
                                  height={55}
                                  width={45}
                                  style={{ marginLeft: 10, marginTop: 5 }}
                                />
                              </div>
                            </Grid>

                            {/* Second Row */}

                            <Grid item xs={7.5}  style={{zIndex:1999}}>
                              <table
                                border="0"
                                style={{
                                  fontSize: 11,

                                  border: 0,
                                  color: "#000",
                                  fontWeight: 700,
                                  // width: 170,
                                  zIndex:1999
                                }}
                              >
                                <tbody>
                                  <tr>
                                    <td>Name</td>
                                    <td>: {memberDetail?.name || ""}</td>
                                  </tr>
                                  {/* <tr>
                                                                <td>रिश्तेदार का नाम</td>
                                                                <td>: {memberDetail?.familyMember?.relativeName || ""}</td>
                                                            </tr> */}
                                  <tr>
                                    <td>Birth Date</td>
                                    <td>: {memberDetail?.dob || ""}</td>
                                  </tr>
                                  <tr>
                                    <td>Gender</td>
                                    <td>
                                      :{" "}
                                      {memberDetail?.gender == 1
                                        ? "Male"
                                        : memberDetail?.gender == 2
                                          ? "Female"
                                          : "Other"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Mobile No.</td>
                                    <td>: {memberDetail?.mobile || ""}</td>
                                  </tr>
                                  <tr>
                                    <td>District</td>
                                    <td>: {memberDetail?.dist || ""}</td>
                                  </tr>
                                  <tr>
                                    <td>State</td>
                                    <td>: {memberDetail?.state || ""}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </Grid>

                            {/* Third Row */}
                          </Grid>
                          {/* <Typography
                                                        style={{
                                                            fontSize: 6,
                                                            marginTop: 14,
                                                            marginLeft: 10,
                                                            color: "#000",
                                                        }}
                                                    >
                                                        जारी करने की तिथि : { "21-07-2024"}
                                                    </Typography> */}
                        </div>
                        {cards &&
                        cards.map((card, card_index) => {
                          return (
                            <>
                              <div style={{ marginLeft:10 }}>
                                <div
                                  className={`${style.cardCoverpvc} ${style.cardCoverpvcback}`}
                                >
                                  <div
                                    className={style.cardHeaderpvc}
                                    style={{
                                      border: "none",
                                      marginTop: "-20px",
                                    }}
                                  >
                                    <div className={style.leftLogo}></div>
                                    <div className={style.cardHeaderNames2}>
                                      <p >
                                        <b>Him Access Card</b>
                                      </p>
                                    </div>
                                    <div className={style.rightLogo}></div>
                                  </div>

                                  <div className={style.cardbodypvc}>
                                    <div className="">
                                      <div className="col-md-12">
                                        <Box
                                          display={"flex"}
                                          justifyContent={"space-between"}
                                          width={"100%"}
                                          mt={2}
                                        >
                                          <div style={{ paddingRight: "20px" }}>
                                            <div
                                              className={style.memberDetails}
                                            >
                                              <p
                                                style={{
                                                  fontSize: 8,
                                                  marginTop: 2,
                                                  color: "#222",
                                                  fontWeight: "700",
                                                }}
                                              >
                                                Address:
                                              </p>
                                            </div>

                                            <div
                                              className={style.memberDetails}
                                            >
                                              <p
                                                style={{
                                                  fontSize: 8,
                                                  marginTop: -5,
                                                  color: "#222",
                                                  fontWeight: "700",
                                                  marginBottom: 20,
                                                }}
                                              >
                                                {memberDetail?.co || ""},{" "}
                                                {memberDetail?.street || ""},{" "}
                                                {memberDetail?.loc || ""},{" "}
                                                {memberDetail?.lm || ""},{" "}
                                                {memberDetail?.vtc || ""},{" "}
                                                {memberDetail?.dist || ""},{" "}
                                                {memberDetail?.state + " " ||
                                                  ""}
                                                - {memberDetail?.pc || ""}
                                              </p>
                                            </div>
                                          </div>
                                          {/*<div>*/}
                                          {memberDetail?.himAccessId && (
                                            <QRCode
                                              value={
                                                `Him Access ID: ${memberDetail?.himAccessId}` ||
                                                ""
                                              }
                                              size={60}
                                              bgColor="#ffffff"
                                              fgColor="#000000"
                                            />
                                          )}

                                          {/*</div>*/}
                                        </Box>

                                        <Typography
                                          style={{
                                            top: "25px",
                                            position: "relative",
                                            fontWeight: "700",
                                            textAlign:'center',
                                            lineHeight:1,
                                            letterSpacing:2
                                          }}
                                        >
                                          {memberDetail?.himAccessId
    ?.toString()
    .replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}
                                        </Typography>
                                        <div
                                          className={style.stickyBottom}
                                          style={{ top: "170px" }}
                                        >
                                          <Box
                                            height={"2px"}
                                            backgroundColor={"red"}
                                            width={"94%"}
                                          ></Box>
                                          <h8>
                                            <b>For more information: </b>
                                          </h8>
                                          <h9>
                                            <b>visit: https://himaccess.hp.gov.in</b>
                                          </h9>


                                          <h11>
                                         <Stack flexDirection={"row"} alignItems={"center"}>
                                         <img
                            src={getImagePath("/images/telephone_11384304.png")}
                            style={{width:12, marginRight:'3px'}}
                          />
                                            <b>
                                            Toll Free : 1100

                                            </b>
                                         </Stack>
                                          </h11>
                                          {/* <h12>
                                            <b>
                                              Ration card related Information:
                                              1967
                                            </b>
                                          </h12> */}

                                          {/* {familyDetails?.familyMembersDetail &&
                                                                                        familyDetails?.familyMembersDetail
                                                                                            .length > 4 && (
                                                                                            <h15>
                                                                                                {card_index + 1}/ {cards.length}
                                                                                            </h15>
                                                                                        )} */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>


                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {memberDetail && Object.keys(memberDetail).length > 0 ? (
            <div
              id="main-page"
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <button
                style={{
                  justifyContent: "center",
                  marginTop: 24,
                  width: 200,
                  backgroundColor: "#1976d2",
                  border: "none",
                  color: "white",
                  padding: "10px 0px",
                  borderRadius: "5px",
                  marginBottom: "100px",
                  cursor: "pointer",
                }}
                onClick={downloadPDF}
                className="btn btn-dark"
              >
                Download Card
              </button>
            </div>
          ) : (
            <Box
              background={"white"}
              display={"flex"}
              justifyContent={"center"}
              flexDirection={"column"}
              width={"100%"}
              height={"100%"}
              mt={4}
            >
              <Box textAlign={"center"}>
                <img
                  src={
                    "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg"
                  }
                  height={"50%"}
                  width={"50%"}
                />
              </Box>
              <Typography textAlign={"center"} mt={1} fontSize={20}>
                Record Not Found
              </Typography>
            </Box>
          )}
        </>

        </>
      )}
    </Layout>
  );
};
export default DownloadPVCcard;
