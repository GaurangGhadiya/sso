import LoginPage from "@/components/Login/LoginPage";
import Header from "@/components/UI/Header";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
import LoginPageOpenIframe from "@/components/Login/LoginPageOpenIframe";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import NewLoginIframe from "@/components/Login/NewLoginIframe";
import Cookies from "js-cookie";
import LoginMain from "@/components/NewLogin/loginIframe";

const LoginIframe = () => {
	const router = useRouter();
	const [iframeKey, setIframeKey] = useState(0);

	let url = "https://sso.hp.gov.in/login-iframe?service_id=";

	const { service_id, login_type } = router.query;

	useEffect(() => {
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
		} catch (error) {}
	}, []);

	return (
		<>
			<div style={{}}>
				<LoginMain
					service_id={service_id}
					is_iframe={true}
					login_type={login_type}
				/>
			</div>
		</>
	);
};
export default LoginIframe;
