import {
  AccountCircle,
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
import { usePathname } from "next/navigation";
import ListItemButton from "@mui/material/ListItemButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AppLogo from "../../../public/Himachal_Pradesh.png";

const drawerWidth = 260;

let drawerArray = [
  { redirect: "department/dashboard", name: "Dashboard" },
  { redirect: "department/department-service", name: "Add Service" },
  { redirect: "department/registered-services", name: "View Service" },
  { redirect: "api-documentation", name: "API Documentation" },
  { redirect: "/department/secret-key", name: "Secret Key" },
];
const Header = (props) => {
  const router = useRouter();
  const route = useRouter();

  const { window } = props;

  const { children } = props;

  const [department, setDepartment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sideBar, setSideBar] = useState(false);
  const [device, setDevice] = useState("desktop");
  const pathName = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
    const dept = Cookies.get("department");
    setDepartment(dept);
  }, []);

  const logOut = () => {
    handleClose();

    Cookies.remove("department");
    Cookies.remove("uid");
    Cookies.remove("role");

    route.push("/department-login");
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

  const drawer = (
    <div style={{}}>
      <Toolbar></Toolbar>

      {/* <Toolbar /> */}
      {/* <Divider /> */}
      <List style={{ marginTop: 20 }}>
        {drawerArray &&
          drawerArray.map((item, index) => (
            <ListItem
              key={item.redirect}
              disablePadding
              sx={{
                borderRight: pathName.startsWith("/" + item.redirect)
                  ? "3px solid #1976d2   "
                  : "0px solid #FFFFFF",
              }}
              className={
                pathName.startsWith("/" + item.redirect)
                  ? " text-[#1976d2 ] bg-[#f2f5f9] bg-white"
                  : "text-slate-700"
              }
              // style={{ color: pathName.startsWith("/" + text.toLowerCase()) ? "text-sky-600 bg-slate-100" : "text-slate-700" }}

              onClick={() => router.push("/" + item.redirect)}
            >
              <ListItemButton>
                <ListItemIcon
                  // className={pathName.startsWith("/" + text.toLowerCase()) ? "bg-[#e6f5ff] bg-white" : "text-slate-700"}
                  className={
                    pathName.startsWith("/" + item.redirect)
                      ? "text-[#1976d2]"
                      : "text-slate-700"
                  }
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    transition: "color 0.3s", // Add a smooth color transition effect
                    "&:hover": {
                      color: "#1976d2", // Change the text color on hover
                    },
                  }}
                  primaryTypographyProps={{ fontSize: "14px" }}
                  primary={item.name}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* <Drawer
					variant="temporary"
					anchor="left"
					PaperProps={{
						style: {
							backgroundColor: "#1976d2",
							boxShadow: "2px 0px 10px rgba(0, 0, 0, 0.2)",
							width: "240px",
							overflow: "hidden",
						},
					}}
					open={sideBar}
					ModalProps={{
						BackdropProps: {
							onClick: () => setSideBar(false),
						},
					}}
				>
					<Box
						display={"flex"}
						alignItems={"center"}
						justifyContent={"center"}
						bgcolor={"#fff"}
						height={"62px"}
					>
						<Typography variant="h6" style={{ textAlign: "center" }}>
							HP Him Access
						</Typography>
					</Box>
					<List>
						<ListItem
							onClick={() => route.push("/department/dashboard")}
							button
							sx={{
								backgroundColor:
									route.pathname === "/department/dashboard" && "#09539d",
							}}
						>
							<ListItemIcon>
								<Inbox style={{ color: "#fff" }} />
							</ListItemIcon>
							<ListItemText primary="Dashboard" style={{ color: "#fff" }} />
						</ListItem>

						<ListItem
							onClick={() => route.push("/department/department-service")}
							button
							sx={{
								backgroundColor:
									route.pathname === "/department/department-service" &&
									"#09539d",
							}}
						>
							<ListItemIcon>
								<Mail style={{ color: "#fff" }} />
							</ListItemIcon>
							<ListItemText primary="Add Service" style={{ color: "#fff" }} />
						</ListItem>

						<ListItem
							onClick={() => route.push("/department/registered-services")}
							button
							sx={{
								backgroundColor:
									route.pathname === "/department/registered-services" &&
									"#09539d",
							}}
						>
							<ListItemIcon>
								<Mail style={{ color: "#fff" }} />
							</ListItemIcon>
							<ListItemText primary="View Service" style={{ color: "#fff" }} />
						</ListItem>
					</List>
				</Drawer> */}

        <AppBar
          position="fixed"
          enableColorOnDark={false}
          sx={{
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "#1976d2",
            color: "#FFF",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
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

            <Box mr={2}>
              <Link href="/department">
                <Image
                  src={AppLogo}
                  width="70"
                  height="50"
                  alt="Himachal Pradesh Logo"
                />
              </Link>
            </Box>

            {device === "desktop" ? (
              //  <Typography onClick={() => route.push('/department')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
              //     Him Access
              // </Typography>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Him Access
              </Typography>
            ) : (
              //     <Typography onClick={() => route.push('/department')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
              //     HP Him Access
              // </Typography>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                HP Him Access
              </Typography>
            )}

            {department ? (
              <Stack direction={"row"} spacing={2}>
                <Button color="inherit" onClick={handleMenuClick}>
                  <AccountCircle sx={{ marginRight: 1 }} /> {department}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => route.push("/department/secret-key")}
                  >
                    Secret Key
                  </MenuItem>
                  <MenuItem onClick={logOut}>Logout</MenuItem>
                </Menu>
              </Stack>
            ) : (
              <Link href="/department-login">
                <Button sx={{ color: "#fff" }} onClick={handleMenuClick}>
                  <Login sx={{ marginRight: 1 }} /> Login
                </Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>
        {department && (
          <>
            {" "}
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    borderWidth: 0,
                  },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                  style: {
                    backgroundColor: "#FFFFFF", // Set your desired background color here
                    // boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.2)',
                    overflow: "hidden",
                  },
                }}
                sx={{
                  display: { xs: "none", sm: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    borderWidth: 0,
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              sx={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f2f5f9",
                margin: 0,
                padding: 0,
                borderRadius: 5,
              }}
            >
              <Toolbar />

              {/* <React.Suspense fallback={<Loading />}>{children}</React.Suspense> */}

              <main className="flex-none transition-all">{children}</main>

              <div className="footer" style={{ justifyContent: "center" }}>
                <p style={{ textAlign: "center" }}>
                  Site designed, developed & hosted by Department of Digital
                  Technologies & Governance, Himachal Pradesh
                </p>
              </div>
            </Box>
          </>
        )}

        {department && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, borderRadius: 0 }}
            onClick={() => setSideBar(!sideBar)}
            className={style.menuIconDesign}
            style={{
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              display: "fixed",
              color: "#fff",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {alert.message && (
        <AlertModal alert={alert} handleClose={handleCloseAll} />
      )}
    </>
  );
};
export default Header;
