import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/UI/Header";
import withDeptAuth from "../../../utils/withDeptAuth";
import DeptDashboard from "@/components/Dashboard/DeptDashboard";
import api from "../../../utils/api";
import ServiceWiseTnx from "@/components/Dashboard/ServiceWiseTnx";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 30,
  maxHeight: "80vh",
  overflow: "hidden",
  overflowY: "auto",
  p: 4,
  borderRadius: 1,
};

const DepartmentContainer = (props) => {
  const [serviceID, setServiceID] = useState(0);
  const [showServiceTrans, setShowServiceTrans] = useState({});

  useEffect(() => {
    const getUserTrnx = async () => {
      const reqData = {
        service_id: serviceID,
      };

      try {
        const response = await api.post(
          "/transaction-details-by-service_id",
          { data: encryptBody(JSON.stringify(reqData)) }
        );

        if (response.status === 200) {
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

                setShowServiceTrans(data);


              } catch (e) {
                console.warn(e)
              }
            }



          }
        } else {
        }
      } catch (error) {}
    };

    if (serviceID) {
      getUserTrnx();
    }
  }, [serviceID]);

  return (
    <>
      <main className="p-6 space-y-6">
        <Grid container spacing={4} sx={{ padding: 2 }}>
          <Grid item={true} xs={12}>
            {showServiceTrans && showServiceTrans.length > 0 ? (
              <ServiceWiseTnx
                setServiceID={setServiceID}
                setShowServiceTrans={setShowServiceTrans}
                showServiceTrans={showServiceTrans}
              />
            ) : (
              <DeptDashboard setServiceID={setServiceID} />
            )}
          </Grid>

          <Grid
            container
            // sx={{ background: "#FFF" }}
          ></Grid>
        </Grid>
      </main>
    </>
  );
};

export default DepartmentContainer;
