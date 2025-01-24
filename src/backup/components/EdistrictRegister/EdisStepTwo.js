import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import StepContainer from "./StepContainer";
import { useEffect, useState } from "react";
import { CheckBox } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const StepTwo = ({
  handleBack,
  activeStep,
  setActiveStep,
  name,
  gender,
  dob,
  userName,
  password,
  password2,
  setUserName,
  setPassword,
  setPassword2,
  setAlert,
  user_namme,
  user_password,
}) => {
  const [passwordValue, setpasswordValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Choose wisely");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [radioValue, setRadioValue] = useState("");

  useEffect(() => {
    if (user_namme) {
      setUserName(user_namme);
    }
  }, []);

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };

  const handlePasswordTypeChange = (event) => {
    setpasswordValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  function isPasswordValid(password) {
    const lengthRegex = /.{8,}/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/;

    if (!lengthRegex.test(password)) {
      return "Password must be at least 8 characters long.";
    }

    if (!uppercaseRegex.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!lowercaseRegex.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!digitRegex.test(password)) {
      return "Password must contain at least one digit.";
    }

    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
    }

    return true;
  }

  function isPasswordMatching(password, password2) {
    if (password === password2) {
      return true;
    } else return "Password must match with the new password.";
  }

  function isUsernameValid(username) {
    // Check if the username is at least 3 characters long

    if (!user_namme) {
      const minLength = 3;

      if (username.length < minLength) {
        return `Username must be at least ${minLength} characters long.`;
      }

      // Check if the username contains only alphanumeric characters and underscores
      const usernameRegex = /^[a-zA-Z0-9_]+$/;

      if (!usernameRegex.test(username)) {
        return "Username can only contain letters, numbers, and underscores.";
      }

      // Additional custom criteria if needed

      return true;
    } else {
      return true;
    }
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const passwordHandler2 = (e) => {
    setPassword2(e.target.value);
  };

  const nextStepHandler = () => {
    const passCheck = isPasswordValid(password);

    const passMatchCheck = isPasswordMatching(password, password2);

    const userNameCheck = isUsernameValid(userName);
    if (userNameCheck !== true) {
      setAlert({ open: true, type: false, message: userNameCheck });
    } else if (passCheck !== true) {
      if (!user_password) {
        if (passCheck !== true) {
          setAlert({ open: true, type: false, message: passCheck });
        } else {
          setActiveStep(activeStep + 1);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    } else {
      if (!user_password) {
        if (passMatchCheck !== true) {
          setAlert({ open: true, type: false, message: passMatchCheck });
        } else {
          setActiveStep(activeStep + 1);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  return (
    <StepContainer>
      <Grid spacing={3} container>
        <Grid item xs={12} mb={2}>
          <Typography textAlign={"center"} color={"#1876d1"} variant="h6">
            Personal Details
          </Typography>
          <Divider variant="middle" />
        </Grid>

        <Grid item xs={6} mb={2}>
          <TextField
            size={"small"}
            fullWidth
            label="Enter Name"
            value={name}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} mb={2}>
          <TextField
            size={"small"}
            fullWidth
            label="Enter Gender"
            value={gender}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} mb={2}>
          <TextField
            size={"small"}
            fullWidth
            label="Enter DOB"
            value={dob}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={6} mb={2}>
          <TextField
            size={"small"}
            fullWidth
            label="Enter Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter Username"
            variant="outlined"
          />
        </Grid>

        {user_password && (
          <Grid item xs={12}>
            <FormControl error={error} variant="standard">
              <FormLabel
                style={{ color: "#0d6efd" }}
                id="demo-row-radio-buttons-group-label"
              >
                Do You want to create Account using Existing Password ?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleRadioChange}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}

        {!user_password && (
          <>
            <Grid item xs={6}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!/[<>]/.test(inputValue)) {
                    setPassword(inputValue);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"

                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setPassword(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl> */}
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                size="small"
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (!/[<>]/.test(inputValue)) {
                    setPassword2(inputValue);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        edge="end"
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <FormControl variant="outlined" sx={{ width: '100%' }}>

                                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"

                                    type={showPassword2 ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword2}
                                                onMouseDown={handleMouseDownPassword2}
                                                edge="end"
                                            >
                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"

                                    onChange={
                                        (e) => {
                                            const inputValue = e.target.value;
                                            if (!/[<>]/.test(inputValue)) {
                                                setPassword2(inputValue);
                                            }
                                        }
                                    }
                                />
                            </FormControl> */}
            </Grid>
          </>
        )}

        {user_password && radioValue === "No" && (
          <>
            <Grid item xs={6}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!/[<>]/.test(inputValue)) {
                      setPassword(inputValue);
                    }
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword2}
                        edge="end"
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!/[<>]/.test(inputValue)) {
                      setPassword2(inputValue);
                    }
                  }}
                />
              </FormControl>

              {/* <TextField size={"small"} type={"password"} fullWidth label="Confirm New Password" value={password2} onChange={passwordHandler2} placeholder="Enter Password" variant="outlined" /> */}
            </Grid>
          </>
        )}

        {!user_password && passwordValue === "No" && (
          <>
            <Grid item xs={6}>
              {/* <TextField type={"password"} fullWidth label="Create New Password" value={password} onChange={passwordHandler} placeholder="Enter Password" variant="outlined" /> */}
            </Grid>

            <Grid item xs={6}>
              {/* <TextField type={"password"} fullWidth label="Confirm New Password" value={password2} onChange={passwordHandler2} placeholder="Enter Password" variant="outlined" /> */}
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={nextStepHandler}>
          Next
        </Button>
      </Box>
    </StepContainer>
  );
};
export default StepTwo;
