import LoginPage from "@/components/Login/LoginPage";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
import LoginPageOpen from "../components/Login/LoginPageOpen";
import HeaderUser from "../components/UI/HeaderUser";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import NewLogin from "@/components/Login/NewLogin";
import LoginPageOpenIframe from "@/components/Login/LoginPageOpenIframe";
import NewLoginIframe from "@/components/Login/NewLoginIframe";
import style from "../components/Login/Login.module.css";

const Login = () => {
	const router = useRouter();

	const { service_id } = router.query;

	return (
		<>
			<Box className={style.fullbg}></Box>

			<HeaderUser />
			<div>
				{service_id ? (
					<NewLoginIframe service_id={service_id} is_iframe={true} />
				) : (
					<NewLogin is_iframe={false} service_id={"10000046"} />
				)}
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					margin: 0,
					padding: 0,
				}}
			>
				<AppBar
					style={{ height: 40, background: "#1876D0" }}
					position="fixed"
					sx={{
						top: "auto",
						bottom: 0,
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				>
					<Toolbar>
						<Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={3}>
							Site designed, developed & hosted by Department of Digital
							Technologies & Governance, Himachal Pradesh
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
		</>
	);
};
export default withUserCheck(Login);
