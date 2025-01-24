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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// import Image from "next/image";
import style from "./AllServices.module.css";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../../redux/actions/alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from "next/router";

import Modal from "@mui/material/Modal";

import styled from "styled-components";
import axios from "axios";
import encryptEmployeeCode, { encryptBody } from "../../../../utils/globalEncryption";
import decryptEmployeeCode from "../../../../utils/globalDecryption";
import { getImagePath } from "../../../../utils/CustomImagePath";
import AlertModal from "@/components/AlertModal";

const gradientStyle = {
  height: "30px",
  background: "linear-gradient(90deg, rgba(24, 118, 209,0.5), transparent)",
  /* You can adjust the angle and colors as needed */
};

const StyledDialogActions = styled(DialogActions)({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  // width : "100%"
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    // padding: 0,
  },
  '& .MuiDialogActions-root': {
    // padding:0,
  },
}));

const AllServices = () => {
  const [servicesList, setservicesList] = useState([]);
  const uid = Cookies.get("uid");
  const [openModal, setOpenModal] = useState(false);

  const [token, setToken] = useState("")

  const [stateList, setstateList] = useState([]);

  const [rolee, setRolee] = useState("");
  const [parichayUserId, setparichayUserId] = useState("");

  const [name, setName] = useState("");
  const [modalData, setModalData] = useState({})
  const [selectedModalIndex, setSelectedModalIndex] = useState(null)
  const [getToken, setGetToken] = useState(null);
  const [GovEmail, setGovEmail] = useState("himpmu.ddtg@hpmail.in");
  const [service, setServece] = useState({})
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});
  const route = useRouter();

  useEffect(() => {
    let userInfo = "";

    const encryptedData = Cookies.get("govEnc");
if(encryptedData){

  userInfo = JSON.parse(atob(encryptedData));

  setToken(userInfo?.token)
}

  }, [])

  const handleClickOpen = (parsed_data) => {
    setOpenModal(true);
    setModalData(parsed_data?.[0])
    setSelectedModalIndex(null)
  };
  const handleClickClose = () => {
    setOpenModal(false);
    setModalData({})
    setSelectedModalIndex(null)


  };

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
      logo: "/logo/e-office.png",
      url: "https://eoffice.hp.gov.in/",
    },
    {
      name: "eForms",
      logo: "/logo/eForms.png",
      url: "https://parichay.nic.in/Accounts/NIC/index.html?service=eforms",
    },
    {
      name: "eHRMS",
      logo: "/logo/ehrms_logo.png",
      url: "https://eresource.gov.in/Parichay_Login/login_parichay.php",
    },
    {
      name: "Sparrow",
      logo: "/logo/e-office.png",
      url: "https://sparrow.eoffice.gov.in/SPARROW/Home",
    },
  ];

  const [allServices, setAllServices] = useState(servicesArr);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getServicesLists = async (appId) => {
    try {
      //   const response = await api.post("/get-parichay-app", {
      //     user_id: email,
      //     service_type: "parichay",
      //   });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/master-data/getServiceDetails?appId=` +
        appId
      );

      if (response) {
        setAllServices(response.data);
        setOpen(true);
        // getStateLists();
      }
    } catch (e) { }
  };

  const getLists = async (email) => {
    try {
      //   const response = await api.post("/get-parichay-app", {
      //     user_id: email,
      //     service_type: "parichay",
      //   });

      let emailValue = encryptEmployeeCode(JSON.stringify(email));

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getApplicationDetails?email=` +
        encodeURIComponent(encryptEmployeeCode(email))
      );


      let dec_data = decryptEmployeeCode(response.data.data);

      try {
        let parsed_data = JSON.parse(dec_data);

        setservicesList(parsed_data);

        getStateLists(email);
      } catch (e) { }

      // getStateLists();
    } catch (e) { }
  };
  const getServicesDetails = async (service) => {

    setLoading(true)
    const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getToken?email=`+ GovEmail
          + "&appUniqueCode="+ service?.applicationUniqueCode + "&serviceId=" + service?.serviceId
        );

    // const response = await axios.get(
    //   "https://himstaging1.hp.gov.in/sarvatra-api/application/getToken?email=" + GovEmail
    //   + "&appUniqueCode=" + service?.applicationUniqueCode + "&serviceId=" + service?.serviceId
    // );

    const userDetailsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getUserDetails?token=` +
      JSON.parse(response.data.data)[0]?.token
      +
      "&serviceId=" + service?.serviceId
    );
    setGetToken(JSON.parse(response.data.data)[0]?.token)
    setLoading(false)

    if (userDetailsRes?.data?.data ) {

      let dec_data = decryptEmployeeCode(userDetailsRes.data.data);
      let parsed_data = JSON.parse(dec_data);
      if(parsed_data?.[0]?.additionalChargeDetailDTO?.length > 1){

        handleClickOpen(parsed_data)
      }else{
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('target', '_blank');
        form.setAttribute('action', service.successUrl); // Set the action URL to your success URL

        // Create input fields for each parameter
        var params = {
            id: service.serviceId || 0,
            // userName: GovEmail || "",
            user_id: GovEmail || "",
            token: getToken || "",
            role_id: service.serviceId || 0,
            service_id: service.serviceId || 0,
            // serviceId: service.serviceId || 0,
            successurl: service.successUrl || "",
            // app: service.applicationUniqueCode || 0,
            department_unique_code: service.applicationUniqueCode,
            userid: parichayUserId || "",
            dept_id:"",
            department_name:"",
            department_id: modalData?.additionalChargeDetailDTO?.[selectedModalIndex]?.departmentId
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
          getToken +
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
          parichayUserId
          // +
          // "&department_id=" +
          //  modalData?.additionalChargeDetailDTO?.[selectedModalIndex]?.departmentId
           )

        }else{
          if(params?.token){

            form.submit();
          }else{
            alert("Token not generated")
          }
        }


      }
    }
  };
  const getListsCopy = async (appId) => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_PROD_URL}/sarvatra-api/application/getServiceDetails?appId=` +
        encodeURIComponent(encryptEmployeeCode(JSON.stringify(appId)))
      );

      let dec_data = decryptEmployeeCode(response.data.data);
      let parsed_data = JSON.parse(dec_data);
      setServece(parsed_data?.[0])
      setLoading(false)
      return parsed_data

      // if (response) {
      //   let dec_data = decryptEmployeeCode(response.data.data);

      //   try {
      //     let parsed_data = JSON.parse(dec_data);

      //     setservicesList(parsed_data);
      //   } catch (e) {}

      //   // getStateLists();
      // }
    } catch (e) {
      setLoading(false)
    }
  };

  const getStateLists = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/official/api/service-list`,
        {
          user_id: email,
          service_type: "parichay",
        }
      );

      if (response) {
        setstateList(response?.data?.MSG?.data);
        // setservicesList(response.data);
      }
    } catch (e) { }
  };

  useEffect(() => {

    const encryptedData = Cookies.get("govEnc");

    let userInfo = "";
    if (encryptedData) {
      try {
        userInfo = JSON.parse(atob(encryptedData));
        setName(userInfo.name);
        setGovEmail(userInfo.userName);

        setparichayUserId(userInfo.parichay_userid);
        setRolee(userInfo.role_id);
        getLists(userInfo.userName);

      } catch (e) {

        console.warn(e, "sdjhbsabhjdashbjds")
      }



    }


    getLists(userInfo.userName);
    // else {
    // 	route.push("./login");
    // }
  }, [GovEmail]);

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
        } catch (error) { }
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
        } catch (error) { }
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

    // let url =
    //   "https://sso.hp.gov.in/official/user/sso-login?id=" +
    //   item.service_id +
    //   "&userName=" +
    //   GovEmail +
    //   "&token=" +
    //   token +
    //   "&role_id=" +
    //   item.service_id +
    //   "&serviceId=" +
    //   item.service_id +
    //   "&successurl=" +
    //   item.url +
    //   "&app=" +
    //   item.url +
    //   "&userid=" +
    //   parichayUserId



    // const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    // Check if the window was successfully opened
    if (newWindow) {
      // Focus the new window (optional)
      newWindow.focus();
    }
  }


  const getUrl = (url) => {
    let urlObj = new URL(url);
    let searchParams = new URLSearchParams(urlObj.search);

    // Get values of filename and path parameters
    let filename = searchParams.get("filename")?.replaceAll(" ", "+");
    let path = searchParams.get("path")?.replaceAll(" ", "+");
    return { filename, path }
  }

  const handleProceed = () => {
    if(selectedModalIndex != null){
      var form = document.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('target', '_blank');
      form.setAttribute('action', service.successUrl); // Set the action URL to your success URL

      // Create input fields for each parameter
      var params = {
          id: service.serviceId || 0,
          // userName: GovEmail || "",
          user_id: GovEmail || "",
          token: getToken || "",
          role_id: service.serviceId || 0,
          service_id: service.serviceId || 0,
          // serviceId: service.serviceId || 0,
          successurl: service.successUrl || "",
          // app: service.applicationUniqueCode || 0,
          department_unique_code: service.applicationUniqueCode,
          userid: parichayUserId || "",
          dept_id:"",
          department_name:"",
          department_id: modalData?.additionalChargeDetailDTO?.[selectedModalIndex]?.departmentId
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
        getToken +
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
        parichayUserId +
        "&department_id=" +
         modalData?.additionalChargeDetailDTO?.[selectedModalIndex]?.departmentId
         )

      }else{
        if(params?.token){

          form.submit();
        }else{
          alert("Token not generated")
        }
      }

    }else{
      // alert("Please select any one additional charge.")
      setAlert({
				open: true,
				type: false,
				message: "Please select any one additional charge",
			});
    }

  }

  return (
    <main className="p-6 space-y-6">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      </Backdrop>
      			{alert.message && <AlertModal alert={alert} handleClose={() => setAlert({ open: false, type: false, message: null })} />}

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
                          route.push("/sub-services");
                          //   getServicesLists(item.applicationId);
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
                              {item.applicationName}
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
              // display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item sx={{ width: "100%" }}>
                <Card>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                      Center Applications
                    </Typography>
                  </Box>

                  <Grid container ml={1} mt={2} xs={12}>
                    {allServices &&
                      allServices.length > 0 &&
                      allServices.map((item, index) => (
                        <Card
                          key={index}
                          elevation={4}
                          sx={{
                            "&:hover": {
                              transform: "scale(1.02)", // Scale the card on hover
                            },
                            width: 200,
                            marginRight: 5,
                            marginBottom: 5,
                          }}
                        >
                          <CardActionArea onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}>
                            <CardMedia
                              style={{
                                height: 70, // Adjust this value to suit your layout
                                objectFit: "contain",
                                // This ensures the image fills the space without stretching
                              }}
                              component="img"
                              image={getImagePath(item.logo)}


                            />

                            <Divider style={{ marginTop: 12 }}></Divider>

                            <Grid container spacing={2}>
                              <Grid item xs={9.5}>
                                <Typography
                                  gutterBottom
                                  mt={1}
                                  style={{ textAlign: "center", fontSize: 14 }}
                                >
                                  {item.name} {" Application"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardActionArea>
                        </Card>
                      ))}
                  </Grid>
                </Card>
              </Grid>

              <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
                State Applications
              </Typography>
            </Box>

            <Grid container ml={1} mt={2} xs={12}>
              {servicesList &&
                servicesList.length > 0 ?
                servicesList.map((item, index) => item?.applicationId != 28 && (
                  <Card
                    key={index}
                    elevation={4}
                    sx={{
                      "&:hover": {
                        transform: "scale(1.02)", // Scale the card on hover
                      },
                      width: 150,
                      marginRight: 2,
                      marginLeft: 2,
                      marginBottom: 5,
                    }}
                  >
                    <CardActionArea
                      //   onClick={() => openInNewWindow(item.app_url)}
                      onClick={async () => {
                        let data = await getListsCopy(item?.applicationId)
                        if (data?.length == 0) {
                          alert("Integration Under Process!")
                        }
                        else if (data?.length > 1) {

                          route.push("/sub-services?app_id=" + item.applicationId + "&id=" + item.id);
                        } else if (data?.length > 0) {
                          getServicesDetails(data?.[0])
                        }
                        // getServicesLists(item.applicationId);
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
                        image={item.serviceIcon?.split("filename=")?.[0] + "filename=" + encodeURIComponent(getUrl(item.serviceIcon)?.filename?.trim()) + "&path=" + encodeURIComponent(getUrl(item.serviceIcon)?.path?.trim())}
                        alt="green iguana"
                      />

                      <Divider style={{ marginTop: 12 }}></Divider>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography
                            gutterBottom
                            mt={1}
                            style={{ textAlign: "center", fontSize: 14 }}
                          >
                            {item.applicationName}
                          </Typography>
                        </Grid>

                        {/* <Grid
                          item
                          xs={2}
                          sx={{ justifyContent: "center", alignSelf: "center" }}
                        > */}
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
                        {/* </Grid> */}
                      </Grid>
                    </CardActionArea>
                  </Card>
                )) : <Typography textAlign={"center"} mt={2} mb={5} display={"flex"} justifyContent={"center"} width={"100%"}>Application Not Mapped</Typography>}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2} mb={5}>
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
                        image={getImagePath("/logo/hp.png")}


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
            <Grid container spacing={2}>

        </Grid>
          </Card>
        </Grid>
      </Grid> */}
      <BootstrapDialog
        onClose={handleClickClose}
        aria-labelledby="customized-dialog-title"
        open={openModal}
fullWidth={true}
        maxWidth="md"
        style={{borderRadius : "8px"}}

      >
        <DialogTitle sx={{ m: 0, p: 1, textAlign : "center", background: "#1976D2", color : "white", fontSize : "18px" }} id="customized-dialog-title" >
          Please select charge
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClickClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 4,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon color="white"/>
        </IconButton>
        <DialogContent dividers
        // style={{backgroundImage:`url('https://ddtg.hp.gov.in/wp-content/uploads/2020/06/hp-logo200-3.png')`,
        //   backgroundPosition: "right",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "500px"
        // }}
        >

          <Grid container ml={0} mt={1} xs={12}>
          {modalData?.additionalChargeDetailDTO?.map((v,index) => (
            <>
              <Card
                key={index}
                elevation={2}
                sx={{
                  "&:hover": {
                    transform: "scale(1.02)", // Scale the card on hover
                  },
                  border: index === selectedModalIndex ? '2px solid #1565C0' : 'none', // Conditional border style
                  width: 245,
                  marginRight: 2,
                  marginLeft: 2,
                  marginBottom: 2,

                }}
              >
                <CardActionArea
                  //   onClick={() => openInNewWindow(item.app_url)}
                  onClick={async () => {
                    setSelectedModalIndex(index)
                  }}
                >

                  <CardMedia
                    style={{
                      marginTop : 10,
                      height: 70, // Adjust this value to suit your layout
                      width: "100%", // Adjust this value to suit your layout
                      objectFit: "contain",
                      // This ensures the image fills the space without stretching
                    }}
                    component="img"
                    image={"https://ddtg.hp.gov.in/wp-content/uploads/2020/06/hp-logo200-3.png"}
                    alt="green iguana"
                  />

                  <Divider style={{ marginTop: 12 }}></Divider>
{index === selectedModalIndex && <CheckCircleIcon style={{position : "absolute", top: "5px", right : "5px", color: "#25D366"}}/>}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        gutterBottom
                        mt={1}
                        style={{paddingLeft : "10px", fontSize: 12 ,display : "flex"}}
                      >
                       <div style={{fontWeight : "bold",width : "40%"}}>Department Name:</div>
                       <div style={{width : "60%"}}>{v?.departmentName}</div>
                      </Typography>
                      <Typography
                        gutterBottom
                        mt={1}
                        style={{paddingLeft : "10px", fontSize: 12,display : "flex" }}
                      >
                       <span style={{fontWeight : "bold",width : "40%"}}>Designation:</span> {v?.desigName}
                      </Typography>
                      <Typography
                        gutterBottom
                        mt={1}
                        style={{paddingLeft : "10px", fontSize: 12,display : "flex" }}
                      >
                       <span style={{fontWeight : "bold",width : "40%"}}>Office Name:</span> {v?.officeName}
                      </Typography>
                      {v?.chargeAssignedOn &&<Typography
                        gutterBottom
                        mt={1}
                        style={{paddingLeft : "10px", fontSize: 12 }}
                      >
                       <span style={{fontWeight : "bold",width : "40%"}}>Joining Date:</span> {v?.chargeAssignedOn}
                      </Typography>}
                    </Grid>


                  </Grid>
                </CardActionArea>
              </Card>
            </>
          ))}
          </Grid>

          {/* <p style={{marginTop : 0, paddingTop : 0, fontSize : "13px", marginLeft : "17px", marginBottom : "-7px"}}><b>Note:</b><span> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </span></p> */}
        </DialogContent>
        <Box textAlign={"right"} padding={"10px 15px"} >
          <Button autoFocus onClick={handleClickClose} variant="contained" color="error" style={{marginRight : "10px", height : "30px"}}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleProceed} variant="contained" style={{backgroundColor : "#29AB0E", height : "30px"}}>
          Proceed
          </Button>
        </Box>
      </BootstrapDialog>
    </main>
  );
};
export default AllServices;
