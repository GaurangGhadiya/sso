import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Cookies from "js-cookie";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
// import Image from "next/image";
import style from "./AllServices.module.css";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../../redux/actions/alert";
import TopCard from "@/components/TopCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActionArea, CardActions } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import Image from "next/image";
import { getImagePath } from "../../../../utils/CustomImagePath";

const cardStyle = {
  width: 300,
  margin: "auto",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Adding a shadow effect
  textAlign: "center",
};

const contentStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px", // Adjust the height as needed
};

let list = [
  {
    name: "acbsdf asjkldnsakjdsad dasdsad ",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
  {
    name: "acbsdf asjkldnsakjd",
    logo: "dukandar",
    service_id: "10111001",
  },
];

const AllServices = () => {
  const [allServices, setAllServices] = useState({});

  const uid = Cookies.get("uid");

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllServices = async () => {
      if (uid) {
        try {
          const reqData = {
            uid,
          };

          const response = await api.post("/all-services", reqData);

          if (response.status === 200) {
            setAllServices(response.data);
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

    getAllServices();
  }, [uid]);

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
        const response = await api.post("/redirect-to-success", reqData);

        if (response.status === 200) {
          let url = response.data.success_url;

          let parameter = "";

          if (service_id === 10000038) {
            parameter = "token=" + response.data.tempToken + "&service_id=" + 0;
          } else {
            parameter = "token=" + response.data.tempToken;
          }

          if (url.includes("?")) {
            url += "&" + parameter;
          } else {
            url += "?" + parameter;
          }

          openInNewWindow(url);
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
    <Card elevation={10}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography style={{ color: "#0e8193" }} mb={3} mt={2} ml={2}>
          All Services
        </Typography>
      </Box>

      <Divider variant="middle" />

      {/* <Grid container spacing={3} mb={4} ml={1} mr={2}> */}

      <Grid
        style={{ margin: 15 }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 3, sm: 8, md: 12 }}
      >
        {allServices &&
          allServices.length > 0 &&
          allServices.map((item, index) => (
            <Box key={index} onClick={() => redirectToService(item.service_id)}>
              <a key={index} href="#" class="card human-resources">
                <div key={index} class="overlay"></div>
                <div key={index} class="circle">
                  <img
                    key={index}
                    src={
                      process.env.NEXT_PUBLIC_API_BASE_URL +
                      "/uploads/" +
                      item.logo
                    }
                    alt={item.name}
                    style={{ maxWidth: 80 }}
                  />
                </div>
                <Typography
                  style={{
                    color: "#1876d1",
                    marginLeft: 10,
                    fontWeight: "500",
                    fontSize: 18,
                    wordWrap: "break-word",
                  }}
                >
                  {item.name}
                </Typography>
              </a>
            </Box>
          ))}
      </Grid>
    </Card>
  );
};
export default AllServices;
