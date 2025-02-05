import withAuth from "../../utils/withAuth";
import HeaderUser from "@/components/UI/HeaderUser";
import AllServices from "@/components/Dashboard/User/AllServices";
import Layout from "@/components/Dashboard/layout";
import Container from "@/components/Dashboard/Container";
import {
	Backdrop,
	Box,
	CircularProgress,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Cookies from "js-cookie";
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import { Button, DatePicker } from "antd";
import NumericInput from "@/components/NumericInput";
import { callAlert } from "../../redux/actions/alert";
import { getImagePath } from "../../utils/CustomImagePath";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import dayjs from "dayjs";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import AlertModal from "@/components/AlertModal";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../utils/globalEncryption";

const Img = styled("img")({
	margin: "auto",
	display: "block",
	maxWidth: "100%",
	maxHeight: "100%",
});

const Profile = () => {
	const [profileDetails, setProfileDetails] = useState({});
	const [address, setAddress] = useState("");

	const [name, setname] = useState("");

	const [aadhaarNumber, setAadhaarNumber] = useState("");
	const [citizenDetails, setCitizenDetails] = useState({});

	const [aadhaarDetails, setAadhaarDetails] = useState({});

	const [otp, setOTP] = useState("");

	const [dob, setdob] = useState("");

	const [noChanges, setNoChanges] = useState(false);

	const [aadhaardob, setaadhaardob] = useState("");

	const [email, setemail] = useState("");
	const [gender, setgender] = useState("");
	const [mobile, setmobile] = useState("");
	const [state, setstate] = useState("");
	const [userName, setuserName] = useState("");
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(59);

	const [disableOtp, setdisableOtp] = useState(false);

	const [pin, setPin] = useState("");
	const [vtc, setvtc] = useState("");

	const [errors, setErrors] = useState({});

	const [OtpSent, setOtpSent] = useState(false);

	const [loading, setLoading] = useState(false);

	const [co, setco] = useState("");
	const [tnxID, setTnxID] = useState();

	const [distt, setdist] = useState("");

	const [VaultId, setVaultId] = useState("");

	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [AadhaarName, setAadhaarName] = useState("");
	const [Aadhaargender, setAadhaarGender] = useState("");
	const [Aadhaardob, setAadhaarDob] = useState("");

	const [AadhaarDobVerify, setdobVerify] = useState(false);

	const [rowsList, setRowsList] = useState([]);

	const uid = Cookies.get("uid");

	const handleChange = (event) => {
		setgender(event.target.value);
	};

	function createData(label, oldData, newData) {
		return { label, oldData, newData };
	}

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setAlert({ open: false, type: false, message: null });
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}

			if (seconds === 0) {
				if (minutes === 0) {
					setdisableOtp(false);
					clearInterval(interval);
				} else {
					setSeconds(59);
					setMinutes(minutes - 1);
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [seconds]);

	async function sendAadhaarOTP() {
		if (aadhaarNumber.length > 11) {
			setLoading(true);
			const dataToSend = {
				aadhaarNumber: aadhaarNumber,
			};

			fetch(getImagePath("/api/aadhaar-otp"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify the content type as JSON
				},
				body: JSON.stringify(dataToSend), // Convert the data to JSON format
			})
				.then((response) => {
					setLoading(false);

					setMinutes(0);
					setSeconds(59);

					setdisableOtp(true);

					if (response.status === 500) {
						// dispatch(
						//   setAlert({
						//     open: true,
						//     type: false,
						//     message: "Unable to send OTP. Please try again.",
						//   })
						// );

						setAlert({
							open: true,
							type: false,
							message: "Unable to send OTP. Please try again.",
						});

						return;
					}

					if (!response.ok) {
						// throw new Error("Failed to post data");
					}
					return response.json();
				})
				.then((data) => {
					if (data) {
						setTnxID(data);
						setOtpSent(true);
						setAadhaarDetails("");
						setAadhaarVerified(1);
					}
					setLoading(false);
				})
				.catch((error) => {
					// Handle errors

					setLoading(false);

					if (error?.response?.data?.error) {
						callAlert({
							message: error.response.data.error,
							type: "FAILED",
						});
					} else if (error?.response?.data) {
						callAlert({ message: error.response.data, type: "FAILED" });
					} else {
						callAlert({ message: error.message, type: "FAILED" });
					}
				});
		}
	}

	function padZero(num) {
		return num.toString().padStart(2, "0");
	}

	function convertToDDMMYYYY(dateString) {
		// Regular expression to match various date formats
		const dateFormatRegex =
			/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})|(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})|(\d{1,2})th\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*,\s(\d{4})$/;

		// Match the input date string with the regular expression
		const match = dateString.match(dateFormatRegex);

		if (!match) {
			return false;
		}

		// Extract date parts from the matched groups
		let [
			,
			year1,
			month1,
			day1,
			day2,
			month2,
			year2,
			day3,
			month3,
			monthName,
			year3,
		] = match;

		// Convert month name to numeric representation
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const monthIndex = monthNames.indexOf(monthName);
		if (monthIndex !== -1) {
			month3 = monthIndex + 1;
		}

		// Choose the correct date parts based on the matched groups
		const year = year1 || year2 || year3;
		const month = month1 || month2 || month3;
		const day = day1 || day2 || day3;

		// Create a Date object
		const dateObj = new Date(year, month - 1, day);

		// Format date as dd-mm-yyyy
		const formattedDate = `${padZero(dateObj.getDate())}-${padZero(
			dateObj.getMonth() + 1
		)}-${dateObj.getFullYear()}`;
		return formattedDate;
	}

	async function confirmUpdate() {
		Swal.fire({
			title: "Are you sure?",
			text: "You want to Update your profile!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const reqData = {
					user_id: uid,
					dob: Aadhaardob,
					name: aadhaarDetails.uidData.Poi.$.name,
					gender: aadhaarDetails.uidData.Poi.$.gender === "M" ? 1 : 2,
					co: aadhaarDetails.uidData.Poa.$.co,
					dist: aadhaarDetails.uidData.Poa.$.dist,
					state: aadhaarDetails.uidData.Poa.$.state,
				};

				try {
					const response = await axios.post(
						process.env.NEXT_PUBLIC_API_BASE_URL + "/update-user-kyc",
						{ data: encryptBody(JSON.stringify(dataToSend)) }
					);

					if (response.data.success) {
						Swal.fire({
							title: "Success!",
							text: "Your profile has been updated Successfully",
							icon: "success",
						});
						setdob(aadhaardob);
						window.location.reload();
					} else {
						Swal.fire({
							title: "Error!",
							text: "Please Contact Support",
							icon: "error",
						});
					}
				} catch (error) {
					Swal.fire({
						title: "Error!",
						text: "Please Contact Support",
						icon: "error",
					});
				}
			}
		});
	}

	const verifyOTP = () => {
		if (otp.length === 6) {
			setLoading(true);

			const dataToSend = {
				aadhaarNumber: aadhaarNumber,
				otp: otp,
				tnxID: tnxID,
			};
			fetch(getImagePath("/api/verify-otp"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify the content type as JSON
				},
				body: JSON.stringify(dataToSend), // Convert the data to JSON format
			})
				.then((response) => {
					if (!response.ok) {
						setAlert({
							open: true,
							type: false,
							message: "Unable to connect to UIDAI Please try again",
						});

						// throw new Error("Unable to connect to UIDAI Please try again");
					}
					return response.json();
				})
				.then(async (data) => {
					const { uidData, vault } = data || {};

					if (vault.$.aadhaarReferenceNumber) {
						setVaultId(vault.$.aadhaarReferenceNumber);
					}
					if (uidData?.Pht) {
						if (uidData?.Pht) {
							const resData = {
								aadhaarNo: aadhaarNumber,
								profilePhoto: uidData?.Pht
							};
							const phtResponse = await fetch(
								`${process?.env?.NEXT_PUBLIC_NODE_HIMPARIVAR}ekyc/upload-ekyc-photo`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(resData)
								}
							);
						}

					}

					setAadhaarDetails(data);

					getErrorColors(profileDetails, data);

					try {
						const formattedDate = convertToDDMMYYYY(uidData.Poi.$.dob);

						if (formattedDate) {
							//setDob(uidData.Poi.$.dob);
							setAadhaarDob(formattedDate);

							setdobVerify(true);
						} else {
							setAadhaarDob("");

							setdobVerify(false);
						}
					} catch (e) {}

					let object = {
						aadhaarNumber: CryptoJS.AES.encrypt(
							plainAadhaar,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						dob: CryptoJS.AES.encrypt(
							uidData.Poi.$.dob,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						service_id: service_id ? service_id : "10000046",

						name: CryptoJS.AES.encrypt(
							uidData.Poi.$.name,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),

						vaultId: CryptoJS.AES.encrypt(
							vault.$.aadhaarReferenceNumber
								? vault.$.aadhaarReferenceNumber
								: "",
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
					};

					setAlert({
						open: true,
						type: true,
						message: "Successfully verified!",
					});
					getProfile();

					setLoading(false);

					// setActiveStep(activeStep + 1)
				})
				.catch((error) => {
					// Handle errors

					setLoading(false);

					if (error?.response?.data?.error) {
						callAlert({ message: error.response.data.error, type: "FAILED" });
					} else if (error?.response?.data) {
						callAlert({ message: error.response.data, type: "FAILED" });
					} else {
						callAlert({ message: error.message, type: "FAILED" });
					}
				});
		} else {
			callAlert({ message: "Please Enter Correct OTP", type: "FAILED" });
		}
	};

	const getProfile = async () => {
		const reqData = {
			user_id: uid,
		};

		try {
			const response = await api.post("/citizen-details", { data: encryptBody(JSON.stringify(reqData)) });

			if (response.status === 200) {

				const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

				var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
				decr = decr.toString(CryptoJS.enc.Utf8);

				// const encryptedData = CryptoJS.AES.decrypt(
				// 	response.data,
				// 	secretKey
				// ).toString();

				let data = {};

				if (decr) {
					try {
						let json_data = JSON.parse(decr);
						data = json_data;
						setProfileDetails(data);


						const {
							name,
							aadhaarNumber,
							dob,
							email,
							gender,
							mobile,
							state,
							userName,
							pin,
							vtc,
							co,
							dist,
						} = data || {};

						if (name) {
							setname(name);
						}
						if (aadhaarNumber) {
							setAadhaarNumber(aadhaarNumber);
						}
						if (dob) {
							setdob(dob);
						}
						if (email) {
							setemail(email);
						}
						if (gender) {
							if (gender === 1) {
								setgender("Male");
							} else if (gender === 2) {
								setgender("Female");
							} else {
								setgender("Others");
							}
						}
						if (mobile) {
							setmobile(mobile);
						}
						if (state) {
							setstate(state);
						}
						if (userName) {
							setuserName(userName);
						}
						if (pin) {
							setPin(pin);
						}
						if (vtc) {
							setvtc(vtc);
						}
						if (co) {
							setco(co);
						}
						if (dist) {
							setdist(dist);
						}

						if (data) {
							const { co, dist, vtc } =data || {};
							let add = co ? co : "";

							if (dist) {
								add = add + ", " + dist;
							}
							if (vtc) {
								add = add + ", " + vtc;
							}

							setAddress(add);
						}

						getErrorColors(data, {});


					} catch (e) {
						console.warn(e);
					}
				}



				// setCitizenDetails(response.data);

			}
		} catch (error) {
			if (error?.response?.data?.error) {
			} else {
			}
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

	const MaskedAadhaar = ({ aadhaar }) => {
		const maskedAadhaar = maskAadhaar(aadhaar); // Function to mask Aadhaar

		return <span>{maskedAadhaar}</span>;
	};

	const maskAadhaar = (aadhaar) => {
		// Check if the Aadhaar number is valid (12 digits)
		if (aadhaar.length !== 12) {
			return "Invalid Aadhaar Number";
		}

		// Mask the Aadhaar number as XXXX XXXX 2921
		const masked = "XXXX XXXX " + aadhaar.slice(-4);
		return masked;
	};

	const getErrorColors = (existingObject, AadhaarObject) => {
		let nameError = true;
		let genderError = true;
		let dobError = true;
		let coError = true;
		let stateError = true;
		let distError = true;

		let name = AadhaarObject?.uidData?.Poi?.$?.name
			? AadhaarObject?.uidData?.Poi?.$?.name
			: "";
		let dob = AadhaarObject?.uidData?.Poi?.$?.dob
			? AadhaarObject?.uidData?.Poi?.$?.dob
			: "";
		let state = AadhaarObject?.uidData?.Poa?.$?.state
			? AadhaarObject?.uidData?.Poa?.$?.state
			: "";
		let dist = AadhaarObject?.uidData?.Poa?.$?.dist
			? AadhaarObject?.uidData?.Poa?.$?.dist
			: "";
		let co = AadhaarObject?.uidData?.Poa?.$?.co
			? AadhaarObject?.uidData?.Poa?.$?.co
			: "";

		let genderr = AadhaarObject?.uidData?.Poi?.$?.gender
			? AadhaarObject?.uidData?.Poi?.$?.gender
			: "";

		if (existingObject.name === name) {
			nameError = false;
		}
		if (existingObject.dob === dob) {
			dobError = false;
		}
		if (existingObject.co === co) {
			coError = false;
		}

		if (existingObject.state === state) {
			stateError = false;
		}
		if (existingObject.dist === dist) {
			distError = false;
		}
		if (gender.substring(0, 1) === genderr) {
			genderError = false;
		}

		setErrors({
			nameError: nameError,
			genderError: genderError,
			dobError: dobError,
			coError: coError,
			stateError: stateError,
			distError: distError,
		});

		if (
			!nameError &&
			!genderError &&
			!dobError &&
			!coError &&
			!stateError &&
			!distError
		) {
			setNoChanges(true);
		}
	};

	return (
		<>
			<Layout>
				<main className="p-6 space-y-6">
					<Backdrop
						sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={loading}
						onClick={() => setLoading(false)}
					>
						<CircularProgress color="inherit" />
					</Backdrop>

					<Paper
						style={{
							marginLeft: 20,
							marginTop: 60,
							marginRight: 20,
							marginBottom: 100,
						}}
						elevation={5}
					>
						<Grid container spacing={4} sx={{ padding: 2 }}>
							<Grid item={true} xs={12}>
								{/* <AllServices /> */}

								<Grid container>
									<Typography
										style={{
											fontSize: 18,
											letterSpacing: 0.5,
											fontWeight: "500",
											color: "#1876D1",
										}}
									>
										Personal Details
									</Typography>
								</Grid>
								<Divider />

								<Grid
									mt={1}
									container
									rowSpacing={2}
									columnSpacing={{ xs: 1, sm: 2, md: 3 }}
									sx={{}}
								>
									<Grid item xs={6}>
										<TextField
											disabled
											value={name}
											size={"small"}
											id="outlined-basic"
											label="Name"
											variant="outlined"
										/>
									</Grid>
									{/* <Grid item xs={6}>
                                        <TextField fullWidth disabled value={co} size={"small"} id="outlined-basic" label="Care Of" variant="outlined" />
                                    </Grid> */}

									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">
												Gender
											</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={gender}
												disabled
												label="Gender"
												size="small"
												onChange={handleChange}
											>
												<MenuItem value={"Male"}>Male</MenuItem>
												<MenuItem value={"Female"}>Female</MenuItem>
												<MenuItem value={"Others"}>Others</MenuItem>
											</Select>
										</FormControl>

										{/* <TextField disabled value={gender} size={"small"} id="outlined-basic" label="Gender" variant="outlined" /> */}
									</Grid>

									<Grid item xs={6} mt={1}>
										<TextField
											disabled
											value={dob}
											size={"small"}
											id="outlined-basic"
											label="Date of Birth"
											variant="outlined"
										/>
									</Grid>

									<Grid item xs={6}>
										<TextField
											disabled
											value={mobile}
											size={"small"}
											id="outlined-basic"
											label="Mobile Number"
											variant="outlined"
										/>
									</Grid>
								</Grid>

								<Grid container mt={5}>
									<Typography
										style={{
											fontSize: 18,
											letterSpacing: 0.5,
											fontWeight: "500",
											color: "#1876D1",
										}}
									>
										Aadhaar Details
									</Typography>
								</Grid>

								<Divider />

								<Grid
									mt={1}
									container
									rowSpacing={2}
									columnSpacing={{ xs: 1, sm: 2, md: 3 }}
									sx={{}}
								>
									<Grid item xs={6}>
										<TextField
											disabled
											value={maskAadhaar(aadhaarNumber)}
											size={"small"}
											id="outlined-basic"
											label="Aadhaar Number"
											variant="outlined"
										/>
									</Grid>
								</Grid>

								<Grid container mt={5}>
									<Typography
										style={{
											fontSize: 18,
											letterSpacing: 0.5,
											fontWeight: "500",
											color: "#1876D1",
										}}
									>
										Address
									</Typography>
								</Grid>

								<Divider style={{ color: "" }} />

								<Grid
									mt={1}
									container
									rowSpacing={2}
									columnSpacing={{ xs: 1, sm: 2, md: 3 }}
									sx={{}}
								>
									<Grid item xs={6} mt={1}>
										<TextField
											disabled
											value={state}
											size={"small"}
											id="outlined-basic"
											label="State"
											variant="outlined"
										/>
									</Grid>

									<Grid item xs={6} mt={1}>
										<TextField
											disabled
											value={vtc}
											size={"small"}
											id="outlined-basic"
											label="VTC"
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={6} mt={1}>
										<TextField
											disabled
											value={distt}
											size={"small"}
											id="outlined-basic"
											label="District"
											variant="outlined"
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>

					<Paper
						style={{
							marginLeft: 20,
							marginRight: 20,
							marginBottom: 100,
						}}
						elevation={5}
					>
						<Grid container spacing={4} sx={{ padding: 2 }}>
							<Grid item={true} xs={12}>
								<Grid item>
									<Typography
										style={{
											fontSize: 18,
											letterSpacing: 0.5,
											fontWeight: "500",
											color: "#1876D1",
										}}
									>
										Update Profile using eKyc
									</Typography>
								</Grid>

								<Divider />

								<Grid
									item
									mt={1}
									container
									rowSpacing={2}
									columnSpacing={{ xs: 3, sm: 3, md: 3 }}
								>
									<Grid item xs={2}>
										<Typography>Aadhaar Number</Typography>
									</Grid>

									<Grid item xs={4}>
										<TextField
											fullWidth
											disabled
											value={maskAadhaar(aadhaarNumber)}
											size={"small"}
											id="outlined-basic"
											label="Aadhaar Number"
											variant="outlined"
										/>
									</Grid>

									<Grid item xs={3} sx={{}}>
										<Button
											disabled={disableOtp ? true : false}
											onClick={() => {
												sendAadhaarOTP();
											}}
											style={{ width: 200 }}
											type="primary"
										>
											Get OTP
										</Button>
									</Grid>
								</Grid>

								{OtpSent && !aadhaarDetails && (
									<Box sx={{ display: "flex", justifyContent: "center" }}>
										<div className="countdown-text">
											{seconds > 0 || minutes > 0 ? (
												<Typography variant="body2">
													Time Remaining:{" "}
													{minutes < 10 ? `0${minutes}` : minutes}:
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
													color:
														seconds > 0 || minutes > 0 ? "#DFE3E8" : "#FF5630",
												}}
												onClick={() => sendAadhaarOTP()}
											>
												Resend OTP
											</button>
										</div>
									</Box>
								)}

								<Grid container xs={6} justifyContent={"center"}></Grid>

								{Object.keys(aadhaarDetails).length === 0 && OtpSent && (
									<Grid
										item
										mt={1}
										container
										rowSpacing={2}
										columnSpacing={{ xs: 1, sm: 2, md: 3 }}
										sx={{}}
									>
										<Grid item xs={2}>
											<Typography>Enter OTP</Typography>
										</Grid>

										<Grid item xs={4}>
											<NumericInput
												label="Enter OTP"
												maxLength={6}
												value={otp}
												size={"medium"}
												onChange={setOTP}
											/>
										</Grid>

										<Grid
											item
											xs={3}
											sx={{
												padding: 3,
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Button
												onClick={() => {
													verifyOTP();
												}}
												style={{ width: 200, background: "green" }}
												type="primary"
											>
												Perform EKYC
											</Button>
										</Grid>
									</Grid>
								)}

								<Grid container xs={6} justifyContent={"center"}></Grid>

								{aadhaarDetails?.uidData?.Poi?.$?.name && (
									<Grid
										mt={1}
										container
										columnSpacing={{ xs: 1, sm: 2, md: 3 }}
										xs={12}
									>
										<Grid item xs={6}>
											<Stack
												direction={"row"}
												style={{ background: "#dedede", padding: 8 }}
											>
												<Image
													src={getImagePath("/logo/hp.png")}
													alt="Background Image"
													width={30}
													height={20}
													objectFit="cover"
												/>

												<Typography
													style={{
														fontSize: 14,
														fontWeight: 600,
														marginLeft: 10,
													}}
												>
													Existing Details
												</Typography>
											</Stack>

											<div className="table">
												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Name{""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.nameError ? "red" : "green",
															}}
														>
															{name ? name : "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row">
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																fontWeight: 600,
															}}
														>
															Date of Birth
														</Typography>
													</div>
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																color: errors.dobError ? "red" : "green",
															}}
														>
															{" "}
															{dob ? dob : "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Care of S/o {""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.coError ? "red" : "green",
															}}
														>
															{co ? co : "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Gender:{""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.genderError ? "red" : "green",
															}}
														>
															{" "}
															{gender ? gender : "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															State{" "}
														</Typography>
													</div>
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																color: errors.stateError ? "red" : "green",
															}}
														>
															{state ? state : "N.A"}
														</Typography>
													</div>
												</div>
												<div className="row">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															District
														</Typography>
													</div>
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																color: errors.distError ? "red" : "green",
															}}
														>
															{distt ? distt : "N.A"}
														</Typography>
													</div>
												</div>

												{/* Add more rows and cells as needed */}
											</div>
										</Grid>

										<Grid item xs={6}>
											<Stack
												direction={"row"}
												style={{ background: "#dedede", padding: 8 }}
											>
												<img
													src={getImagePath("/aadhaar.svg")}
													width={30}
													height={20}
												/>

												<Typography
													style={{
														fontSize: 14,
														fontWeight: 600,
														marginLeft: 10,
													}}
												>
													Aadhaar Details
												</Typography>
											</Stack>

											<div className="table">
												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Name{""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.nameError ? "red" : "green",
															}}
														>
															{aadhaarDetails?.uidData?.Poi?.$?.name
																? aadhaarDetails?.uidData.Poi.$.name
																: "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Date of Birth
														</Typography>
													</div>
													<div className="cell">
														{!AadhaarDobVerify ? (
															<DatePicker
																// defaultValue={dayjs('2015-06-06', dateFormat)}

																defaultValue={
																	Aadhaardob
																		? dayjs(Aadhaardob, "DD-MM-YYYY")
																		: null
																}
																autoFocus={true}
																disabled={AadhaarDobVerify ? true : false}
																sx={{
																	"& .MuiInputBase-input": {
																		fontSize: "0.8rem", // Adjust font size if needed
																		padding: 1.2,
																	},
																	"& .MuiInputLabel-root": {
																		fontSize: "0.8rem", // Adjust font size for the label
																		marginTop: "-6px", // Adjust margin-bottom for spacing
																	},
																	"& .MuiInputBase-root": {
																		marginBottom: "8px", // Adjust margin-bottom for spacing
																	},
																}}
																size="small"
																formatDensity={"dense"}
																format="DD-MM-YYYY"
																label="Start Date"
																onChange={(newValue) => {
																	if (newValue) {
																		setAadhaarDob(
																			newValue.format("DD-MM-YYYY")
																		);
																	}
																}}
															/>
														) : (
															<Typography
																style={{
																	fontSize: 12,
																	color: errors.dobError ? "red" : "green",
																}}
															>
																{" "}
																{Aadhaardob ? Aadhaardob : "N.A"}
															</Typography>
														)}
													</div>
												</div>

												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Care of S/o {""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.coError ? "red" : "green",
															}}
														>
															{aadhaarDetails?.uidData?.Poa?.$?.co
																? aadhaarDetails?.uidData?.Poa?.$?.co
																: "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															Gender:{""}{" "}
														</Typography>
													</div>
													<div className="cell">
														{" "}
														<Typography
															style={{
																fontSize: 12,
																color: errors.genderError ? "red" : "green",
															}}
														>
															{" "}
															{aadhaarDetails.uidData?.Poi?.$?.gender
																? aadhaarDetails.uidData?.Poi?.$?.gender
																: "N.A"}
														</Typography>
													</div>
												</div>

												<div className="row header">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															State{" "}
														</Typography>
													</div>
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																color: errors.stateError ? "red" : "green",
															}}
														>
															{aadhaarDetails.uidData?.Poa?.$?.state
																? aadhaarDetails.uidData?.Poa?.$?.state
																: "N.A"}
														</Typography>
													</div>
												</div>
												<div className="row">
													<div className="cell">
														<Typography
															style={{ fontSize: 12, fontWeight: 600 }}
														>
															District
														</Typography>
													</div>
													<div className="cell">
														<Typography
															style={{
																fontSize: 12,
																color: errors.distError ? "red" : "green",
															}}
														>
															{aadhaarDetails.uidData?.Poa?.$?.dist
																? aadhaarDetails.uidData?.Poa?.$?.dist
																: "N.A"}
														</Typography>
													</div>
												</div>

												{/* Add more rows and cells as needed */}
											</div>
										</Grid>
									</Grid>
								)}
							</Grid>
						</Grid>

						{aadhaarDetails?.uidData?.Poi?.$?.name && !noChanges && (
							<Grid
								container
								xs={12}
								justifyContent={"center"}
								sx={{ padding: 5 }}
							>
								<Button
									onClick={() => {
										confirmUpdate();
									}}
									style={{ width: 200 }}
									type="primary"
								>
									Update Profile
								</Button>
							</Grid>
						)}

						{noChanges && (
							<Typography
								style={{
									fontSize: 16,
									color: "green",
									marginLeft: 16,
									paddingBottom: 16,
								}}
							>
								No changes detected.
							</Typography>
						)}
					</Paper>

					{alert.message && (
						<AlertModal alert={alert} handleClose={handleClose} />
					)}
				</main>
			</Layout>
		</>
	);
};
export default withAuth(Profile);
