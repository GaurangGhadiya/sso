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
		email = router.query.email ? router.query.email : "";
		service_id = router.query.service_id ? router.query.service_id : "";

		userName = router.query.userName ? router.query.userName : "";
		userPassword = router.query.userPassword ? router.query.userPassword : "";
	}

	// registration

	return (
		<>
			{!service_id && (
				<HeaderUser
					is_iframe={service_id ? true : false}
					service_id={service_id}
				/>
			)}

			<Box className={style.fullbg}></Box>

			<Container sx={{ marginTop: 6, marginBottom: 6, position: "relative" }}>
				{/* <div class="backdrop"></div> <div id="iframeContainer" class="iframe-container"></div>
                <script src="http://localhost:3000/sso-iframe.js" defer=""></script> */}

				<Box className={style.backdrop} />

				<Grid
					container
					justifyContent="center" // Centers horizontally
					alignItems="center" // Centers vertically
				>
					<Typography mt={10} mb={10}>
						<strong>Term of Use</strong> <br />
						Him Parivar (Parivar Register) is a digital repository of all the
						members of individual families whose names are either entered in or
						to be entered in or updated in the online digital repository of
						families in the State of Himachal Pradesh for availing and proactive
						delivery of benefits of government schemes in the State. Himachal
						Pradesh Him Access  is an integral part of Him Parivar
						ecosystem for availing any benefit in the State. Him Parivar is
						being built using, amongst other sources, the Aadhaar eKYC under
						section 4(4)(b)(i) or 4(4)(b)(ii) or 7 of the Aadhaar Act, 2016 (as
						amended) and duly notified by the concerned Government Department.
						It would help in:
						<br />
						<strong>a)</strong> Deduplication and identification of persons
						<br />
						<strong>b)</strong> Will serve as document which ensure true data of
						citizens and family
						<br />
						<strong>c)</strong> Parivar Register would also be linked to social
						protection schemes of other departments for Proactive Benefit
						Delivery
						<br />
						<strong>d)</strong> Will ensure transparency and accountability
						<br />
						<strong>e)</strong> Citizen information in Him Parivar will be asked
						only once from the citizen and will not be asked by any other
						department again for disbursing any benefit to the citizen Benefits
						of Aadhaar based updation of Parivar data in Him Parivar Portal:
						<br />
						<strong>I.</strong> Him Parivar will act as a single touch point and
						will be used as a Him Access for Citizens for availing any
						benefit in the State.
						<br />
						<strong>II.</strong> Whenever a citizen will apply for any service
						or benefit, it will be done through Parivar Login. Him Parivar will
						have an Entitlement based benefit delivery mechanism to enable
						proactive delivery of benefits.
						<br />
						<strong>III.</strong> Aadhaar based eKYC would help in deduplication
						of the Him Parivar database and maintain uniformity in future.
						However, in the absence of Aadhaar, other documents such as Parivar
						ID/ Ration Card No./ PAN Card No. etc. will be accepted so that the
						benefit is delivered to the citizen. Use of Aadhaar will be purely
						on voluntary basis.
						<br />
						<strong>I.</strong> Since Him Parivar maintains a Family history,
						whenever a Birth and Marriage registration entry is to be made in
						Parivar Register, the eKYC of each member would be done once to get
						his/her Name, DOB, & Address to eliminate requirement of any
						additional document for POA and POI
						<br />
						<strong>II.</strong> For Death cases, the eKYC will be done for the
						person applying for death certificate
						<br />
						<strong>III.</strong> By collecting Aadhaar of citizens it would
						help in de-duplication of the Him Parivar database and maintain
						uniformity in future
						<br />
						<strong>IV.</strong> Aadhaar will also be useful in delivering the
						benefits to the residents of the State who are not the Permanent
						residents of the State but are eligible for different Government
						Schemes/ Benefits Aadhaar authentication and eKYC would be used for
						the following purposes:
						<br />
						<strong> a)</strong> Whenever an entry of Birth/ Marriage is to be
						made in Parivar Register they will be required to undergo Aadhaar
						eKYC.
						<br />
						<strong>b)</strong> Aadhaar would be stored in Aadhaar data Vault
						for using the same as financial address and also for validating
						attributes linked to Him Parivar database
						<br />
						<strong>c)</strong> Once registered in Him Parivar, a unique
						identifier would be given to the individual and to his family.
						Further, for all verification of eligibility criteria, only this
						identifier Him Parivar ID would be used.
						<br />
						<strong> d)</strong> Him Parivar ID or eKYC data will be utilised
						only for such schemes/ purposes which are in compliance with
						provisions of section 4(4)(b)(i) or 4 (4)(b)(ii) or 7 of the Aadhaar
						Act, 2016 (as amended) and duly notified by the concerned Government
						Department.
					</Typography>
				</Grid>
			</Container>

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
