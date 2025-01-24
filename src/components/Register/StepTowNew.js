import {
	Backdrop,
	Box,
	Button,
	Checkbox,
	CircularProgress,
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

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CryptoJS from "crypto-js";
import api from "../../../utils/api";
import axios from "axios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Link from "next/link";
import Cookies from "js-cookie";

import InfoIcon from "@mui/icons-material/Info";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
	InfoCircleOutlined,
	UserOutlined,
	KeyOutlined,
} from "@ant-design/icons";
import NumericInput from "@/components/NumericInput";
import { Button as AntdButton } from "antd";
import { Checkbox as AntdCheckbox } from "antd";

import { Divider } from "antd";

import { Input, Space } from "antd";
import { CheckOutlined, SearchOffOutlined } from "@mui/icons-material";
import FloatInput from "../FloatLabel";
import { debounce } from "lodash";
import { encryptBody } from "../../../utils/globalEncryption";

const stylesCSS = {
	input: {
		"& input[type=number]": {
			MozAppearance: "textfield",
		},
		"& input[type=number]::-webkit-outer-spin-button": {
			WebkitAppearance: "none",
			margin: 0,
		},
		"& input[type=number]::-webkit-inner-spin-button": {
			WebkitAppearance: "none",
			margin: 0,
		},
	},
};

const StepTwoNew = ({
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
	setaadhaarFoundUser,
	aadhaarFoundUser,
	setPasswordType,
	passwordType,
	setssoUsername,
	ssoUsername,
	emailAsUsername,
	setEmailAsUsername,
	setUsernameValidated,
	usernameValidated,
	setUsernameError,
	setUserCalled,
	usernameError,
	userCalled,
	setDisableUsername,
	disableUsername,
	edistrictCheck,
	setEdistrictCheck,
	service_id,
	setSeconds,
	setMinutes,
	seteEnableOTP,
	enableOTP,
	minutes,
	seconds,
	setEmailMinutes,
	emailMinutes,
	emailSeconds,
	setEmailSeconds,
	enableEmailOTP,
	seteEnableEmailOTP,
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

	const [tempMobileOTP, setTempMobileOTP] = useState();

	const [tempEmailOTP, setTempEmailOTP] = useState();

	const [loading, setLoading] = useState(false);

	const [showOtpButton, setShowOtpButton] = useState(false);

	let user_info = "";
	let primary_list_to_be_sent = "";
	let secondary_list_to_be_sent = "";

	const handleLoaderClose = () => {
		setLoading(false);
	};

	let details = "";

	const [radioValue, setRadioValue] = useState("Yes");

	useEffect(() => {
		try {
			user_info = JSON.parse(Cookies.get("user_info"));

			if (user_info) {
				const { id, mobile, email, userName, userPassword } = user_info || {};
			}
		} catch (error) {}

		try {
			primary_list_to_be_sent = JSON.parse(Cookies.get("primary_user_array"));
			if (primary_list_to_be_sent.length > 0) {
				setMobile(primary_list_to_be_sent[0].mobileNo);
				setEmail(primary_list_to_be_sent[0].email);
			}
		} catch (error) {}

		try {
			secondary_list_to_be_sent = JSON.parse(
				Cookies.get("secondary_user_array")
			);
		} catch (error) {}
	}, []);

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
			return "Your password must be a minimum of 8 characters in length.";
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
		if (tempMobileOTP === otp) {
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
		if (tempEmailOTP === emailOtp) {
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

	const checkUserNameAvailable = async () => {
		setUserCalled(true);

		let reqData = {
			user_name: ssoUsername,
			service_id: service_id,
			edistrictCheck: disableUsername,
		};

		try {
			const usernameRegex =
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,16}$/;

			// const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9]{3,16}$/;

			// const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{3,16}$/;

			if (usernameRegex.test(ssoUsername)) {
				const response = await api.post("/check-username", { data: encryptBody(JSON.stringify(reqData)) });
				const { userNameFlag } = response.data || {};
				setUsernameValidated(!userNameFlag);
				setUserCalled(false);
				setUsernameError(false);
			} else {
				setUsernameError(true);
				// setAlert({ open: true, type: false, message: 'Please  Enter Correct Username' })
			}
		} catch (error) {}
	};

	//not used currently might be used in future
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

	const debounceCheckUserNameAvailability = debounce(
		checkUserNameAvailable,
		700
	);

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

			try {
				const response = await axios.post(
					process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-email-sms",
					{ data: encryptBody(JSON.stringify(reqData)) }
				);

				// const response = await api.post("sent-email-sms", reqData);

				if (response.status === 200) {
					setTempEmailOTP(sentOTP);
					setOtpEmailSent(true);
					setEmailVerifiedStep(1);
					setEmailOtp("");
					setLoading(false);
					setEmailMinutes(0);
					setEmailSeconds(30);
				} else {
				}
			} catch (error) {}
		} else {
			setLoading(false);
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct Email Address!",
			});
		}
	};

	const handleUsernameCheckChange = () => {
		if (emailAsUsername !== true) {
			setssoUsername(email ? email : "");
			checkUserNameAvailable();
		}
		if (emailAsUsername !== false) {
			setssoUsername("");
		}

		setUsernameValidated(false);
		setError(false);
		setUserCalled(true);
		setEmailAsUsername(!emailAsUsername);
		setUsernameError(false);
	};

	const sendOtp = async () => {
		const phoneNumberRegex = /^(?!0|1|2|3|4|5)\d{10}$/;
		setOtp("");
		if (!phoneNumberRegex.test(mobile)) {
			setAlert({
				open: true,
				type: false,
				message: "Please Enter valid 10 digit Mobile Number!",
			});
			return;
		}

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

			setLoading(true);

			try {
				const response = await axios.post(
					process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-mobile-sms",
					{ data: encryptBody(JSON.stringify(reqData)) }
				);

				if (response.status === 200) {
					seteEnableOTP(true);
					setTempMobileOTP(sentOTP);
					setMobileVerifiedStep(1);
					setOtpSent(true);
					setMinutes(0);
					setSeconds(30);
					setLoading(false);
				} else {
				}
			} catch (error) {
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
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
				onClick={handleLoaderClose}
			>
				<Box style={{ background: "#FFF", padding: 20, borderRadius: 10 }}>
					<CircularProgress color="primary" />
				</Box>
			</Backdrop>

			<Grid spacing={1} container>
				{/* <Grid item xs={12} >
                    <Typography textAlign={'center'} color={"#1876d1"} style={{ fontSize: 16 }}>Personal Details</Typography>
                    <Divider variant="middle" />
                </Grid> */}

				<Grid item xs={12} md={mobileVerified ? 12 : 12}>
					<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
						{"Enter Mobile Number"} {<span style={{ color: "red" }}>*</span>}
					</Typography>

					<Space.Compact style={{ width: "100%" }}>
						<NumericInput
							maxLength={10}
							value={mobile}
							disabled={mobileVerified ? true : false}
							size={"medium"}
							label={"Enter your Mobile Number"}
							onChange={(e) => {
								setMobile(e);
								setMobileVerified(false);
								if (e.length === 10) {
									setShowOtpButton(true);
								}

								if (e > 10) {
									setShowOtpButton(false);
									setOtpSent(false);
								} else {
									setMobile(e);
								}
							}}
						/>
						<AntdButton
							disabled={seconds <= 0 && !mobileVerified ? false : true}
							onClick={() => sendOtp()}
							type="primary"
						>
							Get OTP
						</AntdButton>
					</Space.Compact>

					{!mobileVerified && otpSent && (
						<Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
							<div className="countdown-text">
								{seconds > 0 || minutes > 0 ? (
									<Typography variant="body2">
										Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
										{seconds < 10 ? `0${seconds}` : seconds}
									</Typography>
								) : (
									<Typography variant="body2" component="body2">
										{" Didn't recieve code?"}
									</Typography>
								)}

								<button
									disabled={seconds > 0 || minutes > 0}
									style={{
										color: seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
									}}
									onClick={() => sendOtp()}
								>
									Resend OTP
								</button>
							</div>
						</Box>
					)}

					{otpSent && (
						<Space.Compact style={{ width: "100%", marginTop: 16 }}>
							<NumericInput
								maxLength={10}
								disabled={mobileVerified ? true : false}
								value={otp}
								size={"medium"}
								label={"Enter OTP"}
								onChange={(e) => {
									setOtp(e);
								}}
							/>
							<AntdButton
								onClick={() => (!otpSent ? sendOtp() : verifyMobile())}
								type="primary"
							>
								Verify OTP
							</AntdButton>
						</Space.Compact>
					)}

					{mobileVerified && (
						<Stack direction="row" spacing={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography
								color={"green"}
								style={{ fontSize: 12, marginLeft: 5 }}
							>
								{ssoId && aadhaarFoundUser?.mobile
									? "Mobile already verified"
									: "Mobile verified successfully"}{" "}
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

				{/* Email Address Section */}

				<Grid item xs={12} md={emailVerified ? 12 : 12}>
					<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
						{"Enter Email"}
						{" (Optional) "}
					</Typography>

					<Space.Compact style={{ width: "100%" }}>
						<Input
							placeholder="Enter your Email ID"
							size={"medium"}
							variant={"outlined"}
							value={email}
							disabled={emailVerified ? true : false}
							prefix={<UserOutlined className="site-form-item-icon" />}
							onChange={(e) => {
								const inputValue = e.target.value;
								setEmail(inputValue);
							}}
							allowClear
						/>

						<AntdButton
							disabled={emailSeconds <= 0 && !emailVerified ? false : true}
							onClick={() => sendEmailOtp()}
							type="primary"
						>
							Get OTP
						</AntdButton>
					</Space.Compact>

					{!emailVerified && otpEmailSent && (
						<Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
							<div className="countdown-text">
								{emailSeconds > 0 || minutes > 0 ? (
									<Typography variant="body2">
										Time Remaining:{" "}
										{emailMinutes < 10 ? `0${emailMinutes}` : emailMinutes}:
										{emailSeconds < 10 ? `0${emailSeconds}` : emailSeconds}
									</Typography>
								) : (
									<Typography variant="body2" component="body2">
										{" Didn't recieve code?"}
									</Typography>
								)}

								<button
									disabled={emailSeconds > 0 || emailMinutes > 0}
									style={{
										color:
											emailSeconds > 0 || emailMinutes > 0
												? "#DFE3E8"
												: "#FF5630",
									}}
									onClick={() => sendEmailOtp()}
								>
									Resend OTP
								</button>
							</div>
						</Box>
					)}

					{otpEmailSent && (
						<Space.Compact style={{ width: "100%", marginTop: 16 }}>
							<NumericInput
								maxLength={10}
								value={emailOtp}
								size={"medium"}
								label={"Enter OTP"}
								onChange={(e) => {
									setEmailOtp(e);
								}}
							/>
							<AntdButton onClick={() => verifyEmail()} type="primary">
								Verify OTP
							</AntdButton>
						</Space.Compact>
					)}

					{emailVerified && (
						<Stack direction="row" spacing={1}>
							<TaskAltIcon fontSize="small" color="success" />
							<Typography
								color={"green"}
								style={{ fontSize: 12, marginLeft: 5 }}
							>
								{ssoId && aadhaarFoundUser?.email
									? "Email already verified"
									: "Email verified successfully"}{" "}
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

				<Divider
					style={{
						marginLeft: 7,
						marginRight: 7,
						marginTop: 16,
						marginBottom: 10,
						borderWidth: 0.2,
						borderColor: "gray",
					}}
				/>

				{/* SSo Username */}

				{/* {emailVerified && !disableUsername && (
          <AntdCheckbox
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#1876d1",
              marginTop: 4,
            }}
            checked={emailAsUsername}
            onChange={() => handleUsernameCheckChange()}
          >
            Do you want to use email as Username?{" "}
          </AntdCheckbox>
        )} */}

				<Grid item xs={12}>
					<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
						{"Username"}{" "}
					</Typography>

					<Space.Compact style={{ width: "100%" }}>
						<Input
							placeholder="Create Username"
							size={"medium"}
							suffix={<CheckOutlined type="icon-name" />} // Replace "icon-name" with the name of your desired icon
							variant={"outlined"}
							style={{
								color: "green",
								backgroundColor: "rgba(0, 255, 0, 0.1)",
							}}
							value={ssoUsername}
							disabled={disableUsername ? true : false}
							// onBlur={() => checkUserNameAvailable()}
							prefix={<UserOutlined className="site-form-item-icon" />}
							onChange={(e) => {
								const inputValue = e.target.value;

								setssoUsername(inputValue);
								setUsernameError(false);
								setUserCalled(true);
								setUsernameValidated(false);
								// debounceCheckUserNameAvailability(inputValue);
							}}
							allowClear
						/>

						{/* <AntdButton onClick={() => checkUserNameAvailable()} type="primary">Check</AntdButton> */}
					</Space.Compact>

					{usernameError && (
						<Typography style={{ fontSize: 10, color: "red" }}>
							{" "}
							Username must be at least 3 to 100 character long and can contain
							only alphanumeric characters.
						</Typography>
					)}

					{/* {!usernameError && !userCalled && (
            <Typography
              style={{
                fontSize: 12,
                color: usernameValidated ? "green" : "red",
              }}
            >
              {`${ssoUsername}  ${usernameValidated ? "is" : " is not"}`}{" "}
              available
            </Typography>
          )} */}
				</Grid>

				<>
					<Divider
						dashed
						style={{
							marginLeft: 7,
							marginRight: 7,
							marginTop: 17,
							marginBottom: 0,
							borderWidth: 0.2,
							borderColor: "gray",
						}}
					/>

					<Grid item xs={12}>
						{umapArray.length > 0 && (
							<Typography
								style={{ fontSize: 12 }}
								mb={1}
								color={"#1876d1"}
								textAlign={"left"}
							>
								Please Reset / Re-Confirm your login Password{" "}
							</Typography>
						)}

						{umapArray.length === 0 && (
							<Typography
								style={{ fontSize: 12 }}
								mb={1}
								color={"#1876d1"}
								textAlign={"left"}
							>
								Please set your Password{" "}
							</Typography>
						)}

						<Space.Compact style={{ width: "100%" }}>
							<Input.Password
								// onFocus={() => checkUserNameAvailable()}
								placeholder="Enter password"
								size={"medium"}
								variant={"outlined"}
								prefix={<KeyOutlined className="site-form-item-icon" />}
								onChange={(e) => {
									const inputValue = e.target.value;
									if (!/[<>]/.test(inputValue)) {
										setPassword(inputValue);
									}
								}}
								iconRender={(showPassword) =>
									showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />
								}
							/>

							<Tooltip
								placement="top"
								title="Password must be at least 8 characters long and must be a combination of upper case, lower case, numbers and non-alphanumeric characters excluding space character."
							>
								<IconButton aria-label="delete" size="small">
									<InfoIcon fontSize="inherit" />
								</IconButton>
							</Tooltip>
						</Space.Compact>
					</Grid>

					<Grid item xs={12}>
						<Space.Compact style={{ width: "100%" }}>
							<Input.Password
								placeholder="Confirm password"
								size={"medium"}
								variant={"outlined"}
								prefix={<KeyOutlined className="site-form-item-icon" />}
								onChange={(e) => {
									const inputValue = e.target.value;
									if (!/[<>]/.test(inputValue)) {
										setPassword2(inputValue);
									}
								}}
								iconRender={(showPassword2) =>
									showPassword2 ? <EyeTwoTone /> : <EyeInvisibleOutlined />
								}
							/>

							<Tooltip
								placement="top"
								title="Password must be at least 8 characters long and must be a combination of upper case, lower case, numbers and non-alphanumeric characters excluding space character."
							>
								<IconButton aria-label="delete" size="small">
									<InfoIcon fontSize="inherit" />
								</IconButton>
							</Tooltip>
						</Space.Compact>
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
						I acknowledge and agree to abide by the{" "}
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
			</Grid>

			<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
				<Button onClick={handleBack} sx={{ mr: 1 }}>
					Back
				</Button>
				<Button onClick={() => finalSubmit()}>SUMBIT</Button>
			</Box>
		</StepContainer>
	);
};
export default StepTwoNew;
