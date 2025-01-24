import { Grid, Typography, TextField, Paper, Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const BasicInfo = ({ activeStep, setActiveStep, basicInfo, setBasicInfo }) => {
  const username = useRef();
  const password = useRef();
  const department = useRef();
  const personalMessage = useRef();

  const [error, setError] = useState({});

  const changeHandler = () => {
    setBasicInfo({
      username: username.current.value,
      password: password.current.value,
      department: department.current.value,
      personalMessage: personalMessage.current.value,
    });
  };

  const nextHandler = () => {
    const newError = {
      username: username.current.value.length < 1,
      password: password.current.value.length < 1,
      department: department.current.value.length < 1,
      personalMessage: personalMessage.current.value.length < 1,
    };

    setError(newError);

    if (Object.values(newError).every((value) => value !== true)) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <Paper elevation={1} style={{ padding: "16px", marginTop: "30px" }}>
      <Grid spacing={3} container>
        <Grid item xs={12}>
          <Typography textAlign={"center"} variant="h5">
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={error.username && true}
            onChange={changeHandler}
            value={basicInfo.username}
            inputRef={username}
            fullWidth
            label="Usename"
            placeholder="Usename"
            variant="standard"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={error.password && true}
            onChange={changeHandler}
            value={basicInfo.password}
            inputRef={password}
            fullWidth
            label="Password"
            placeholder="Password"
            variant="standard"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={error.department && true}
            onChange={changeHandler}
            value={basicInfo.department}
            inputRef={department}
            fullWidth
            label="Department"
            placeholder="Department"
            variant="standard"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={error.personalMessage && true}
            onChange={changeHandler}
            value={basicInfo.personalMessage}
            inputRef={personalMessage}
            fullWidth
            label="Personal Message"
            placeholder="Personal Message"
            variant="standard"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          color="primary"
          onClick={nextHandler}
        >
          Next
        </Button>
      </Box>
    </Paper>

    // <p>
    // </p>
  );
};
export default BasicInfo;
