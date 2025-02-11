import LoginPage from "@/components/Login/LoginPage";
import Header from "@/components/UI/Header";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
import LoginPageOpenIframe from "@/components/Login/LoginPageOpenIframe";
import React, { useEffect, useState } from "react";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, Toolbar, Typography } from "@mui/material";
import NewLoginIframe from "@/components/Login/NewLoginIframe";
import Cookies from "js-cookie";
import LoginMain from "@/components/NewLogin/loginIframe";
import { getImagePath } from "../../utils/CustomImagePath";
import api from "../../utils/api";
import { encryptBody } from "../../utils/globalEncryption";
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import CryptoJS from "crypto-js";

const LoginIframe = () => {
	const router = useRouter();
	const dispatch = useDispatch()
	const [iframeKey, setIframeKey] = useState(0);
	const [open, setOpen] = React.useState(false);
	const [name, setName] = useState("")
	const [serviceId, setServiceId] = useState("")
	const [uid, setUid] = useState("")


	let url = "https://sso.hp.gov.in/login-iframe?service_id=";

	const { service_id, login_type } = router.query;
console.log('serviceId', serviceId)
	useEffect(() => {
		console.log('router', router)
		// Cookies.remove("primary_user_array", { sameSite: "None", secure: true });
		// Cookies.remove("role", { sameSite: "None", secure: true });
		// Cookies.remove("uid", { sameSite: "None", secure: true });
		// Cookies.remove("name", { sameSite: "None", secure: true });
		// Cookies.remove("secondary_user_array", { sameSite: "None", secure: true });
		// Cookies.remove("sso_id", { sameSite: "None", secure: true });
		// Cookies.remove("user_info", { sameSite: "None", secure: true });

		// try {
		// 	Object.keys(Cookies.get()).forEach(function (cookieName) {
		// 		var neededAttributes = {
		// 			// Here you pass the same attributes that were used when the cookie was created
		// 			// and are required when removing the cookie
		// 		};
		// 		Cookies.remove(cookieName, neededAttributes);
		// 	});
		// } catch (error) {}
		let data = Cookies.get("uid");
		let name = Cookies.get("name");
		setName(name)
		setUid(data)
		console.log('service_id', service_id)
		setServiceId(service_id?.includes("_") ? service_id?.split("_")?.[0] : service_id)
		if (data) {
			handleClickOpen()
			// alert("user alreasy logged in")
		} else {
			// alert("new login")
		}
	}, [router]);
	// }, [router]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleYes = () => {
		Cookies.remove("primary_user_array", { sameSite: "None", secure: true });
		Cookies.remove("role", { sameSite: "None", secure: true });
		Cookies.remove("uid", { sameSite: "None", secure: true });
		Cookies.remove("name", { sameSite: "None", secure: true });
		Cookies.remove("secondary_user_array", { sameSite: "None", secure: true });
		Cookies.remove("sso_id", { sameSite: "None", secure: true });
		Cookies.remove("user_info", { sameSite: "None", secure: true });

		try {
			Object.keys(Cookies.get()).forEach(function (cookieName) {
				var neededAttributes = {
					// Here you pass the same attributes that were used when the cookie was created
					// and are required when removing the cookie
				};
				Cookies.remove(cookieName, neededAttributes);
			});
		} catch (error) { }
		handleClose()
	}


	const handleNo = () => {
		redirectToService(serviceId)
	}

	function openInNewWindow(url) {
		// Open the URL in a new window with specific window features
		const newWindow = window.open(url, "_blank", "noopener,noreferrer");

		// Check if the window was successfully opened
		if (newWindow) {
			// Focus the new window (optional)
			newWindow.focus();
		}
	}
	const redirectToService = async (serviceId) => {
		const userDetails = await fetch(getImagePath("/api/user-info"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const userDetail = await userDetails.json();

		if (userDetail) {
			const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

			const reqData = {
				uid: uid,
				service_id: serviceId,
				userDetails: userDetail,
			};

			var aaa = CryptoJS.AES.decrypt(encryptBody(JSON.stringify(reqData)), secretKey);
			aaa = aaa.toString(CryptoJS.enc.Utf8);
			console.log('aaa', aaa, serviceId)

			try {
				const response = await api.post("/redirect-to-success", reqData);


console.log('response', response?.data)

				if (response.status === 200) {
					let url = "";


					// var decr = CryptoJS.AES.decrypt(response.data, secretKey);
					// decr = decr.toString(CryptoJS.enc.Utf8);

					// const encryptedData = CryptoJS.AES.decrypt(
					// 	response.data,
					// 	secretKey
					// ).toString();

					let data = {};

					if (true) {
						try {
							// let json_data = JSON.parse(decr);
							data = response?.data;
							url = data.success_url

							let parameter = "";

							if (service_id === 10000038) {
								parameter = "token=" + data.tempToken + "&service_id=" + 0;
							} else {
								parameter = "token=" + data.tempToken;
							}

							if (url.includes("?")) {
								url += "&" + parameter;
							} else {
								url += "?" + parameter;
							}
							handleClose()
							openInNewWindow(url);


						} catch (e) {
							console.error(e);
						}
					}


					// let url = response.data.success_url;


				}
			} catch (error) {
				if (error?.response?.data?.error) {
					dispatch(
						callAlert({ message: error.response.data.error, type: "FAILED" })
					);
				} else {
					dispatch(callAlert({ message: error.message, type: "FAILED" }));
				}
			}
		}
	};
	return (
		<>
			<div style={{}}>
				<LoginMain
					service_id={service_id}
					is_iframe={true}
					login_type={login_type}
				/>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Are you already loggedin as {name}. Do you want to countinue or cancel login?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button style={{color : "black"}} onClick={handleNo}>
							Continue
						</Button>
						<Button style={{ color: "black" }} onClick={handleYes}>Cancel</Button>
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
};
export default LoginIframe;
