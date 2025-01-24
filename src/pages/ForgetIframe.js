import { Box, Container, Divider, Typography, Paper, Tab } from "@mui/material";
import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ForgotPassword from "@/components/Login/forgot-password";
import ForgotPasswordOpenIframe from "@/components/Login/ForgotPasswordOpenIframe";

const ForgetIframe = ({ service_id, login_type }) => {
	const [value, setValue] = useState("1");
	const router = useRouter();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const forgotPassword = () => {
		router.push("./forgot-password");
		// window.top.location.href = '/forgot-password';
	};

	return (
		<Container maxWidth="sm" sx={{ marginTop: 6, position: "relative" }}>
			<Paper elevation={0} style={{ padding: "10px" }}>
				<Typography marginBottom={2} variant="body1" textAlign={"center"}>
					<b>Him Access</b>
					<br />
					<span style={{ color: "#1976d2" }}>Forgot Password</span>
				</Typography>
				<Divider />
				<ForgotPasswordOpenIframe
					service_id={router.query.service_id}
					login_type={router.query.login_type}
				/>
			</Paper>
		</Container>
	);
};
export default ForgetIframe;
