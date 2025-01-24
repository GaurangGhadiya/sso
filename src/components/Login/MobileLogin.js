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
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../../utils/api";
import Captcha from "../UI/Captcha";
import CryptoJS from "crypto-js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { getImagePath } from "../../../utils/CustomImagePath";
import AlertModal from "../AlertModal";
import { encryptBody } from "../../../utils/globalEncryption";
import expirationDate from "../../../utils/cookiesExpire";

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

const MobileLogin = ({ handleChange }) => {
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [term, setTerm] = useState(true);
	const [captcha, setCaptcha] = useState(false);

	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [otp, setOTP] = useState("");
	const [loginWithOtp, setLoginWithOtp] = useState(false);

	const [error, setError] = useState({
		mobile: false,
		password: false,
		term: false,
	});

	const route = useRouter();

	const checkUserExistence = async () => {
		const reqData = {
			username: mobile,
			otp: CryptoJS.AES.encrypt(
				otp,
				process.env.NEXT_PUBLIC_API_SECRET_KEY
			).toString(),
		};

		try {
			const response = await api.post("/user-check-mobile-email-otp", { data: encryptBody(JSON.stringify(reqData)) });

			if (response.status === 200) {
				return response.data;

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
				setAlert({
					open: true,
					type: false,
					message: error?.response?.data.error,
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

	const submitHandler = async () => {
		const attempt = Cookies.get("attempt");

		if (attempt && attempt >= 3) {
			setAlert({
				open: true,
				type: false,
				message:
					"Your account has been temporarily locked due to multiple incorrect login attempts!",
			});
			return;
		}

		const newError = {
			mobile: mobile.length < 1,
			password: password.length < 1,
			term: !term,
		};

		setError(newError);

		if (
			Object.values(newError).every((value) => value !== true) &&
			captcha === true
		) {
			try {
				const userDetails = await fetch(getImagePath("/api/user-info"), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const userDetail = await userDetails.json();

				if (userDetail) {
					const reqData = {
						mobile: CryptoJS.AES.encrypt(
							mobile,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						password: CryptoJS.AES.encrypt(
							password,
							process.env.NEXT_PUBLIC_API_SECRET_KEY
						).toString(),
						userDetails: userDetail,
					};

					const response = await api.post("/user-login-mobile", reqData);

					if (response.status === 200) {
						const responseData = response.data;

						Cookies.set("role", "user", { expires: expirationDate });
						Cookies.set("uid", responseData.id, { expires: expirationDate });
						Cookies.set("name", responseData.name, { expires: expirationDate });

						route.push("/dashboard");
					}
				}
			} catch (error) {
				let attempt = Cookies.get("attempt");
				if (attempt) {
					Cookies.set("attempt", +attempt + 1, {
						expires: new Date(Date.now() + 3 * 60000),
					});
				} else {
					Cookies.set("attempt", 1, {
						expires: new Date(Date.now() + 3 * 60000),
					});
				}

				if (error?.response?.status && error.response.status === 404) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else if (error?.response?.status && error.response.status === 403) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
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
		}
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setAlert({ open: false, type: false, message: null });
	};

	const sendOtp = async (mobile) => {
		if (mobile.length > 9) {
			const reqData = {
				mobile,
			};

			try {
				const response = await api.post("/sent-mobile-sms", { data: encryptBody(JSON.stringify(reqData)) });

				if (response.status === 200) {
					setAlert({
						open: true,
						type: true,
						message: "OTP sent to your mobile number.",
					});
					setLoginWithOtp(true);
				}
			} catch (error) {
				if (error?.response?.status && error.response.status === 404) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else {
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
		} else {
			setAlert({
				open: true,
				type: false,
				message: "Please enter valid mobile number.",
			});
		}
	};

	const submitHandlerOtp = async () => {
		const attempt = Cookies.get("attempt");

		if (attempt && attempt >= 3) {
			setAlert({
				open: true,
				type: false,
				message:
					"Your account has been temporarily locked due to multiple incorrect login attempts!",
			});
			return;
		}

		const newError = {
			mobile: mobile.length < 1,
			otp: otp.length < 1,
			term: !term,
		};

		setError(newError);

		if (
			Object.values(newError).every((value) => value !== true) &&
			captcha === true
		) {
			try {
				const userDetails = await fetch(getImagePath("/api/user-info"), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const userDetail = await userDetails.json();

				let existence = await checkUserExistence();

				let service_id = "10000046";

				if (existence && existence.multipleUser) {
					if (existence.multipleUser.length > 1) {
						const peram = `?service_id=${
							service_id ? service_id : ""
						}&username=${mobile ? mobile : ""}&user_accounts=${
							existence ? JSON.stringify(existence) : ""
						}&redirection_details=${JSON.stringify({})}`;
						route.push("./multipleAccountsSSO" + peram);
					} else if (existence.multipleUser.length == 1) {
						let user_id = existence.multipleUser[0].id;

						const reqData = {
							user_id: user_id,
							service_id: service_id,
							BrowserDetails: userDetail,
							login_type: "mobile",
						};

						const response = await api.post(
							"/check-secondary-mapping",
							{ data: encryptBody(JSON.stringify(reqData)) }
						);

						// const { secondaryMapping, redirect, sso_id } = response.data || {};

						let jsonString = JSON.stringify(secondaryMapping);

						let base64String = Buffer.from(jsonString).toString("base64");
						let urlEncodedString = encodeURIComponent(base64String);

						const peram = `?service_id=${
							service_id ? service_id : ""
						}&sso_id=${sso_id}&mapped_list=${urlEncodedString}&redirection_details=${
							redirect ? JSON.stringify(redirect) : JSON.stringify({})
						}`;
						route.push("/mapping" + peram);
					}
				}

				// if (userDetail) {

				//     const reqData = {
				//         mobile: mobile,
				//         otp: otp,
				//         userDetails: userDetail
				//     }

				//     const response = await api.post('/user-login-mobile', reqData);

				//     if (response.status === 200) {

				//         const responseData = response.data;

				//         Cookies.set('role', 'user', { expires: expirationDate });
				//         Cookies.set('uid', responseData.id, { expires: expirationDate });
				//         Cookies.set('name', responseData.name, { expires: expirationDate });

				//         route.push('/dashboard')

				//     }

				// }
			} catch (error) {
				let attempt = Cookies.get("attempt");
				if (attempt) {
					Cookies.set("attempt", +attempt + 1, {
						expires: new Date(Date.now() + 3 * 60000),
					});
				} else {
					Cookies.set("attempt", 1, {
						expires: new Date(Date.now() + 3 * 60000),
					});
				}

				if (error?.response?.status && error.response.status === 404) {
					setAlert({
						open: true,
						type: false,
						message: error.response.data.error,
					});
				} else {
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
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<Grid spacing={2} container>
				<Grid item xs={12}>
					<TextField
						focused
						size="small"
						inputProps={{
							maxLength: 10,
						}}
						required
						error={error.mobile && true}
						onChange={(e) => {
							const inputValue = e.target.value;
							if (/^[\d+]*$/.test(inputValue)) {
								setMobile(inputValue);
								if (inputValue.length === 10) {
									setTimeout(() => {
										sendOtp(inputValue);
									}, 500);
								}
							}
						}}
						value={mobile}
						fullWidth
						label="Mobile"
						variant="outlined"
					/>
				</Grid>

				{loginWithOtp && (
					<Grid item xs={12} mt={2}>
						<TextField
							sx={{ mb: 3, ...stylesCSS.input }}
							focused
							size="small"
							required
							error={error.otp && true}
							onChange={(e) => setOTP(e.target.value)}
							value={otp}
							fullWidth
							label="OTP"
							variant="outlined"
						/>
					</Grid>
				)}

				<Grid item xs={12}>
					<Captcha captcha={captcha} setCaptcha={setCaptcha} />
				</Grid>

				{/* <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox required checked={term} onChange={(e) => setTerm(e.target.checked)} />} label={<small style={{ fontSize: '11px' }}>I consent to Him Access Terms of use</small>} />
                    {error.term && (<FormHelperText error>Please Accept Terms of use</FormHelperText>)}
                </Grid> */}

				<Grid item xs={12}>
					<Button
						variant="contained"
						fullWidth
						onClick={loginWithOtp ? submitHandlerOtp : submitHandler}
					>
						Sign In
					</Button>
				</Grid>
			</Grid>

			{alert.message && <AlertModal alert={alert} handleClose={handleClose} />}
		</>
	);
};
export default MobileLogin;
