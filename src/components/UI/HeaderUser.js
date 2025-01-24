import {
	AccountCircle,
	CompareArrows,
	Inbox,
	Login,
	Mail,
	Menu as MenuIcon,
} from "@mui/icons-material";
import {
	AppBar,
	Box,
	Menu,
	Button,
	IconButton,
	MenuItem,
	Stack,
	Toolbar,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Drawer,
	Snackbar,
	Alert,
} from "@mui/material";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import { getImagePath } from "../../../utils/CustomImagePath";
import AlertModal from "../AlertModal";

const HeaderUser = ({ showLogin, is_iframe, service_id }) => {
	const route = useRouter();
	const [name, setName] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [sideBar, setSideBar] = useState(false);
	const [device, setDevice] = useState("desktop");

	const [alert, setAlert] = useState({
		open: false,
		type: false,
		message: null,
	});

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		const dept = Cookies.get("name");
		setName(dept);
	}, []);

	const logOut = () => {
		handleClose();

		Cookies.remove("name");
		Cookies.remove("uid");
		Cookies.remove("role");

		route.push("/login");
	};

	useEffect(() => {
		const getDevice = async () => {
			try {
				const response = await fetch(getImagePath("/api/check-device"));

				if (!response.ok) {
					return;
				}

				const data = await response.json();

				setDevice(data.device);
			} catch (error) {}
		};

		getDevice();
	}, []);

	const selector = useSelector((state) => state.AlertHandler);

	const dispatch = useDispatch();

	useEffect(() => {
		if (selector.type) {
			setAlert({
				open: true,
				type: selector.type === "success" ? true : false,
				message: selector.message,
			});
		}
	}, [selector]);

	const handleCloseAll = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setAlert({ open: false, type: false, message: null });

		dispatch(callAlert({ message: null, type: "CLEAR" }));
	};

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar style={{ height: 50, background: "#1976d2" }} position="fixed">
					<Toolbar>
						{/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setSideBar(!sideBar)}
                    >
                        <MenuIcon />
                    </IconButton> */}

						<Box mr={2} style={{ marginBottom: 5 }}>
							<>
								{is_iframe ? (
									<Link href={`/login-iframe?service_id=${service_id}`}>
										<Image
											src={getImagePath("/Himachal_Pradesh.png")}
											width="45"
											height="30"
											alt="Himachal Pradesh Logo"
										/>
									</Link>
								) : (
									<Link href="/">
										<Image
											src={getImagePath("/Himachal_Pradesh.png")}
											width="45"
											height="30"
											alt="Himachal Pradesh Logo"
										/>
									</Link>
								)}
							</>
						</Box>

						{device === "desktop" ? (
							//  <Typography onClick={() => route.push('/')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
							//     Him Access
							// </Typography>

							<Typography component="div" sx={{ flexGrow: 1, marginBottom: 1 }}>
								Him Access
							</Typography>
						) : (
							<Typography component="div" sx={{ flexGrow: 1 }}>
								HP Him Access
							</Typography>
						)}

						{/* {name ? (
                            <Stack direction={'row'} spacing={2}>
                                <Button color='inherit' onClick={handleMenuClick}>
                                    <AccountCircle sx={{ marginRight: 1 }} /> {name}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={logOut}>Logout</MenuItem>
                                </Menu>
                            </Stack>
                        ) : (
                            <>
                                {showLogin && (
                                    <Link href="/login">
                                        <Button sx={{ color: '#fff' }} onClick={handleMenuClick}>
                                            <Login sx={{ marginRight: 1 }} /> Login
                                        </Button>
                                    </Link>
                                )}
                            </>

                        )} */}
					</Toolbar>
				</AppBar>

				{/* {name && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, borderRadius: 0 }}
                        onClick={() => setSideBar(!sideBar)}
                        className={style.menuIconDesign}
                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', display: 'fixed', color: '#fff' }}
                    >
                        <MenuIcon />
                    </IconButton>
                )} */}
			</Box>

			{alert.message && (
				<AlertModal alert={alert} handleClose={handleCloseAll} />
			)}
		</>
	);
};
export default HeaderUser;
