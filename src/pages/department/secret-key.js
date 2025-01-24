import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import withDeptAuth from "../../../utils/withDeptAuth";
import Header from "@/components/UI/Header";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { FileCopy, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../../utils/api";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";

const SecretKey = () => {
  const [secretKey, setSecretKey] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const reqData = {
        uid: Cookies.get("uid"),
      };

      try {
        const response = await api.post("/user-details", { data: encryptBody(JSON.stringify(reqData)) });

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

                setSecretKey(data?.secret_key);


              } catch (e) {
                console.warn(e)
              }
            }



          }
        } else {
        }
      } catch (error) {}
    };

    getUserInfo();
  }, []);

  const [isCopySuccessful, setIsCopySuccessful] = useState(false);

  const inputRef = useRef(null);

  const handleCopyClick = () => {
    inputRef.current.select();

    try {
      document.execCommand("copy");
      setIsCopySuccessful(true);
    } catch (err) {
      setIsCopySuccessful(false);
      console.error("Unable to copy: ", err);
    }
  };

  return (
    <>
      <Header>
        <Container maxWidth="md" sx={{ marginTop: 5, position: "relative" }}>
          <Box component={Paper} p={3}>
            <Stack spacing={3}>
              <Typography variant="h5" mb={5}>
                Secret Key
              </Typography>

              <Typography variant="body2">
                Use this key in your application by passing it with the
                secret_key=secret_key parameter.
              </Typography>

              {secretKey && (
                <TextField
                  helperText={
                    isCopySuccessful && (
                      <Typography variant="body2" color={"#4CAF50"}>
                        Code Copied
                      </Typography>
                    )
                  }
                  inputRef={inputRef}
                  variant="outlined"
                  value={secretKey}
                  fullWidth
                  label="Your Secret Key"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyClick}>
                          <FileCopy />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Stack>
          </Box>
        </Container>
      </Header>
    </>
  );
};
export default withDeptAuth(SecretKey);
