import { Box, Container, Divider, Typography, Paper, Tab } from "@mui/material";
import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserNameIframe from "./LoginOpen/UserNameIframe";
import MobileLoginIframe from "./LoginOpen/MobileLoginIframe";
import Link from "next/link";
import AadhaarLogin from "./AadhaarLogin";
import Image from "next/image";
import { useRouter } from "next/router";

const LoginPageOpenIframe = ({ service_id, is_iframe }) => {
	const [value, setValue] = useState("1");
	const router = useRouter();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const forgotPassword = () => {
		if (is_iframe) {
			router.push("./forgot-iframe");
		} else {
			router.push("./forgot-password");
		}
		// window.top.location.href = '/forgot-password';
	};

	return (
		<Container maxWidth="sm" sx={{ marginTop: 2, position: "relative" }}>
			<Paper elevation={1} style={{ padding: "10px" }}>
				<Typography marginBottom={2} variant="body1" textAlign={"center"}>
					<b>Him Access</b>
					<br />
					<span style={{ color: "#1976d2" }}>Sign in using</span>
				</Typography>
				<Divider />

				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList onChange={handleChange} aria-label="lab API tabs example">
							<Tab label="Email / UserId" value="1" />
							<Tab label="Mobile" value="2" />
							<Tab label="Aadhaar" value="3" />
							{/* <Tab label="Parichay/Gov Emp" value="3" /> */}
						</TabList>
					</Box>

					<TabPanel value="1">
						<UserNameIframe
							handleChange={handleChange}
							service_id={service_id}
						/>
					</TabPanel>

					<TabPanel value="2">
						<MobileLoginIframe
							handleChange={handleChange}
							service_id={service_id}
						/>
					</TabPanel>

					<TabPanel value="3">
						<AadhaarLogin iframe={1} service_id={service_id} />
					</TabPanel>

					<Typography
						onClick={forgotPassword}
						style={{ cursor: "pointer" }}
						textAlign={"center"}
						variant="body2"
						color={"primary"}
					>
						Forgot Password?
					</Typography>
					<br />

					{is_iframe ? (
						<Link
							href={
								"/registration-iframe?service_id=" +
								service_id +
								"&is_iframe=" +
								is_iframe
							}
						>
							<Typography
								sx={{ cursor: "pointer" }}
								textAlign={"center"}
								variant="body2"
								color={"primary"}
							>
								New user? Sign up for Him Access
							</Typography>
						</Link>
					) : (
						<Link href={"/registration?service_id=" + service_id}>
							<Typography
								sx={{ cursor: "pointer" }}
								textAlign={"center"}
								variant="body2"
								color={"primary"}
							>
								New user? Sign up for Him Access
							</Typography>
						</Link>
					)}
				</TabContext>
			</Paper>
		</Container>
	);
};
export default LoginPageOpenIframe;
