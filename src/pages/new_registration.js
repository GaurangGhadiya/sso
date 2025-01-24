import StepperForm from "./../components/Register/StepperForm";
import withAuth from "../../utils/withAuth";
import withUserCheck from "../../utils/withUserCheck";
import HeaderUser from "@/components/UI/HeaderUser";
import { useRouter } from "next/router";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

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

	const [open, setOpen] = useState(false);
	const [checked, setChecked] = useState([0]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleToggle = (value, index) => () => {
		setChecked(value);
	};

	if (Object.keys(router.query).length !== 0) {
		aadhaar_number = router.query.aadhaar_number
			? router.query.aadhaar_number
			: "";
		mobile = router.query.mobile ? router.query.mobile : "";
		email = router.query.email ? router.query.email : [];
		service_id = router.query.service_id ? router.query.service_id : "";

		userName = router.query.userName ? router.query.userName : "";
		userPassword = router.query.userPassword ? router.query.userPassword : "";
	}

	// registration

	return (
		<>
			<Box className={style.fullbg}></Box>

			<HeaderUser
				showLogin={service_id ? false : true}
				is_iframe={router.query.is_iframe}
				service_id={service_id}
			/>
			<Container
				maxWidth="md"
				sx={{ marginTop: 6, marginBottom: 6, position: "relative" }}
			>
				<div style={{ marginTop: 24 }}>
					<StepperForm
						reqAadhaar_number={aadhaar_number}
						reqMobile={mobile}
						reqEmail={email}
						service_id={service_id}
						userPassword={userPassword}
						userr_name={userName}
						extra_email={email}
						is_iframe={router.query.is_iframe}
					/>
				</div>
			</Container>

			<AppBar
				style={{ height: 40 }}
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
		</>
	);
};

export default withUserCheck(Registration);
