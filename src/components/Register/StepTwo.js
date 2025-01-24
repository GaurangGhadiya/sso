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
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import StepContainer from "./StepContainer";
import { useEffect, useState } from "react";
import { Check, CheckBox } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CryptoJS from "crypto-js";
import api from "../../../utils/api";
import axios from "axios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Link from "next/link";
import { encryptBody } from "../../../utils/globalEncryption";

const StepTwo = ({
	email,
	setEmail,
	emailVerifiedStep,
	setEmailVerifiedStep,
	mobileVerifiedStep,
	setMobileVerifiedStep,
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
	mobile,
	setMobile,
	mobileVerified,
	setMobileVerified,
	emailVerified,
	setEmailVerified,
	finalSubmit,
	setConsent,
	consent,
	primaryUserDetail,
	umapArray,
	ssoId,
	setSsoId,
}) => {
	const [passwordValue, setpasswordValue] = useState("");
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState("Choose wisely");
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otpEmailSent, setOtpEmailSent] = useState(false);

	const [term, setTerm] = useState(false);

	const [otp, setOtp] = useState();

	const [emailOtp, setEmailOtp] = useState();

	const [tempOTP, setTempOTP] = useState();
	const [loading, setLoading] = useState(false);

	const [showOtpButton, setShowOtpButton] = useState(false);

	const [radioValue, setRadioValue] = useState("");

	useEffect(() => {}, []);

	const handleRadioChange = (event) => {
		setRadioValue(event.target.value);
		setHelperText(" ");
		setError(false);
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

	const handleCheckboxChange = (event) => {
		setConsent(event.target.checked);
		// Do something with the checked value if needed
	};

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

	const verifyMobile = () => {
		if (tempOTP === otp) {
			setTimeout(() => {
				setMobileVerified(true);
				setOtpSent(false);
				setMobileVerifiedStep(2);

				setLoading(false);
			}, 1000);
		} else {
			setLoading(false);
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct OTP!",
			});
		}
	};

	const verifyEmail = () => {
		if (tempOTP === emailOtp) {
			setTimeout(() => {
				setEmailVerified(true);
				setOtpEmailSent(false);
				setEmailVerifiedStep(2);
				setEmailOtp("");

				setLoading(false);
			}, 1000);
		} else {
			setLoading(false);
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct OTP!",
			});
		}
	};

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

	function isValidPhoneNumber(phoneNumber) {
		const phonePattern = /^\d{10}$/;

		return phonePattern.test(phoneNumber);
	}

	function generateRandomOTP() {
		let otp = "";
		for (let i = 0; i < 5; i++) {
			const digit = Math.floor(Math.random() * 9) + 1; // Generate a random number between 1 and 9
			otp += digit;
		}
		return otp;
	}

	function isValidEmail(email) {
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		return emailPattern.test(email);
	}

	const sendEmailOtp = async () => {
		setLoading(true);

		if (isValidEmail(email)) {
			const sentOTP = generateRandomOTP();

			const plaintextData = sentOTP;
			const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

			const encryptedData = CryptoJS.AES.encrypt(
				plaintextData,
				secretKey
			).toString();

			const reqData = {
				userName: email,
				tempID: encryptedData,
			};

			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-email-sms",
				{ data: encryptBody(JSON.stringify(reqData)) }
			);

			// const response = await api.post("sent-email-sms", reqData);

			if (response.status === 200) {
				setTempOTP(sentOTP);
				setOtpEmailSent(true);
				setEmailVerifiedStep(1);
				setEmailOtp("");
				setLoading(false);
			}
		} else {
			setLoading(false);
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct Email Address!",
			});
		}
	};

	const sendOtp = async () => {
		setLoading(true);

		if (isValidPhoneNumber(mobile)) {
			const sentOTP = generateRandomOTP();

			const plaintextData = sentOTP;
			const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

			const encryptedData = CryptoJS.AES.encrypt(
				plaintextData,
				secretKey
			).toString();

			const reqData = {
				mobile: mobile,
				tempID: encryptedData,
			};

			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-mobile-sms",
				{ data: encryptBody(JSON.stringify(reqData)) }
			);

			if (response.status === 200) {
				setTempOTP(sentOTP);
				setMobileVerifiedStep(1);
				setOtpSent(true);

				setLoading(false);
			}
		} else {
			setLoading(false);
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct Mobile Number!",
			});
		}
	};

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
			<Grid spacing={2} container>
				{/* <Grid item xs={12} >
                    <Typography textAlign={'center'} color={"#1876d1"} style={{ fontSize: 16 }}>Personal Details</Typography>
                    <Divider variant="middle" />
                </Grid> */}

				<Grid item xs={12} md={mobileVerified ? 12 : 8}>
					<TextField
						disabled={mobileVerified ? true : false}
						size="small"
						type="number"
						fullWidth
						label="Mobile Number "
						required
						value={mobile}
						placeholder="Enter Mobile Number"
						variant="outlined"
						onChange={(e) => {
							setMobile(e.target.value);
							if (e.target.value.length === 10) {
								setShowOtpButton(true);
							}

							if (e.target.value > 10) {
								setShowOtpButton(false);
								setOtpSent(false);
							} else {
								setMobile(e.target.value);
							}
						}}
					/>

					{mobileVerified && (
						<Stack direction="row" spacing={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography
								color={"green"}
								style={{ fontSize: 12, marginLeft: 5 }}
							>
								{ssoId
									? "Mobile already Verified"
									: "Mobile is verified successfully"}{" "}
							</Typography>
						</Stack>
					)}

					{!mobileVerified && otpSent && (
						<Stack direction="row" spacing={1} mt={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography color={"red"} style={{ fontSize: 12, marginLeft: 5 }}>
								OTP sent successfully
							</Typography>
						</Stack>
					)}
				</Grid>

				<Grid item xs={12} md={mobileVerified ? 0 : 4}>
					{!mobileVerified && (
						<Button
							fullWidth
							style={{ fontSize: "0.8rem", padding: "2px 8px" }}
							variant="contained"
							color="primary"
							onClick={() => sendOtp()}
						>
							{"Get OTP"}
						</Button>
					)}

					{/* {emailVerified && <Button
                        fullWidth
                        style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOtpEmailSent(false);
                            setEmail("")
                            setTempOTP("")
                            setEmailVerified(false)
                            setEmailOtp("")
                        }}
                    >
                        {"Cancel"}
                    </Button>} */}
				</Grid>

				{otpSent && (
					<>
						<Grid item xs={4.5} md={6} mb={2}>
							<TextField
								size="small"
								type="number"
								fullWidth
								label="Enter OTP"
								value={otp}
								placeholder="Enter OTP"
								variant="outlined"
								onChange={(e) => setOtp(e.target.value)}
							/>
						</Grid>

						<Grid item xs={7} md={6}>
							<Stack
								direction="row"
								spacing={1}
								mt={0.5}
								justifyContent={"right"}
								alignContent={"right"}
							>
								{mobileVerified ? null : (
									<Button
										fullWidth
										style={{ fontSize: "0.7rem", padding: "4px 8px" }}
										variant="contained"
										color="success"
										onClick={() => (!otpSent ? sendOtp() : verifyMobile())}
									>
										{otpSent ? "Verify" : "Get OTP"}
									</Button>
								)}

								{!mobileVerified && !otpSent ? null : (
									<Button
										fullWidth
										variant="contained"
										color="error"
										style={{ fontSize: "0.8rem", padding: "2px 8px" }}
										onClick={() => {
											setOtpSent(false);

											setTempOTP("");
											setMobileVerified(false);
										}}
									>
										{"Cancel"}
									</Button>
								)}
							</Stack>
						</Grid>
					</>
				)}

				{/* Email Address Section */}

				<Grid item xs={12} md={emailVerified ? 12 : 8}>
					<TextField
						disabled={emailVerified ? true : false}
						size="small"
						fullWidth
						label="Email ID (Optional)"
						value={email}
						placeholder="Enter Email ID"
						variant="outlined"
						onChange={(e) => {
							setEmail(e.target.value);
							if (e.target.value.length === 10) {
								setShowOtpButton(true);
							}

							if (e.target.value > 10) {
								setShowOtpButton(false);
								setOtpEmailSent(false);
							} else {
								setEmail(e.target.value);
							}
						}}
					/>

					{emailVerified && (
						<Stack direction="row" spacing={1} mt={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography
								color={"green"}
								style={{ fontSize: 12, marginLeft: 5 }}
							>
								{" "}
								Email verified successfully
							</Typography>
						</Stack>
					)}

					{!emailVerified && otpEmailSent && (
						<Stack direction="row" spacing={1} mt={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography color={"red"} style={{ fontSize: 12, marginLeft: 5 }}>
								OTP sent successfully
							</Typography>
						</Stack>
					)}
				</Grid>

				<Grid item xs={12} md={4}>
					{!emailVerified && (
						<Button
							fullWidth
							style={{ fontSize: "0.8rem", padding: "2px 8px" }}
							variant="contained"
							color="primary"
							onClick={() => (!otpEmailSent ? sendEmailOtp() : verifyEmail())}
						>
							{"Get OTP"}
						</Button>
					)}

					{/* {emailVerified && <Button
                        fullWidth
                        style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOtpEmailSent(false);
                            setEmail("")
                            setTempOTP("")
                            setEmailVerified(false)
                            setEmailOtp("")
                        }}
                    >
                        {"Cancel"}
                    </Button>} */}
				</Grid>

				{otpEmailSent && (
					<>
						<Grid item xs={4.5} md={6} mb={2}>
							<TextField
								size="small"
								type="number"
								fullWidth
								label="Enter OTP"
								value={emailOtp}
								placeholder="Enter OTP"
								variant="outlined"
								onChange={(e) => setEmailOtp(e.target.value)}
							/>
						</Grid>

						<Grid item xs={7} md={6}>
							<Stack
								direction="row"
								spacing={1}
								mt={0.5}
								justifyContent={"right"}
								alignContent={"right"}
							>
								{emailVerified ? null : (
									<Button
										fullWidth
										style={{ fontSize: "0.7rem", padding: "4px 8px" }}
										variant="contained"
										color="success"
										onClick={() =>
											!otpEmailSent ? sendEmailOtp() : verifyEmail()
										}
									>
										{otpEmailSent ? "Verify" : "Get OTP"}
									</Button>
								)}

								{!emailVerified && !otpEmailSent ? null : (
									<Button
										fullWidth
										variant="contained"
										color="error"
										style={{ fontSize: "0.8rem", padding: "2px 8px" }}
										onClick={() => {
											setOtpEmailSent(false);
											setEmail("");
											setTempOTP("");
											setEmailOtp("");
											setEmailVerified(false);
										}}
									>
										{"Cancel"}
									</Button>
								)}
							</Stack>
						</Grid>
					</>
				)}

				{ssoId && (
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

				{ssoId && radioValue === "No" && (
					<>
						<Grid item xs={12}>
							<Typography
								style={{ fontSize: 12 }}
								mb={2}
								color={"error"}
								textAlign={"center"}
							>
								Please Reset / Re-Confirm your login Password{" "}
							</Typography>

							<TextField
								label="Password"
								variant="outlined"
								fullWidth
								size="small"
								type={showPassword ? "text" : "password"}
								value={password}
								helperText={
									error ? "Password must be 8-32 characters long" : ""
								}
								onChange={(e) => {
									const inputValue = e.target.value;
									setPassword(inputValue);
									setError(!/^.{8,32}$/.test(inputValue));
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
						</Grid>

						<Grid item xs={12}>
							<TextField
								label="Confirm Password"
								variant="outlined"
								fullWidth
								size="small"
								helperText={
									error ? "Password must be 8-32 characters long" : ""
								}
								type={showPassword2 ? "text" : "password"}
								value={password2}
								onChange={(e) => {
									const inputValue = e.target.value;

									setPassword2(inputValue);
									setError(!/^.{8,32}$/.test(inputValue));

									// if (!/[<>]/.test(inputValue)) {
									//     setPassword2(inputValue);
									// }
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
						</Grid>
					</>
				)}

				<>
					<Grid item xs={12}>
						<Typography
							style={{ fontSize: 12 }}
							mb={2}
							color={"error"}
							textAlign={"center"}
						>
							Please Reset / Re-Confirm your login Password{" "}
						</Typography>

						<TextField
							label="Password"
							variant="outlined"
							fullWidth
							size="small"
							type={showPassword ? "text" : "password"}
							value={password}
							helperText={error ? "Password must be 8-32 characters long" : ""}
							onChange={(e) => {
								const inputValue = e.target.value;
								setPassword(inputValue);
								setError(!/^.{8,32}$/.test(inputValue));
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
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="Confirm Password"
							variant="outlined"
							fullWidth
							size="small"
							helperText={error ? "Password must be 8-32 characters long" : ""}
							type={showPassword2 ? "text" : "password"}
							value={password2}
							onChange={(e) => {
								const inputValue = e.target.value;

								setPassword2(inputValue);
								setError(!/^.{8,32}$/.test(inputValue));

								// if (!/[<>]/.test(inputValue)) {
								//     setPassword2(inputValue);
								// }
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
					</Grid>
				</>

				<Stack direction="row" spacing={0} alignItems="flex-start">
					<Checkbox
						style={{ marginTop: 8 }}
						checked={consent}
						onChange={handleCheckboxChange}
						defaultChecked
					/>
					{/* <Typography mt={2} style={{ flex: 1, fontSize: 12, textAlign: 'justify' }}>I,
                    </Typography> */}

					{/* I, the holder of above given Aadhaar number(VID), hereby give my consent to HP Him Access to obtain my Aadhaar number(VID), */}

					<Typography
						mt={2}
						style={{ flex: 1, fontSize: 12, textAlign: "justify" }}
						variant="body1"
					>
						I, accept the General{" "}
						<Link href="/terms" target="_blank" rel="noopener noreferrer">
							Terms and Conditions
						</Link>{" "}
						of Use and{" "}
						<Link href="/privacy" target="_blank" rel="noopener noreferrer">
							Privacy Policy
						</Link>
						.
					</Typography>
				</Stack>

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
				<Button onClick={() => finalSubmit()}>SUBMIT</Button>
			</Box>
		</StepContainer>
	);
};
export default StepTwo;
