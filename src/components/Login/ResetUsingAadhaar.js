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
import { KeyOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { callAlert } from "../../../redux/actions/alert";
import { useDispatch } from "react-redux";
import { getImagePath } from "../../../utils/CustomImagePath";
import AadhaarInput from "../Login/AadhaarInput";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import AlertModal from "../AlertModal";
import { encryptBody } from "../../../utils/globalEncryption";

const ResetUsingPassword = (props) => {
	const route = useRouter();
	const dispatch = useDispatch();

	const [mobile, setMobile] = useState("");

	const [aadhaarNumber, setaadhaarNumber] = useState("");

	const [otp, setOTP] = useState("");
	const [loginWithOtp, setLoginWithOtp] = useState(false);
	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [confPassword, setConfPassword] = useState("");
	const [password, setPassword] = useState("");

	const [timer, setTimer] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [show2Password, setShow2Password] = useState(false);

	const [userName, setUserName] = useState("");

	const [seconds, setSeconds] = useState(0);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleClickShowConfirmPassword = () =>
		setShow2Password((show) => !show);

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
		const plainAadhaar = aadhaarNumber.replaceAll("-", "");

		if (plainAadhaar.length !== 12) {
			setAlert({
				open: true,
				type: false,
				message: "Please Enter valid 12 digit Aadhaar Number!",
			});
			return;
		}

		setSeconds(59);
		setTimer(true);
		const delay = 60000;
		setTimeout(myFunction, delay);

		const newError = {
			mobile: plainAadhaar.length < 1,
		};

		setError(newError);

		if (Object.values(newError).every((value) => value !== true)) {
			try {
				const reqData = {
					uid: CryptoJS.AES.encrypt(
						plainAadhaar,
						process.env.NEXT_PUBLIC_API_SECRET_KEY
					).toString(),
				};
				const response = await api.post("/otp-aadhaar", reqData);

				// const response = await api.post('/sent-mobile-sms', reqData);

				if (response.status === 200) {
					const responseData = response.data;

					setLoginWithOtp(true);
				}
			} catch (error) {
				if (error?.response?.data?.error) {
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
						setAlert({
							open: true,
							type: false,
							message: error?.response?.data?.error,
						});
					}
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
		const plainAadhaar = aadhaarNumber.replaceAll("-", "");

		let passCheck = isPasswordValid(password);

		if (passCheck !== true) {
			setAlert({ open: true, type: false, message: passCheck });
			return;
		}

		if (otp.length == 0 || otp.length != 5) {
			setAlert({ open: true, type: false, message: "Please Enter Valid OTP" });
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
						email: "",
						aadhaarNumber: plainAadhaar,
					};

					const response = await api.post("/update-password", { data: encryptBody(JSON.stringify(reqData)) });

					if (response.status === 200) {
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

	return (
		<>
			<Grid spacing={2} container>
				<Grid item xs={12}>
					{/* <TextField size="small" type="number" fullWidth label="Enter Aadhaar Number" value={aadhaarNumber} placeholder="Enter Aadhaar Number" variant="outlined" onChange={(e) => setAadhaarNumber(e.target.value)} /> */}

					<AadhaarInput aadhaar={aadhaarNumber} setAadhaar={setaadhaarNumber} />

					{/* <TextField type="number" size="small" inputProps={{
                        maxLength: 12,
                    }} required onChange={
                        (e) => {
                            const inputValue = e.target.value;
                            if (e.target.value.length <= 12) {

                                setaadhaarNumber(inputValue);

                            }
                        }
                    } value={aadhaarNumber} fullWidth label="Enter Aadhaar Number" variant="outlined" disabled={loginWithOtp ? true : false} /> */}
				</Grid>

				{loginWithOtp && (
					<>
						<Grid item xs={12}>
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
									onClick={submitHandler}
									color={"#4CAF50"}
									sx={{ cursor: "pointer" }}
									textAlign={"right"}
									variant="body2"
								>
									<small>Resend OTP</small>
								</Typography>
							)}

							<TextField
								size="small"
								helperText="OTP sent to your mobile number."
								required
								error={error.otp && true}
								onChange={(e) => setOTP(e.target.value)}
								value={otp}
								fullWidth
								label="OTP"
								variant="outlined"
							/>
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
									maxLength: 32,
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
