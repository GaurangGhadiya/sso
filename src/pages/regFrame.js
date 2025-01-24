import StepperForm from "./../components/Register/StepperForm";
import withAuth from "../../utils/withAuth";
import withUserCheck from "../../utils/withUserCheck";
import HeaderUser from "@/components/UI/HeaderUser";
import { useRouter } from "next/router";
import {
	AppBar,
	Box,
	Container,
	Grid,
	Paper,
	Toolbar,
	Typography,
} from "@mui/material";

import style from "../components/Login/Login.module.css";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";

import Modal from "@mui/material/Modal";
import React, { useState } from "react";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "80%",
	bgcolor: "background.paper",
	boxShadow: 124,
	borderRadius: 2,

	p: 4,
};

let emails_list = [
	"vijaypremi05@gmail.com",
	"rajeev_nic@gmail.com",
	"rajeev_sharma@gmail.com",
];

const Registration = () => {
	const router = useRouter();

	let aadhaar_number = "";
	let mobile = "";
	let email = "";
	let service_id = "";

	let userName = "";
	let userPassword = "";
	let users_list = "";

	let mobile_verified = false;

	let email_verified = false;

	let umap = "";
	let umap_var = "";
	let username = "";

	let primary_user = "";
	let login_type = "";

	const [open, setOpen] = useState(false);
	const [checked, setChecked] = useState([0]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [aadhaarFoundUser, setaadhaarFoundUser] = useState({});

	const handleToggle = (value, index) => () => {
		setChecked(value);
	};

	if (Object.keys(router.query).length !== 0) {
		aadhaar_number = router.query.aadhaar_number
			? router.query.aadhaar_number
			: "";
		mobile = router.query.mobile ? router.query.mobile : "";
		email = router.query.email ? router.query.email : "";
		service_id = router.query.service_id ? router.query.service_id : "";

		userName = router.query.userName ? router.query.userName : "";
		userPassword = router.query.userPassword ? router.query.userPassword : "";

		users_list = router.query.users_list ? router.query.users_list : "";

		mobile_verified = router.query.mobile_verified
			? router.query.mobile_verified
			: "";
		email_verified = router.query.email_verified
			? router.query.email_verified
			: "";

		umap = router.query.umap ? router.query.umap : "";
		umap_var = router.query.umap_var ? router.query.umap_var : "";
		username = router.query.username ? router.query.username : "";

		primary_user = router.query.primary_user ? router.query.primary_user : "";
		login_type = router.query.primary_user ? router.query.login_type : "";
	}

	// registration

	return (
		<>
			{router.query.service_id === "" && (
				<HeaderUser
					is_iframe={service_id ? true : false}
					service_id={service_id}
				/>
			)}
			<div class="parent-container">
				<div class={service_id ? "centered-div-iframe" : "centered-div"}>
					{/* <Box className={style.fullbg}></Box> */}

					<Container
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							minHeight: "100vh", // Optional: Set minHeight for vertical centering
						}}
					>
						{/* <div class="backdrop"></div> <div id="iframeContainer" class="iframe-container"></div>
                <script src="http://localhost:3000/sso-iframe.js" defer=""></script> */}

						<Box className={style.backdrop} />

						<Grid
							container
							justifyContent="center" // Centers horizontally
							alignItems="center" // Centers vertically
						>
							<Grid
								container
								style={{
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<div style={{ marginTop: 8 }}>
									<StepperForm
										reqAadhaar_number={aadhaar_number}
										reqMobile={mobile}
										reqEmail={email}
										service_id={service_id}
										userPassword={userPassword}
										userr_name={userName}
										extra_email={email}
										is_iframe={router.query.is_iframe}
										users_list={users_list}
										mobile_verified={mobile_verified}
										email_verified={email_verified}
										umap={umap}
										umap_var={umap_var}
										username={username}
										primary_user={primary_user}
										login_type={login_type}
										setaadhaarFoundUser={setaadhaarFoundUser}
										aadhaarFoundUser={aadhaarFoundUser}
									/>
								</div>
							</Grid>
						</Grid>
					</Container>
				</div>
			</div>

			{!service_id && (
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
						<Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={2}>
							Site designed, developed & hosted by Department of Digital
							Technologies & Governance, Himachal Pradesh
						</Typography>
					</Toolbar>
				</AppBar>
			)}
		</>
	);
};

export default withUserCheck(Registration);
