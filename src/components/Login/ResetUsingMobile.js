import {
	Grid,
	TextField,
	FormControlLabel,
	Checkbox,
	Button,
	FormHelperText,
	Snackbar,
	Alert,
	Typography,
	InputAdornment,
	IconButton,
	FormControl,
	InputLabel,
	OutlinedInput,
	Divider,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import CryptoJS from "crypto-js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { callAlert } from "../../../redux/actions/alert";
import { useDispatch } from "react-redux";
import { Select, Space } from "antd";
import NumericInput from "../NumericInput";
import { Button as AntdButton } from "antd";
import Swal from "sweetalert2";
import AlertModal from "../AlertModal";
import { encryptBody } from "../../../utils/globalEncryption";

const ResetUsingPassword = (props) => {
	const route = useRouter();
	const dispatch = useDispatch();

	const [mobile, setMobile] = useState("");
	const [otp, setOTP] = useState("");
	const [loginWithOtp, setLoginWithOtp] = useState(false);
	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [confPassword, setConfPassword] = useState("");
	const [password, setPassword] = useState("");

	const [emailList, setEmailList] = useState([]);

	const [serviceRedirect, setserviceRedirect] = useState("");

	const [otpSent, setOtpSent] = useState(false);

	const [timer, setTimer] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [show2Password, setShow2Password] = useState(false);

	const [userName, setUserName] = useState("");

	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(1);
	const [verifiedUser, setverifiedUser] = useState(false);
	const [loading, setLoading] = useState(false);

	const [selectedUsername, setselectedUsername] = useState("");

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleClickShowConfirmPassword = () =>
		setShow2Password((show) => !show);

	let is_iframed = false;

	if (props.iframe_redirect) {
		is_iframed = props.iframe_redirect;
	}

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
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

	useEffect(() => {
		const timer = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			} else {
				clearInterval(timer);
			}
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [seconds]);

	const [error, setError] = useState({
		mobile: false,
	});

	const submitHandler = async () => {
		if (mobile.length !== 10) {
			setAlert({
				open: true,
				type: false,
				message: "Please Enter valid 10 digit Mobile Number!",
			});
			return;
		}

		setSeconds(59);
		setTimer(true);
		const delay = 60000;
		setTimeout(myFunction, delay);

		const newError = {
			mobile: mobile.length < 1,
		};

		setError(newError);

		if (Object.values(newError).every((value) => value !== true)) {
			try {
				const reqData = {
					mobile,
				};

				const response = await api.post("/sent-mobile-sms", { data: encryptBody(JSON.stringify(reqData)) });

				if (response.status === 200) {
					const responseData = response.data;

					setLoginWithOtp(true);
					setAlert({ open: true, type: true, message: response.data });
				}
			} catch (error) {
				if (error?.response?.data?.error) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else {
					setAlert({ open: true, type: false, message: error.message });
				}
			}
		}
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handlePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const finalSubmitHandler = async () => {
		let passCheck = isPasswordValid(password);

		if (passCheck !== true) {
			setAlert({ open: true, type: false, message: passCheck });
			return;
		}

		if (otp.length == 0 || otp.length != 5) {
			setAlert({ open: true, type: false, message: "Please Enter Valid OTP" });
			return;
		}

		if (!selectedUsername) {
			setAlert({ open: true, type: false, message: "Please Select Username" });
			return;
		}

		if (passCheck === true) {
			if (confPassword === password) {
				try {
					const reqData = {
						password: CryptoJS.AES.encrypt(
							password,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						mobile,
						otp: CryptoJS.AES.encrypt(
							otp,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						user_name: selectedUsername,
					};

					const response = await api.post("/update-password", { data: encryptBody(JSON.stringify(reqData)) });

					if (response.status == 200) {
						setAlert({
							open: true,
							type: true,
							message: "Your password updated successfully.",
						});

						if (props.service_id) {
							setTimeout(() => {
								let param = `?service_id=${
									props.service_id ? props.service_id : "10000046"
								}&login_type=${props.login_type}`;

								// let param = `?service_id=${props.service_id}`;

								if(window.self !== window.top){

									route.push("./login-iframe" + param);
								}else{
									route.push("/login");
								}
							}, 500);
						} else {
							route.push("/login");
						}
					}
				} catch (error) {
					if (error?.response?.data?.error) {
						setAlert({
							open: true,
							type: false,
							message: error.response.data.error,
						});
					} else {
						setAlert({ open: true, type: false, message: error.message });
					}
				}
			} else {
				setAlert({
					open: true,
					type: false,
					message: "Your password and confirmation password do not match.",
				});
			}
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setAlert({ open: false, type: false, message: null });
	};

	function myFunction() {
		setTimer(false);
	}

	const sendOtpNew = async (selected_user) => {
		setLoading(false);
		setEmailList([]);

		const phoneNumberRegex = /^(?!0|1|2|3|4|5)\d{10}$/;

		if (!phoneNumberRegex.test(mobile)) {
			setAlert({
				open: true,
				type: false,
				message: "Please Enter Valid Mobile Number",
			});
			return;
		}

		if (mobile.length === 10) {
			const reqData = {
				mobile: mobile,
				// user_id: selected_user
			};

			try {
				const response = await api.post("/send-mobile-otp-new", { data: encryptBody(JSON.stringify(reqData)) });

				if (response.status === 200) {
					setAlert({
						open: true,
						type: true,
						message: "OTP sent to your mobile number.",
					});
					setLoginWithOtp(true);
					setOtpSent(true);
					setMinutes(0);
					setSeconds(59);
				}
			} catch (error) {
				if (error?.response?.status && error.response.status === 404) {
					Swal.fire({
						title: "Error",
						html: "Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.",
						showCancelButton: false,
						confirmButtonText: "Sign up",
						confirmButtonColor: "#1876d1",
						showCloseButton: true,
						customClass: {
							title: "swal-title",
							htmlContainer: "swal-text",
						},

						// cancelButtonText: 'No'
					}).then(async (result) => {
						if (result.isConfirmed) {
							// Redirect to the login page using your router logic
							// Replace 'your-login-route' with the actual route for your login page

							if (props.service_id === "10000046") {
								route.push("/registration");
							} else {
								const peram = `?service_id=${
									props.service_id ? props.service_id : ""
								}`;
								route.push("/registration-iframe" + peram);
							}
						}
					});

					return;
				}

				if (error?.response?.data?.error) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else {
					setAlert({ open: true, type: false, message: error?.message });
				}
			}
		} else {
			setAlert({
				open: true,
				type: false,
				message: "Please enter valid mobile number.",
			});
		}
	};

	const checkUserExistence = async () => {
		const reqData = {
			username: mobile,
			otp: CryptoJS.AES.encrypt(
				otp,
				process.env.NEXT_PUBLIC_API_SECRET_KEY
			).toString(),
			service_id: props.service_id ? props.service_id : "10000046",
		};

		try {
			const response = await api.post("/user-check-mobile-email-otp", { data: encryptBody(JSON.stringify(reqData)) });

			if (response.status === 200) {
				let url = "";

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

						return data;
					} catch (e) {
						console.warn(e)
					}

				}


				const peram = `?service_id=${service_id ? service_id : ""}&username=${
					mobile ? mobile : ""
				}&user_accounts=${
					response.data ? JSON.stringify(response.data) : ""
				}&redirection_details=${
					responseData ? JSON.stringify(responseData) : ""
				}`;

				if (response.data?.multipleUser.length > 1)
					route.push("./multipleAccounts" + peram);
			} else {
				return false;

				// let url = responseData.success_url;

				// const parameter = 'token=' + responseData.tempToken;

				// if (url.includes('?')) {
				//     url += '&' + parameter;
				// } else {
				//     url += '?' + parameter;
				// }
				// if (responseData.redirect_service_id) {
				//     url += '&service_id=' + responseData.redirect_service_id;
				// }

				// redirectForLogin(url, responseData.service_logo, responseData.service_name)

				// window.top.location.href = url;
			}
		} catch (error) {
			if (error?.response?.status && error.response.status === 404) {
				Swal.fire({
					title: "Error",
					html: "Invalid Credentials or user doesn't exist. Please enter correct User ID / Password or proceed to create new user.",
					showCancelButton: false,
					confirmButtonText: "Sign up",
					confirmButtonColor: "#1876d1",
					showCloseButton: true,
					customClass: {
						title: "swal-title",
						htmlContainer: "swal-text",
					},
					// cancelButtonText: 'No'
				}).then(async (result) => {
					if (result.isConfirmed) {
						// Redirect to the login page using your router logic
						// Replace 'your-login-route' with the actual route for your login page

						if (props.service_id === "10000046") {
							const peram = `?service_id=${
								props.service_id ? props.service_id : ""
							}`;
							route.push("/registration-iframe" + peram);
						} else if (!props.service_id) {
							route.push("/registration");
						} else {
							const peram = `?service_id=${
								props.service_id ? props.service_id : ""
							}`;
							route.push("/registration-iframe" + peram);
						}
					}
				});
			} else {
				if (error?.response?.data?.error) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				}
			}
		}
	};

	const checkExistingUser = async () => {
		if (otp.length < 5) {
			return setAlert({
				open: true,
				type: false,
				message: "Please Enter Correct OTP",
			});
		}

		// if (captcha !== true) {
		//   return setAlert({
		//     open: true,
		//     type: false,
		//     message: "Please Enter Correct Captcha",
		//   });
		// }

		let existence = await checkUserExistence();

		// let reqData ={};
		// const peram = `?service_id=${service_id ? service_id : ""}&username=${mobile ? mobile : ""}&user_accounts=${existence ? JSON.stringify(existence) : ""}&redirection_details=${JSON.stringify({})}`;
		// route.push('./multipleAccounts' + peram)
		const { multipleUser, service_id: redirect_service_ids } = existence || {};

		if (redirect_service_ids) {
			setserviceRedirect(redirect_service_ids);
		}

		if (multipleUser && multipleUser.length > 0) {
			let array = [];
			for (let a = 0; a < multipleUser.length; a++) {
				let object = {
					label: multipleUser[a].userName,
					value: multipleUser[a].id,
				};

				array.push(object);
			}
			setEmailList(array);
		}
		if (multipleUser && multipleUser.length == 1) {
			setverifiedUser(true);
			// sendOtpNew("");

			setselectedUsername(multipleUser[0].id);
		}
	};

	return (
		<>
			<Grid spacing={2} container>
				<Grid item xs={12}>
					<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
						{"Enter Mobile Number"}{" "}
					</Typography>
					<Space.Compact style={{ width: "100%" }}>
						<NumericInput
							maxLength={10}
							value={mobile}
							disabled={loginWithOtp ? true : false}
							size={"medium"}
							label={"Enter your Mobile Number"}
							onChange={(e) => {
								const inputValue = e;
								if (/^[\d+]*$/.test(inputValue)) {
									setMobile(inputValue);
									setEmailList([]);
									if (inputValue.length === 10) {
										setMobile(inputValue);
										setEmailList([]);
										setverifiedUser(false);

										// setTimeout(() => {

										//     UserCheckMobile(inputValue)
										//     // sendOtp(inputValue)
										// }, 800)
									}
								}
							}}
						/>
						<AntdButton
							disabled={loginWithOtp ? true : false}
							onClick={() => sendOtpNew()}
							type="primary"
						>
							Get OTP
						</AntdButton>
					</Space.Compact>
				</Grid>

				{/* <Grid item xs={12}>
          <TextField
            size="small"
            inputProps={{
              maxLength: 10,
            }}
            required
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[\d+]*$/.test(inputValue)) {
                setMobile(inputValue);
              }
            }}
            value={mobile}
            fullWidth
            label="Mobile"
            variant="outlined"
            disabled={loginWithOtp ? true : false}
          />
        </Grid> */}

				{loginWithOtp && (
					<>
						<Grid item xs={12}>
							<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
								{"Enter OTP"}{" "}
							</Typography>
							<NumericInput
								style={{ borderRadius: 5 }}
								maxLength={6}
								label={"Enter OTP"}
								onBlur={() => checkExistingUser()}
								// onBlur={() => submitHandlerOtp()}
								onChange={(e) => setOTP(e)}
								value={otp}
							/>

							{timer ? (
								<Typography
									color={"#4CAF50"}
									sx={{ cursor: "pointer" }}
									textAlign={"right"}
									variant="body2"
								>
									<small>Resend OTP ({seconds} sec)</small>
								</Typography>
							) : (
								<Typography
									onClick={() => sendOtpNew()}
									color={"#4CAF50"}
									sx={{ cursor: "pointer" }}
									textAlign={"right"}
									variant="body2"
								>
									<small>Resend OTP</small>
								</Typography>
							)}

							{emailList.length > 0 && (
								<>
									<Typography color={"#1876d1"} style={{ fontSize: 12 }}>
										{"Select Username"}{" "}
									</Typography>

									<Select
										placeholder="Please select Username"
										value={selectedUsername}
										style={{ width: "100%", borderRadius: 5 }}
										options={emailList}
										onChange={(e, options) => {
											setselectedUsername(e);
											setOtpSent(false);
											setverifiedUser(true);
										}}
									/>
								</>
							)}
						</Grid>

						<Grid item xs={12}>
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
									maxLength: 32,
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label="Confirm Password"
								variant="outlined"
								fullWidth
								size="small"
								type={show2Password ? "text" : "password"}
								value={confPassword}
								onChange={(e) => {
									const inputValue = e.target.value;
									if (!/[<>]/.test(inputValue)) {
										setConfPassword(inputValue);
									}
								}}
								InputProps={{
									maxLength: 32,
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowConfirmPassword}
												edge="end"
											>
												{show2Password ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>

							{/*
                            <FormControl variant="outlined" sx={{ width: '100%' }}>
                                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={'password'}
                                    label="Confirm Password"
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
					</>
				)}

				<Grid item xs={12}>
					<Button
						variant="contained"
						fullWidth
						onClick={loginWithOtp ? finalSubmitHandler : submitHandler}
					>
						Reset Password
					</Button>
				</Grid>
			</Grid>

			{alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
		</>
	);
};
export default ResetUsingPassword;
