import {
	Box,
	Container,
	Divider,
	Typography,
	Paper,
	Tab,
	Grid,
	useMediaQuery,
	Button,
	Card,
	Avatar,
	AppBar,
	Toolbar,
	Stack,
	TextField,
	FormControl,
	Input,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	Alert,
	Snackbar,
	Backdrop,
	CircularProgress,
	FormControlLabel,
	Radio,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserName from "../components/Login/UserName";
import MobileLogin from "../components/Login/MobileLogin";
import Link from "next/link";
import style from "../components/Login/Login.module.css";
import classNames from "classnames";
import {
	Login,
	RadioButtonChecked,
	RadioButtonUnchecked,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import Image from "next/image";
import AadhaarLogin from "../components/Login/AadhaarLogin";
import ParichayLogin from "../components/Login/ParichayLogin";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";

import Tabs from "@mui/material/Tabs";
import { getImagePath } from "../../utils/CustomImagePath";
import HeaderUser from "@/components/UI/HeaderUser";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

import CryptoJS from "crypto-js";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import CommentIcon from "@mui/icons-material/Comment";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CallIcon from "@mui/icons-material/Call";

import { useRouter } from "next/router";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import api from "../../utils/api";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "@mui/material/Modal";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import Cookies from "js-cookie";
import AlertModal from "@/components/AlertModal";
import { encryptBody } from "../../utils/globalEncryption";
import expirationDate from "../../utils/cookiesExpire";

const Root = styled("div")(({ theme }) => ({
	width: "100%",
	...theme.typography.body2,
	"& > :not(style) ~ :not(style)": {
		marginTop: theme.spacing(2),
	},
}));
const listItemStyle = {
	border: "1px solid #000", // Initial border
	marginBottom: 8,
	borderRadius: "4px", // Initial border radius
	transition: "border 0.3s ease-in-out", // Adding transition for a smooth effect
};

const modalstyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 300,
	bgcolor: "background.paper",
	border: "1px solid #000",
	boxShadow: 24,
	p: 4,
};

const handleHover = (event) => {
	event.currentTarget.style.border = "1px solid #2196f3"; // Change border on hover
	event.currentTarget.style.borderRadius = "4px"; // Add border-radius for a smoother look
};

const handleHoverExit = (event) => {
	event.currentTarget.style.border = "none"; // Remove border on hover exit
};

const MultipleAccountsSSO = () => {
	const [value, setValue] = useState("1");
	const [valueMaster, setValueMaster] = useState("1");
	const [checked, setChecked] = useState([]);

	const [userList, setuserList] = useState([]);

	const [allUsers, setallUsers] = useState([]);

	const [redirectionDetails, setredirectionDetails] = useState();

	const [selectedItem, setSelectedItem] = useState(null);

	const [selectedIndex, setSelectedIndex] = useState();

	// const [sso_id, setSsoId] = useState();

	const [loading, setLoading] = useState(false);

	const [selectedValueIndex, setselectedValueIndex] = useState();

	// const [primaryDetail, setprimaryDetail] = useState({});

	// const [dataObjecttoSend, setdataObjecttoSend] = useState({});

	const [password, setPassword] = useState("");
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSnackClose = () =>
		setAlert({ open: false, type: false, message: "" });
	const router = useRouter();
	let service_id = router.query.service_id ? router.query.service_id : "";
	let user_accounts = router.query.user_accounts
		? router.query.user_accounts
		: "";
	let user_name = router.query.username ? router.query.username : "";

	let redirection_details = router.query.redirection_details
		? router.query.redirection_details
		: "";

	const handleRadioChange = (index, item) => {
		setSelectedItem(index);
		setSelectedIndex(item);
	};

	const handleCheckboxChange = (index) => (event) => {
		const newData = [...userList];

		if (value.password_validated) {
			newData[index].is_mapped = !newData[index].is_mapped;
			newData[index].password_validated = !newData[index].password_validated;

			setuserList(newData);
		} else {
			setSelectedIndex(newData[index]);
			setselectedValueIndex(index);
			setOpen(true);
		}
	};

	useEffect(() => {
		if (redirection_details) {
			try {
				let redirection = JSON.parse(redirection_details);
				setredirectionDetails(redirection);
			} catch (error) {}

			try {
				let users = JSON.parse(user_accounts);
				setuserList(users?.multipleUser);
			} catch (error) {}
		}
	}, []);

	const LoginwithAccount = async () => {
		const userDetails = await fetch(getImagePath("/api/user-info"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const userDetail = await userDetails.json();
		const reqData = {
			user_id: selectedIndex.id,
			BrowserDetails: userDetail,
			service_id: service_id,
		};

		try {
			const response = await api.post("/check-secondary-mapping", { data: encryptBody(JSON.stringify(reqData)) });

			if (response.status == 200 || response.status == "OK") {
				let url = "";
				const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
				var decr = CryptoJS.AES.decrypt(response?.data?.data, secretKey);
				decr = decr.toString(CryptoJS.enc.Utf8);

				let data = {};

				if (decr) {
					try {
						let json_data = JSON.parse(decr);
						data = json_data;

						const { secondaryMapping, redirect, sso_id } = data || {};

						if (secondaryMapping && secondaryMapping.length > 0) {
							const peram = `?service_id=${service_id ? service_id : ""
								}&sso_id=${sso_id}&mapped_list=${secondaryMapping
									? JSON.stringify(secondaryMapping)
									: JSON.stringify({})
								}&redirection_details=${redirect ? JSON.stringify(redirect) : JSON.stringify({})
								}`;
							router.push("/mapping" + peram);
						} else {
							if (secondaryMapping.length === 0) {
								Cookies.set("role", "user", { expires: expirationDate });
								Cookies.set("uid", redirect.user.id, { expires: expirationDate });
								Cookies.set("name", redirect.user.name, { expires: expirationDate });

								router.push("/dashboard");
							}
						}


					} catch (e) {
						console.warn(e)
					}
				}



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
					// setAlert({ open: true, type: false, message: error.response.data.error });
				}
			}
		}
	};

	return (
		<div>
			<HeaderUser />

			<div className="centered-div">
				<Box className={style.fullbg}></Box>

				<Container sx={{ marginTop: 1, marginBottom: 1, position: "relative" }}>
					<Box className={style.backdrop} />

					<Grid
						container
						justifyContent="center" // Centers horizontally
						alignItems="center" // Centers vertically
					>
						<Paper
							sx={{
								borderBottom: "5px solid #1876D0",
								borderTop: "5px solid #1876D0",
							}}
							elevation={20}
							style={{
								display: "flex",
								borderRadius: 10,
								width: 400,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Grid
								container
								style={{
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Grid container spacing={1} style={{ marginTop: 1 }}>
									<Grid item ml={2} mt={1}></Grid>

									<Grid item ml={4}>
										<Image
											src={getImagePath("/Himachal_Pradesh.png")}
											width="45"
											height="30"
											alt="Himachal Pradesh Logo"
										/>
									</Grid>
									<Grid item>
										<Typography
											textAlign={"center"}
											style={{
												color: "#015788",
												marginTop: 10,
												fontWeight: 500,
												fontSize: 18,
											}}
										>
											Himachal Pradesh Dingle Sign On
										</Typography>
									</Grid>
								</Grid>

								<Grid container spacing={1} style={{}}>
									<Grid item ml={2}>
										<Typography
											textAlign={"flex-start"}
											style={{
												color: "#015788",
												marginTop: 10,
												fontWeight: 500,
												fontSize: 12,
											}}
										>
											Dear{" "}
											<span style={{ color: "green", fontWeight: 700 }}>
												{user_name ? user_name : "User"}
											</span>{" "}
											,
										</Typography>

										<Typography
											textAlign={"flex-start"}
											style={{
												color: "#015788",
												marginTop: 10,
												fontWeight: 500,
												fontSize: 12,
											}}
										>
											<span
												style={{ color: "red", fontWeight: 700, fontSize: 12 }}
											>{`This mobile / email is associated with multiple accounts, please select one to Sign in.`}</span>
											<br />

											{/* <span style={{ fontWeight: 500, fontSize: 12, }}>Thank you for your co-operation</span> */}
										</Typography>
									</Grid>
									<Grid item></Grid>
								</Grid>

								<List
									sx={{
										width: "100%",
										bgcolor: "background.paper",
										maxHeight: 300,
										overflow: "auto",
										marginLeft: 2,
										marginRight: 2,
									}}
								>
									{userList &&
										userList.map((value, index) => {
											const labelId = `checkbox-list-label-${value}`;

											return (
												<ListItem
													key={index}
													style={listItemStyle}
													// onMouseEnter={handleHover}
													// onMouseLeave={handleHoverExit}

													// secondaryAction={
													//      <IconButton edge="end" aria-label="comments">
													//           <CommentIcon />
													//      </IconButton>
													// }
													disablePadding
												>
													<ListItemButton
														key={index}
														role={undefined}
														onClick={() => handleRadioChange(index, value)}
														dense
													>
														<ListItemIcon>
															<Radio
																checked={selectedItem === index}
																color="primary"
																name="radio-button-demo"
															/>
															{/* <Checkbox
                                                                                                                                                                        edge="start"
                                                                                                                                                                        // checked={checked.indexOf(value) !== -1}
                                                                                                                                                                        checked={value.is_mapped}
                                                                                                                                                                        tabIndex={-1}
                                                                                                                                                                        disableRipple
                                                                                                                                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                                                                                                                            /> */}
														</ListItemIcon>
														<Stack
															key={index}
															direction="column"
															spacing={1}
															alignItems="flex-start"
														>
															<Stack
																key={index}
																direction="row"
																spacing={1}
																alignItems="flex-start"
															>
																<AccountCircleIcon
																	fontSize="small"
																	color="warning"
																/>

																<ListItemText
																	primaryTypographyProps={{
																		style: { fontSize: "12px" },
																	}} // Change primary text font size
																	id={labelId}
																	primary={value.name}
																/>
															</Stack>
															<Stack
																direction="row"
																spacing={1}
																alignItems="flex-start"
															>
																<CallIcon fontSize="small" color="info" />
																<ListItemText
																	primaryTypographyProps={{
																		style: { fontSize: "12px" },
																	}}
																	id={labelId}
																	primary={value.mobile}
																/>
															</Stack>

															<Stack
																direction="row"
																spacing={1}
																alignItems="flex-start"
															>
																<EmailIcon fontSize="small" color="success" />
																<ListItemText
																	primaryTypographyProps={{
																		style: { fontSize: "12px" },
																	}}
																	id={labelId}
																	primary={value.email ? value.email : "N.A"}
																/>
															</Stack>

															{value.is_mapped && (
																<Stack
																	direction="row"
																	spacing={1}
																	justifyContent={"flex-end"}
																	alignContent={"flex-end"}
																>
																	<CheckCircleIcon
																		fontSize="small"
																		color="success"
																	/>
																	<Typography
																		style={{ fontSize: 11, color: "green" }}
																	>
																		Account Verified & mapped with HP Him Access
																	</Typography>
																	{/* <AccountCircleIcon color="warning" /> */}
																	{/* <ListItemText style={{ fontSize: '8px' }} id={labelId} primary={"Mapped with Him Access"} /> */}
																</Stack>
															)}
														</Stack>
													</ListItemButton>
												</ListItem>
											);
										})}
								</List>

								<Grid
									container
									spacing={0}
									justifyContent={"center"}
									mb={2}
									mt={2}
									ml={1}
									mr={1}
								>
									<Button
										fullWidth
										style={{ background: "green" }}
										onClick={() => LoginwithAccount()}
										variant="contained"
									>
										CONTINUE
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Container>

				{alert.message && (
					<AlertModal alert={alert} handleClose={handleSnackClose} />
				)}

				{/* <AppBar style={{ height: 40, background: "#015788" }} position="fixed" sx={{ top: 'auto', bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                         <Typography align="center" style={{ fontSize: 12, flex: 1 }} mb={2} >
                              Site designed, developed & hosted by Department of Digital Technologies & Governance, Himachal Pradesh
                         </Typography>
                    </Toolbar>
               </AppBar> */}
			</div>

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
		</div>
	);
};
export default MultipleAccountsSSO;
