import {
	Box,
	Container,
	Divider,
	Typography,
	Paper,
	Tab,
	Grid,
	useMediaQuery,
	Button,
	Card,
	Avatar,
	AppBar,
	Toolbar,
	Stack,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Snackbar,
	Alert,
	TextField,
	ListItemSecondaryAction,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserName from "../components/Login/UserName";
import MobileLogin from "../components/Login/MobileLogin";
import Link from "next/link";
import style from "../components/Login/Login.module.css";
import classNames from "classnames";
import {
	Login,
	RadioButtonChecked,
	RadioButtonUnchecked,
} from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "../components/Login/AadhaarLogin";
import ParichayLogin from "../components/Login/ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

import Tabs from "@mui/material/Tabs";
import { getImagePath } from "../../utils/CustomImagePath";
import HeaderUser from "@/components/UI/HeaderUser";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CommentIcon from "@mui/icons-material/Comment";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";

import { useRouter } from "next/router";
import api from "../../utils/api";
import CryptoJS from "crypto-js";
import axios from "axios";
import AlertModal from "@/components/AlertModal";
import { encryptBody } from "../../utils/globalEncryption";

const Root = styled("div")(({ theme }) => ({
	width: "100%",
	...theme.typography.body2,
	"& > :not(style) ~ :not(style)": {
		marginTop: theme.spacing(2),
	},
}));
const listItemStyle = {
	border: "1px solid transparent", // Initial border
	borderRadius: "4px", // Initial border radius
	transition: "border 0.3s ease-in-out", // Adding transition for a smooth effect
};

const handleHover = (event) => {
	event.currentTarget.style.border = "1px solid #2196f3"; // Change border on hover
	event.currentTarget.style.borderRadius = "4px"; // Add border-radius for a smoother look
};

const handleHoverExit = (event) => {
	event.currentTarget.style.border = "none"; // Remove border on hover exit
};

const Mapping = () => {
	const [value, setValue] = useState("1");
	const [valueMaster, setValueMaster] = useState("1");
	const [checked, setChecked] = useState([]);

	const [mobileChecked, setMobileChecked] = useState([]);

	const [selectedEmail, setselectedEmail] = useState("");

	const [selectedMobile, setseletedMobile] = useState("");

	const [email, setEmail] = useState([]);

	const [mobile, setMobile] = useState([]);

	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [userList, setuserList] = useState([]);

	const [otpSent, setOtpSent] = useState(false);
	const [otpEmailSent, setOtpEmailSent] = useState(false);

	const [otp, setOtp] = useState();

	const [emailOtp, setEmailOtp] = useState();

	const [tempOTP, setTempOTP] = useState();

	const [loading, setLoading] = useState(false);

	const [emailVerifiedStep, setEmailVerifiedStep] = useState(false);
	const [mobileVerifiedStep, setMobileVerifiedStep] = useState(false);

	const [mobileVerified, setMobileVerified] = useState(false);

	const [emailVerified, setEmailVerified] = useState();

	const router = useRouter();
	let service_id = router.query.service_id ? router.query.service_id : "";
	let users_list = router.query.users_list ? router.query.users_list : "";
	let user_name = router.query.user_name ? router.query.user_name : "";

	const handleSnackClose = () => setAlert({ open: false });
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

	const sendOtp = async () => {
		setLoading(true);

		if (isValidPhoneNumber(selectedMobile)) {
			const sentOTP = generateRandomOTP();

			const plaintextData = sentOTP;
			const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

			const encryptedData = CryptoJS.AES.encrypt(
				plaintextData,
				secretKey
			).toString();

			const reqData = {
				mobile: selectedMobile,
				tempID: encryptedData,
			};

			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-mobile-sms",
				{ data: encryptBody(JSON.stringify(reqData)) }
			);

			if (response.status === 200) {
				setTempOTP(sentOTP);
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

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeMaster = (event, newValue) => {
		setValueMaster(newValue);
	};

	const proceedforRegistration = () => {
		if (emailVerified && mobileVerified) {
			if (selectedMobile.length > 0) {
				if (selectedEmail.length > 0) {
					const peram = `?service_id=${service_id ? service_id : ""}&mobile=${
						selectedMobile ? selectedMobile : ""
					}&email=${selectedEmail}&is_iframe=${true}&users_list=${users_list}&mobile_verified=${mobileVerified}&email_verified=${emailVerified}`;
					router.push("/registration-iframe" + peram);
				} else {
					setAlert({
						open: true,
						type: false,
						message: "Please One Primary Email",
					});
				}
			} else {
				setAlert({
					open: true,
					type: false,
					message: "Please One Primary Mobile",
				});
			}
		} else {
			setAlert({
				open: true,
				type: false,
				message: "Please Select One Email and Mobile",
			});
		}

		// setValueMaster(newValue);
	};

	useEffect(() => {
		let users = [];

		if (users_list) {
			try {
				users = JSON.parse(users_list);

				if (users.length > 0) {
					let mobile_array = [];
					let email_array = [];

					for (let i = 0; i < users.length; i++) {
						if (mobile_array.length === 0) {
							mobile_array.push(users[i].mobileNo);
						} else if (mobile_array.length > 0) {
							const isInArray = mobile_array.includes(users[i].mobileNo);
							if (!isInArray) {
								mobile_array.push(users[i].mobileNo);
							}
						}
						// mobile_array.push(users[i].mobileNo);
						// email_array.push(users[i].email);

						if (email_array.length === 0) {
							email_array.push(users[i].email);
						} else if (email_array.length > 0) {
							const isInArray = email_array.includes(users[i].email);
							if (!isInArray) {
								email_array.push(users[i].email);
							}
						}
					}

					setEmail(email_array);
					setMobile(mobile_array);
				}
			} catch (e) {}

			setuserList(users);
		}
	}, [users_list]);

	const LoginParichay = () => {
		window.location.href =
			"https://sso.hp.gov.in/official/site/login?onboardingapp=himparivarsso";
	};

	const handleEmailChange = (event) => {
		setselectedEmail(event);
		setEmailVerified(false);
	};

	const handleRadioChange = (event) => {
		setseletedMobile(event);
		setMobileVerified(false);
	};

	const getIframe = (service_id, service_type) => {
		getIframeSSO(service_id, service_type);
	};

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleMobileToggle = (value) => () => {
		const currentIndex = mobileChecked.indexOf(value);
		const newChecked = [...mobileChecked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setMobileChecked(newChecked);
	};

	function isValidEmail(email) {
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		return emailPattern.test(email);
	}

	const sendEmailOtp = async () => {
		setLoading(true);

		if (isValidEmail(selectedEmail)) {
			const sentOTP = generateRandomOTP();

			const plaintextData = sentOTP;
			const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

			const encryptedData = CryptoJS.AES.encrypt(
				plaintextData,
				secretKey
			).toString();

			const reqData = {
				userName: selectedEmail,
				tempID: encryptedData,
			};

			const response = await axios.post(
				process.env.NEXT_PUBLIC_API_BASE_URL + "/sent-email-sms",
				{ data: encryptBody(JSON.stringify(reqData)) }
			);

			// const response = await api.post("sent-email-sms", reqData);

			if (response.status === 200) {
				setTempOTP(sentOTP);
				setEmailOtp(sentOTP);
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

	// const getIframe = (service_id, service_type) => {
	//     getIframeSSO(service_id, service_type)

	// }

	return (
		<>
			{/* <HeaderUser /> */}

			<Box className={style.fullbg}></Box>
			<Container sx={{ marginTop: 6, marginBottom: 6, position: "relative" }}>
				<Box className={style.backdrop} />

				<Grid
					container
					justifyContent="center" // Centers horizontally
					alignItems="center" // Centers vertically
				>
					<Paper
						sx={{
							borderBottom: "5px solid #1876D0",
							borderTop: "5px solid #1876D0",
						}}
						elevation={20}
						style={{
							display: "flex",
							borderRadius: 10,
							width: 400,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Grid
							container
							style={{
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Grid
								container
								alignItems="center"
								justifyContent="center"
								spacing={1}
								style={{ marginTop: 1 }}
							>
								<Grid item>
									<Image
										src="/Himachal_Pradesh.png"
										width="45"
										height="30"
										alt="Himachal Pradesh Logo"
									/>
								</Grid>
								<Grid item>
									<Typography
										textAlign={"center"}
										style={{
											color: "#015788",
											marginTop: 10,
											fontWeight: 500,
											fontSize: 18,
										}}
									>
										Him Access
									</Typography>
								</Grid>
							</Grid>

							<Grid container spacing={1} style={{}}>
								<Grid item ml={3} mt={2}>
									{/* <Typography style={{ color: "#015788", marginTop: 10, fontWeight: 500, fontSize: 12 }} >Multiple Accounts Detected: Link/Merge Confirmation
                                             </Typography> */}
									<Typography
										textAlign={"flex-start"}
										style={{
											color: "#015788",
											marginTop: 10,
											fontWeight: 500,
											fontSize: 12,
										}}
									>
										Dear{" "}
										<span style={{ color: "green", fontWeight: 700 }}>
											{user_name}
										</span>
									</Typography>
								</Grid>
								<Grid item></Grid>
							</Grid>

							<Typography
								ml={3}
								mr={3}
								style={{ marginTop: 10, fontWeight: 500, fontSize: 12 }}
							>
								We are excited to welcome you to our new and improved portal! As
								part of our commitment to providing you with the best
								experience, we encourage you to update your profile information
								and verify your mobile and email IDs.
							</Typography>

							{/* <Typography textAign={"center"} style={{ color: "#015788", marginTop: 10, fontWeight: 500, fontSize: 14 }} >Please Validate your Primary Accounts</Typography> */}

							{/*
                                   <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
                                        {email && email.map((value) => {
                                             const labelId = `checkbox-list-label-${value}`;

                                             return (
                                                  <ListItem
                                                       key={value}

                                                       style={listItemStyle}
                                                       onMouseEnter={handleHover}
                                                       onMouseLeave={handleHoverExit}

                                                       // secondaryAction={
                                                       //      <IconButton edge="end" aria-label="comments">
                                                       //           <CommentIcon />
                                                       //      </IconButton>
                                                       // }
                                                       disablePadding
                                                  >
                                                       <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                                            <ListItemIcon>
                                                                 <Checkbox
                                                                      edge="start"
                                                                      checked={checked.indexOf(value) !== -1}
                                                                      tabIndex={-1}
                                                                      disableRipple
                                                                      inputProps={{ 'aria-labelledby': labelId }}
                                                                 />
                                                            </ListItemIcon>
                                                            <Stack direction="column" spacing={1} alignItems="flex-start" >

                                                                 <Stack direction="row" spacing={1} alignItems="flex-start" >
                                                                      <EmailIcon color="success" />
                                                                      <ListItemText id={labelId} primary={value} />

                                                                 </Stack>


                                                            </Stack>


                                                       </ListItemButton>
                                                  </ListItem>
                                             );
                                        })}
                                   </List> */}

							<Stack
								mt={2}
								spacing={1}
								style={{
									display: "flex",
									flex: 1,
									marginLeft: 20,
									marginRight: 20,
								}}
							>
								<Typography
									style={{
										color: "#015788",
										marginTop: 10,
										fontWeight: 700,
										fontSize: 12,
									}}
								>
									Select your Primary Email ID:
								</Typography>

								<List fullWidth>
									{email.map((value, index) => (
										<>
											<ListItem
												onClick={() => handleEmailChange(value)}
												disableGutters
												fullWidth
												key={index}
												button
											>
												<ListItemIcon>
													<Radio
														checked={selectedEmail === value}
														onChange={() => handleEmailChange(value)}
														value={value}
														name="radio-button-demo"
													/>
												</ListItemIcon>
												<ListItemText
													primaryTypographyProps={{
														style: { fontSize: "12px" },
													}}
													primary={value}
													secondary={
														<>
															{selectedEmail === value && emailVerified && (
																<Stack direction="row" spacing={1}>
																	<TaskAltIcon
																		fontSize="small"
																		color="success"
																	/>
																	<Typography
																		color={"green"}
																		style={{ fontSize: 12, marginLeft: 5 }}
																	>
																		Email verified successfully
																	</Typography>
																</Stack>
															)}

															{selectedEmail === value &&
																!emailVerified &&
																otpEmailSent && (
																	<Stack direction="row" spacing={1} mt={1}>
																		<TaskAltIcon
																			fontSize="small"
																			color="success"
																		/>
																		<Typography
																			color={"red"}
																			style={{ fontSize: 12, marginLeft: 5 }}
																		>
																			Email sent successfully
																		</Typography>
																	</Stack>
																)}
														</>
													}
												/>
												{selectedEmail === value && (
													<ListItemSecondaryAction>
														<Button
															onClick={() => sendEmailOtp()}
															style={{ fontSize: "0.7rem", padding: "2px 4px" }}
															size="small"
															variant="contained"
														>
															Get OTP
														</Button>
													</ListItemSecondaryAction>
												)}
											</ListItem>

											{otpEmailSent && selectedEmail === value && (
												<>
													<Grid container>
														<Grid item md={6} xs={5} ml={1}>
															<TextField
																inputProps={{ maxLength: 6 }}
																size="small"
																type="number"
																fullWidth
																label="Enter OTP"
																value={emailOtp}
																placeholder="Enter OTP"
																variant="outlined"
																onChange={(e) => {
																	if (e.target.value.length <= 6) {
																		setEmailOtp(e.target.value);
																	}
																}}
															/>
														</Grid>

														<Grid item md={6} xs={6}>
															<Stack
																direction="row"
																spacing={2}
																mt={0.5}
																ml={5}
															>
																<Button
																	fullWidth
																	style={{
																		fontSize: "0.7rem",
																		padding: "2px 4px",
																	}}
																	variant="contained"
																	color="success"
																	onClick={() => verifyEmail()}
																>
																	{otpEmailSent ? "Verify" : "Get OTP"}
																</Button>

																<Button
																	fullWidth
																	variant="contained"
																	color="error"
																	style={{
																		fontSize: "0.7rem",
																		padding: "2px 4px",
																	}}
																	onClick={() => {
																		setOtpEmailSent(false);
																		setEmailOtp(false);
																		// setMobile("")
																		setTempOTP("");
																		setEmailVerified(false);
																	}}
																>
																	{"Cancel"}
																</Button>
															</Stack>
														</Grid>
													</Grid>
												</>
											)}
										</>
									))}
								</List>
							</Stack>

							<Stack
								mt={2}
								spacing={1}
								style={{
									display: "flex",
									flex: 1,
									marginLeft: 20,
									marginRight: 20,
								}}
							>
								<Typography
									style={{
										color: "#015788",
										marginTop: 10,
										fontWeight: 700,
										fontSize: 12,
									}}
								>
									Select your Primary Mobile Number:
								</Typography>

								<List fullWidth>
									{mobile.map((value, index) => (
										<>
											<ListItem
												onClick={() => handleRadioChange(value)}
												disableGutters
												fullWidth
												key={index}
												button
											>
												<ListItemIcon>
													<Radio
														checked={selectedMobile === value}
														onChange={() => handleRadioChange(value)}
														value={value}
														name="radio-button-demo"
													/>
												</ListItemIcon>
												<ListItemText
													primaryTypographyProps={{
														style: { fontSize: "12px" },
													}}
													primary={value}
													secondary={
														<>
															{selectedMobile === value && mobileVerified && (
																<Stack direction="row" spacing={1}>
																	<TaskAltIcon
																		fontSize="small"
																		color="success"
																	/>
																	<Typography
																		color={"green"}
																		style={{ fontSize: 12, marginLeft: 5 }}
																	>
																		Mobile verified successfully
																	</Typography>
																</Stack>
															)}

															{selectedMobile === value &&
																!mobileVerified &&
																otpSent && (
																	<Stack direction="row" spacing={1} mt={1}>
																		<TaskAltIcon
																			fontSize="small"
																			color="success"
																		/>
																		<Typography
																			color={"red"}
																			style={{ fontSize: 12, marginLeft: 5 }}
																		>
																			OTP sent successfully
																		</Typography>
																	</Stack>
																)}
														</>
													}
												/>
												{selectedMobile === value && (
													<ListItemSecondaryAction>
														<Button
															onClick={() => sendOtp()}
															style={{ fontSize: "0.7rem", padding: "2px 4px" }}
															size="small"
															variant="contained"
														>
															Get OTP
														</Button>
													</ListItemSecondaryAction>
												)}
											</ListItem>

											{otpSent && selectedMobile === value && (
												<>
													<Grid container>
														<Grid item md={6} xs={5} ml={1}>
															<TextField
																inputProps={{ maxLength: 6 }}
																size="small"
																type="number"
																fullWidth
																label="Enter OTP"
																value={otp}
																placeholder="Enter OTP"
																variant="outlined"
																onChange={(e) => {
																	if (e.target.value.length <= 6) {
																		setOtp(e.target.value);
																	}
																}}
															/>
														</Grid>

														<Grid item md={6} xs={6}>
															<Stack
																direction="row"
																spacing={2}
																mt={0.5}
																ml={5}
															>
																<Button
																	fullWidth
																	style={{
																		fontSize: "0.7rem",
																		padding: "2px 4px",
																	}}
																	variant="contained"
																	color="success"
																	onClick={() => verifyMobile()}
																>
																	{otpSent ? "Verify" : "Get OTP"}
																</Button>

																<Button
																	fullWidth
																	variant="contained"
																	color="error"
																	style={{
																		fontSize: "0.7rem",
																		padding: "2px 4px",
																	}}
																	onClick={() => {
																		setOtpSent(false);
																		// setMobile("")
																		setTempOTP("");
																		setMobileVerified(false);
																	}}
																>
																	{"Cancel"}
																</Button>
															</Stack>
														</Grid>
													</Grid>
												</>
											)}
										</>
									))}
								</List>
							</Stack>

							<Grid
								container
								spacing={0}
								justifyContent={"flex-end"}
								mb={2}
								mt={2}
								mr={2}
							>
								<Button
									style={{ marginRight: 10 }}
									onClick={() => router.back()}
									variant="text"
								>
									Back
								</Button>

								<Button
									onClick={() => proceedforRegistration()}
									variant="contained"
								>
									Next
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				{alert.message && (
					<AlertModal alert={alert} handleClose={handleSnackClose} />
				)}
			</Container>
			{/* <AppBar style={{ height: 40, background: "#015788" }} position="fixed" sx={{ top: 'auto', bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                         <Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={2} >
                              Site designed, developed & hosted by Department of Digital Technologies & Governance, Himachal Pradesh
                         </Typography>
                    </Toolbar>
               </AppBar> */}
		</>
	);
};
export default Mapping;
