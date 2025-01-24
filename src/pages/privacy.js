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

				<Grid container>
					<Typography mt={2} mb={10}>
						{/* <strong>Privacy Policy</strong><br></br>
                                   Him Parivar is committed to protecting your privacy. This Privacy Policy explains our data processing practices and your options regarding the ways in which your personal data is used. If you have concerning your personal information or any questions, please contact us at himparivar.hp.gov.in or sso.hp.gov.in. Please note that the practices of Him Parivar with respect to data collected and used by Him Parivar only in connection with this website with links to this policy are governed by Him Parivar privacy policy Privacy Policy as amended from time to time and not the privacy policy in effect at the time the data was collected. Please regularly review our Privacy Policy. If you have objections to the Privacy Policy, you can immediately contact us.
                                   <br /> <br /><strong>Information collected:</strong> Him Parivar collects the details provided by you on registration (either using Him Parivar portal or through Him Access Portal) together with information we learn about you from your use of our service and your visits to our website. We also collect information about the transactions you undertake including details of payment cards used. We may collect additional information in connection with your participation in any promotions or competitions offered by us and information you provide when giving us feedback or completing profile forms. We also monitor customer traffic patterns and site usage which enables us to improve the services we provide.
                                   <br /><br /><strong>Use of your information and your preferences:</strong> We will use your information to provide and personalize our service. We will also use your contact details to regularly communicate with you. We may use your information to send you to offer and news from Him Parivar and services, for this we may contact you by post, email, or telephone for these purposes. We like to hear your views to help us improve our service.
                                   <br /><br /><strong>Disclosures of your information:</strong> Your information will be used by only at Him Parivar. We will never pass your personal data to anyone else, except for any successors to our business. We may also use and disclose information in aggregate (so that no individual customers are identified) for marketing programs, advertisers, and partners. Him Parivar does not provide any personal information to the advertiser when you interact with or view a targeted ad. However, by interacting with or viewing an ad you are consenting to the possibility that the advertiser will make the assumption that you meet the targeting criteria used to display the ad. We may transfer information about you if Him Parivar is acquired by or merged with another agency. In this event, Him Parivar will notify you before information about you are transferred and becomes subject to a different privacy policy by updating this page.
                                   <br /><br /><strong>Legal Disclaimer:</strong> We reserve the right to disclose your personally identifiable information as required by law and when believe it is necessary to share information in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of Him Parivar terms of use, or as otherwise required by law.
                                   <br /><br /><strong>Cookies:</strong>{"Cookies"} are small pieces of information sent by a web server to a web browser, which enables the server to collect information from the browser. Him Parivar uses cookies for a number of purposes, for instance, to enable us to simplify the logging on process for registered users, to help ensure the security and authenticity of registered users, to provide the mechanisms for online shopping and to enable traffic monitoring. We use both session ID cookies and/or persistent cookies. We use session cookies to make it easier for you to navigate our site. A session ID cookie expires when you close your browser. A persistent cookie remains on your hard drive for an extended period of time. You can remove persistent cookies by following directions provided in your Internet browsers help file. Persistent cookies also enable us to track and target the interests of our users to enhance the experience on our site. Most browsers allow you to turn off the cookie function. If you want to know how to do this please look at the help menu on your browser. As described above this will restrict the Him Parivar services you can use.
                                   <br /><br /><strong>Security:</strong> The security of your personal information is very important to us. When you enter sensitive information (such as a credit card number) on our order forms, we encrypt that information using secure socket layer technology (SSL). Once we received the data it is immediately re-encrypted prior to storage. By default, payment card data is permanently destroyed within next day of submission. We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. No method of transmission over the Internet, or method of electronic storage, is 100% secure, however. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                                   <br /><br /><strong>Changes in this Privacy Statement:</strong> Him Parivar reserve the right to modify this privacy statement at any time, so please review it time to time. If we make material changes to this policy, we will notify you here.
 */}
						<strong>Privacy Policy</strong>
						<br />
						Him Parivar is committed to protecting your privacy. This Privacy
						Policy explains our data processing practices and your options
						regarding the ways in which your personal data is used. If you have
						any questions or concerns about your personal information, please
						contact us at himparivar.hp.gov.in or sso.hp.gov.in. Please note
						that the practices of Him Parivar with respect to data collected and
						used by Him Parivar only in connection with this website with links
						to this policy are governed by Him Parivar privacy policy (Privacy
						Policy) as amended from time to time and not the privacy policy in
						effect at the time the data was collected. Please regularly review
						our Privacy Policy. If you have objections to the Privacy Policy,
						you can immediately contact us.
						<br />
						<strong>Information collected:</strong> Him Parivar collects the
						details provided by you on registration (either using Him Parivar
						portal or through Him Access Portal) together
						with information we learn about you from your use of our service and
						your visits to our website. We also collect information about the
						transactions you undertake including details of payment cards used.
						We may collect additional information in connection with your
						participation in any promotions or competitions offered by us and
						information you provide when giving us feedback or completing
						profile forms. We also monitor customer traffic patterns and site
						usage which enables us to improve the services we provide.
						<br />
						Use of your information and your preferences: We will use your
						information to provide and personalize our service. We will also use
						your contact details to regularly communicate with you. We may use
						your information to send you to offer and news from Him Parivar and
						services, for this we may contact you by post, email, or telephone
						for these purposes. We like to hear your views to help us improve
						our service.
						<br />
						<strong>Disclosures of your information:</strong> Your information
						will be used by only at Him Parivar. We will never pass your
						personal data to anyone else, except for any successors to our
						business. We may also use and disclose information in aggregate (so
						that no individual customers are identified) for marketing programs,
						advertisers, and partners. Him Parivar does not provide any personal
						information to the advertiser when you interact with or view a
						targeted ad. However, by interacting with or viewing an ad you are
						consenting to the possibility that the advertiser will make the
						assumption that you meet the targeting criteria used to display the
						ad. We may transfer information about you if Him Parivar is acquired
						by or merged with another agency. In this event, Him Parivar will
						notify you before information about you are transferred and becomes
						subject to a different privacy policy by updating this page.
						<br />
						Legal Disclaimer: We reserve the right to disclose your personally
						identifiable information as required by law and when believe it is
						necessary to share information in order to investigate, prevent, or
						take action regarding illegal activities, suspected fraud,
						situations involving potential threats to the physical safety of any
						person, violations of Him Parivar terms of use, or as otherwise
						required by law.
						<br />
						{/* <strong>Cookies: </strong>Cookies are small pieces of information sent by a web server to a web browser, which enables the server to collect information from the browser. Him Parivar uses cookies for a number of purposes, for instance, to enable us to simplify the logging on process for registered users, to help ensure the security and authenticity of registered users, to provide the mechanisms for online shopping and to enable traffic monitoring. We use both session ID cookies and/or persistent cookies. We use session cookies to make it easier for you to navigate our site. A session ID cookie expires when you close your browser. A persistent cookie remains on your hard drive for an extended period of time. You can remove persistent cookies by following directions provided in your Internet browsers help file. Persistent cookies also enable us to track and target the interests of our users to enhance the experience on our site. Most browsers allow you to turn off the cookie function. If you want to know how to do this please look at the help menu on your browser. As described above this will restrict the Him Parivar services you can use.<br /> */}
						<strong>Security:</strong> The security of your personal information
						is very important to us. When you enter sensitive information (such
						as a credit card number) on our order forms, we encrypt that
						information using secure socket layer technology (SSL). Once we
						received the data it is immediately re-encrypted prior to storage.
						By default, payment card data is permanently destroyed within next
						day of submission. We follow generally accepted industry standards
						to protect the personal information submitted to us, both during
						transmission and once we receive it. No method of transmission over
						the Internet, or method of electronic storage, is 100% secure,
						however. Therefore, while we strive to use commercially acceptable
						means to protect your personal information, we cannot guarantee its
						absolute security.
						<br />
						Changes in this Privacy Statement: Him Parivar reserve the right to
						modify this privacy statement at any time, so please review it time
						to time. If we make material changes to this policy, we will notify
						you here.
						<br />
					</Typography>
				</Grid>
			</Container>

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
		</>
	);
};

export default withUserCheck(Registration);
