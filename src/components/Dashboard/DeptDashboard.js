import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";

const DeptDashboard = ({ setServiceID }) => {
  const [transactions, setTransactions] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    const dept_user_id = Cookies.get("uid");

    const postData = {
      dept_user_id,
    };

    const getTransactions = async () => {
      try {
        const response = await api.post("/transaction-details", { data: encryptBody(JSON.stringify(postData)) });

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

                setTransactions(data)


              } catch (e) {
                console.warn(e)
              }
            }



          }
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else if (error?.response?.data) {
          dispatch(callAlert({ message: error.response.data, type: "FAILED" }));
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    getTransactions();
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: 2, position: "relative" }}>
      <Typography variant="h5" mb={3} mt={2}>
        Department Transaction Summary
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="Department Transaction Summary Table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Service ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Service Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Year
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Total Transactions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((row, intex) => (
                <TableRow
                  key={intex}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.service_id}
                  </TableCell>
                  <TableCell>{row.service_name}</TableCell>
                  <TableCell align="right">
                    {new Date(row.year).getFullYear()}
                  </TableCell>
                  <TableCell
                    onClick={() => setServiceID(row.service_id)}
                    align="right"
                  >
                    <Button variant="contained">{row.count}</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography color={"error"}>
                    Transactions not available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default DeptDashboard;
