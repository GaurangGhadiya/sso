import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Cookies from "js-cookie";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Rating,
  CardActionArea,
  Divider,
} from "@mui/material";
// import Image from "next/image";
import style from "./AllServices.module.css";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../../redux/actions/alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

import Modal from "@mui/material/Modal";

import styled from "styled-components";
import axios from "axios";
import encryptEmployeeCode, { encryptBody } from "../../../../utils/globalEncryption";
import decryptEmployeeCode from "../../../../utils/globalDecryption";

const gradientStyle = {
  height: "30px",
  background: "linear-gradient(90deg, rgba(24, 118, 209,0.5), transparent)",
  /* You can adjust the angle and colors as needed */
};

const SubServiceComponent = () => {
  const [servicesList, setservicesList] = useState([]);
  const uid = Cookies.get("uid");

  const [stateList, setstateList] = useState([]);

  const [userDetails, setUserDetails] = useState({});

  const [urlDetails, seturlDetails] = useState({});


 const [token, setToken] = useState("")

  const [rolee, setRolee] = useState("");
  const [parichayUserId, setparichayUserId] = useState("");

  const [name, setName] = useState("");
  const [GovEmail, setGovEmail] = useState("vijay.premi@govcontractor.in");
  const route = useRouter();

  let app_id = route.query.app_id;
  let ids = route.query.id;

  const [appId, setappId] = useState(app_id);

  const [id, setId] = useState(ids);


  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const servicesArr = [
    {
      name: "eOffice",
      logo: "/parichay/eoffice.png",
      url: "https://eoffice.hp.gov.in/",
    },
    {
      name: "eForms",
      logo: "/parichay/eForms.png",
      url: "https://parichay.nic.in/Accounts/NIC/index.html?service=eforms",
    },
    {
      name: "eHRMS",
      logo: "/parichay/ehrms_logo.png",
      url: "https://eresource.gov.in/Parichay_Login/login_parichay.php",
    },
  ];

  const [allServices, setAllServices] = useState(servicesArr);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getServicesDetails = async (service) => {
    try {
      //   const response = await api.post("/get-parichay-app", {
      //     user_id: email,
      //     service_type: "parichay",
      //   });


      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getUserDetails?token=` +
          token
           +
          "&serviceId=" + service?.serviceId
      );



      if (response) {

        let dec_data = decryptEmployeeCode(response.data.data);

        try{

          let parsed_data = JSON.parse(dec_data);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getToken?email=` + GovEmail
            + "&appUniqueCode="+ service?.applicationUniqueCode + "&serviceId=" + service?.serviceId
          );


var form = document.createElement('form');
form.setAttribute('method', 'post');
form.setAttribute('target', '_blank');
form.setAttribute('action', service.successUrl); // Set the action URL to your success URL

// Create input fields for each parameter
var params = {
    id: service.serviceId || 0,
    // userName: GovEmail || "",
    user_id: GovEmail || "",
    token: JSON.parse(response.data.data)?.[0]?.token || "",
    role_id: service.serviceId || 0,
    service_id: service.serviceId || 0,
    // serviceId: service.serviceId || 0,
    // successurl: service.successUrl || "",
    // app: service.applicationUniqueCode || 0,
    department_unique_code: "ReportingManagementSys",
    // userid: parichayUserId || ""
};

// Iterate over the parameters object and create input fields
for (var key in params) {
    if (params.hasOwnProperty(key)) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', params[key]);
        form.appendChild(input);
    }
}

// Append the form to the document body and submit it
document.body.appendChild(form);
if(service.serviceId == 1){
  window.open(service.successUrl + "?" +
    "id=" +
service.serviceId +
"&userName=" +
GovEmail +
"&user_id=" +
GovEmail +
"&token=" +
JSON.parse(response.data.data)?.[0]?.token +
"&role_id=" +
service.serviceId +
"&service_id=" +
service.serviceId +
"&successurl=" +
service.successUrl +
"&app=" +
service.applicationUniqueCode +
"&department_unique_code=" +
service.applicationUniqueCode+
"&userid=" +
parichayUserId )

}else{
if(params?.token){

form.submit();
}else{
alert("Token not generated")
}
}
//           if (parsed_data.length > 0) {
//             window.location.href =
//               // "https://" +
//               service.successUrl +
//               "?id=" +
//       service.serviceId +
//       "&userName=" +
//       GovEmail +
//       "&user_id=" +
// GovEmail +
//       "&token=" +
//       token +
//       "&role_id=" +
//       service.serviceId +
//       "&serviceId=" +
//       service.serviceId +
//       "&service_id=" +
//       service.serviceId +
//       "&successurl=" +
//       service.successUrl +
//       "&app=" +
//       service.applicationUniqueCode +
//       "&department_unique_code=" +
// "ReportingManagementSys" +
//       "&userid=" +
//       parichayUserId

//           }

        }
        catch(e){

        }

        // setAllServices(response.data);
        // setOpen(true);
        // getStateLists();
      }
    } catch (e) {
      console.warn(e, "sadjknsaknjdknasdaskjd");
    }
  };

  const getLists = async (appId) => {
    try {
      //   const response = await api.post("/get-parichay-app", {
      //     user_id: email,
      //     service_type: "parichay",
      //   });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getServiceDetails?appId=` +
          encodeURIComponent(encryptEmployeeCode(appId))
      );

      if (response) {
        let dec_data = decryptEmployeeCode(response.data.data);

        try {
          let parsed_data = JSON.parse(dec_data);
          setservicesList(parsed_data);
        } catch (e) {}

        // getStateLists();
      }
    } catch (e) {}
  };

  const getStateLists = async (email) => {
    try {
      const response = await axios.get(
        "https://sso.hp.gov.in/official/api/service-list",
        {
          user_id: email,
          service_type: "parichay",
        }
      );

      if (response) {
        setstateList(response?.data?.MSG?.data);
        // setservicesList(response.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const encryptedData = Cookies.get("govEnc");

    let userInfo = "";
    if (encryptedData) {
      try {
        userInfo = JSON.parse(atob(encryptedData));
      } catch (e) {
        console.warn(e, "ASdjasdajk");
      }


      setName(userInfo.name);
      setGovEmail(userInfo.userName);
setToken(userInfo?.token)
      setparichayUserId(userInfo.parichay_userid);
      setRolee(userInfo.role_id);
      getLists(userInfo.userName);
    }
    getLists(route.query.app_id);
    // else {
    // 	route.push("./login");
    // }
  }, []);

  const removeFromFavourite = async (event, item) => {
    event.stopPropagation();

    Swal.fire({
      title: "Remove from Favourites?",
      text: `Are you sure you want to Remove ${item.app_name} Application from your favorites`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reqData = {
          user_id: GovEmail,
          service_ids: [item.id],
          service_type: "parichay",
        };

        try {
          const response = await api.post("/user-favourate-app", { data: encryptBody(JSON.stringify(reqData)) });

          if (response.status === 200) {
            Swal.fire(
              "Success!",
              `${item.app_name} Application has been removed from favorites`,
              "success"
            );

            getLists(GovEmail);
          }
        } catch (error) {}
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  };

  const addToFavourite = async (event, item) => {
    event.stopPropagation();

    Swal.fire({
      title: "Add to Favourites?",
      text: `Are you sure you want to add ${item.app_name} Application to your favorites`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reqData = {
          user_id: GovEmail,
          service_ids: [item.id],
          service_type: "parichay",
        };

        try {
          const response = await api.post("/user-favourate-app", { data: encryptBody(JSON.stringify(reqData)) });

          if (response.status === 200) {
            Swal.fire(
              "Success!",
              `${item.app_name} Application has been added to favorites`,
              "success"
            );

            getLists(GovEmail);
          }
        } catch (error) {}
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  };

  function openInNewWindow(url) {
    // Open the URL in a new window with specific window features
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");

    // Check if the window was successfully opened
    if (newWindow) {
      // Focus the new window (optional)
      newWindow.focus();
    }
  }

  function openStateInNewWindow(item) {
    // Open the URL in a new window with specific window features

    let url =
      "https://sso.hp.gov.in/official/api/sso-login?id=" +
      item.service_id +
      "&role_id=" +
      rolee +
      "&userid=" +
      parichayUserId;

    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    // Check if the window was successfully opened
    if (newWindow) {
      // Focus the new window (optional)
      newWindow.focus();
    }
  }

  return (
    <main className="p-6 space-y-6">

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid item sx={{ width: "100%" }}>
            <Card>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                  Services
                </Typography>
              </Box>

              <Grid container ml={1} mt={2} xs={12}>
                {servicesList &&
                  servicesList.length > 0 &&
                  servicesList.map((item, index) => (
                    <Card
                      key={index}
                      elevation={4}
                      sx={{
                        "&:hover": {
                          transform: "scale(1.02)", // Scale the card on hover
                        },
                        width: 230,
                        marginRight: 5,
                        marginBottom: 5,
                      }}
                    >
                      <CardActionArea
                        //   onClick={() => openInNewWindow(item.app_url)}
                        onClick={() => {
                          seturlDetails(item);
                          getServicesDetails(item);
                        }}
                      >
                        <CardMedia
                          style={{
                            height: 70, // Adjust this value to suit your layout
                            width: "100%", // Adjust this value to suit your layout
                            objectFit: "contain",
                            // This ensures the image fills the space without stretching
                          }}
                          component="img"
                          image="/logo/hp.png"
                          alt="green iguana"
                        />

                        <Divider style={{ marginTop: 12 }}></Divider>

                        <Grid container spacing={2}>
                          <Grid item xs={9.5}>
                            <Typography
                              gutterBottom
                              mt={1}
                              style={{ textAlign: "center", fontSize: 14 }}
                            >
                              {item.serviceName}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={2}
                            sx={{
                              justifyContent: "center",
                              alignSelf: "center",
                            }}
                          >
                            {item.parichay_favorite_app && (
                              <IconButton
                                color="warning"
                                aria-label="delete"
                                size="medium"
                                style={{ marginRight: 14 }}
                                onClick={(event) =>
                                  removeFromFavourite(event, item)
                                }
                              >
                                <StarIcon fontSize="inherit" />
                              </IconButton>
                            )}

                            {!item.parichay_favorite_app && (
                              <IconButton
                                aria-label="delete"
                                size="medium"
                                style={{ marginRight: 14 }}
                                onClick={(event) => addToFavourite(event, item)}
                              >
                                <StarBorderIcon fontSize="inherit" />
                              </IconButton>
                            )}

                            {/* <Rating onClick={() => addToFavourite(item)} style={{ marginRight: 14 }} name="customized-1" defaultValue={0} max={1} /> */}
                          </Grid>
                        </Grid>
                      </CardActionArea>
                    </Card>
                  ))}
              </Grid>
            </Card>
          </Grid>
        </Box>
      </Modal>

      <Grid container spacing={2}>
        <Grid item sx={{ width: "100%" }}>
          <Card>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                Services
              </Typography>
            </Box>

            <Grid container ml={1} mt={2} xs={12}>
              {servicesList &&
                servicesList.length > 0 &&
                servicesList.map((item, index) => (
                  <Card
                    key={index}
                    elevation={4}
                    sx={{
                      "&:hover": {
                        transform: "scale(1.02)", // Scale the card on hover
                      },
                      width: 230,
                      marginRight: 5,
                      marginBottom: 5,
                    }}
                  >
                    <CardActionArea
                      //   onClick={() => openInNewWindow(item.app_url)}
                      onClick={() => {
                        seturlDetails(item);
                        getServicesDetails(item);
                      }}
                    >
                      <CardMedia
                        style={{
                          height: 70, // Adjust this value to suit your layout
                          width: "100%", // Adjust this value to suit your layout
                          objectFit: "contain",
                          // This ensures the image fills the space without stretching
                        }}
                        component="img"
                        image={item.serviceIcon?.split("filename=")?.[0]+"filename="+encodeURIComponent(item.serviceIcon?.split("filename=")?.[1])}
                        alt="green iguana"
                      />

                      <Divider style={{ marginTop: 12 }}></Divider>

                      <Grid container spacing={2}>
                        <Grid item xs={9.5}>
                          <Typography
                            gutterBottom
                            mt={1}
                            style={{ textAlign: "center", fontSize: 14 }}
                          >
                            {item.serviceName}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={2}
                          sx={{ justifyContent: "center", alignSelf: "center" }}
                        >
                          {/* {item.parichay_favorite_app && (
                            <IconButton
                              color="warning"
                              aria-label="delete"
                              size="medium"
                              style={{ marginRight: 14 }}
                              onClick={(event) =>
                                removeFromFavourite(event, item)
                              }
                            >
                              <StarIcon fontSize="inherit" />
                            </IconButton>
                          )} */}

                          {/* {!item.parichay_favorite_app && (
                            <IconButton
                              aria-label="delete"
                              size="medium"
                              style={{ marginRight: 14 }}
                              onClick={(event) => addToFavourite(event, item)}
                            >
                              <StarBorderIcon fontSize="inherit" />
                            </IconButton>
                          )} */}

                          {/* <Rating onClick={() => addToFavourite(item)} style={{ marginRight: 14 }} name="customized-1" defaultValue={0} max={1} /> */}
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2}>
        <Grid item sx={{ width: "100%" }}>
          <Card>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                State Applications
              </Typography>
            </Box>

            <Grid container ml={1} mt={2} xs={12}>
              {stateList &&
                stateList.length > 0 &&
                stateList.map((item, index) => (
                  <Card
                    key={index}
                    elevation={4}
                    sx={{
                      "&:hover": {
                        transform: "scale(1.02)", // Scale the card on hover
                      },
                      width: 230,
                      marginRight: 5,
                      marginBottom: 5,
                    }}
                  >
                    <CardActionArea onClick={() => openStateInNewWindow(item)}>
                      <CardMedia
                        style={{
                          height: 70, // Adjust this value to suit your layout
                          objectFit: "contain",
                          // This ensures the image fills the space without stretching
                        }}
                        component="img"
                        image={"/logo/hp.png"}
                        alt="green iguana"
                      />

                      <Divider style={{ marginTop: 12 }}></Divider>

                      <Grid container spacing={2}>
                        <Grid item xs={9.5}>
                          <Typography
                            gutterBottom
                            mt={1}
                            style={{ textAlign: "center", fontSize: 14 }}
                          >
                            {item.service_name} {" Application"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardActionArea>
                  </Card>
                ))}
            </Grid>
          </Card>
        </Grid>
      </Grid> */}
    </main>
  );
};
export default SubServiceComponent;
