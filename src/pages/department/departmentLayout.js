import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppLogo from "../../../public/Himachal_Pradesh.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, Menu, MenuItem, Stack } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Cookies from "js-cookie";

import { SupervisedUserCircleOutlined } from "@mui/icons-material";
import { Avatar, Card, CardContent } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../../../utils/api";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";

const drawerWidth = 260;

let drawerArray = [
  { redirect: "department/dashboard", name: "Dashboard" },
  { redirect: "department/department-service", name: "Add Service" },
  { redirect: "department/registered-services", name: "View Service" },
  { redirect: "api-documentation", name: "API Documentation" },
  { redirect: "/department/secret-key", name: "Secret Key" },
];

const FireNav = styled(List)({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
});

function DashboardLayout(props) {
  const { window } = props;
  const { children } = props;

  const router = useRouter();

  const pathName = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [username, setUsername] = React.useState("");

  const [profileDetails, setProfileDetails] = React.useState({});
  const [address, setAddress] = React.useState("");

  const uid = Cookies.get("uid");

  useEffect(() => {
    // const getUlbData = getUlb();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    Cookies.remove("department");
    Cookies.remove("uid");

    let role = Cookies.get("role");

    Cookies.remove("role");

    router.push("/department-login");
  };

  const getProfile = async () => {
    const reqData = {
      user_id: uid,
    };

    try {
      const response = await api.post("/citizen-details", { data: encryptBody(JSON.stringify(reqData)) });

      if (response.status === 200) {

        const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

        var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
        decr = decr.toString(CryptoJS.enc.Utf8);

        // const encryptedData = CryptoJS.AES.decrypt(
        // 	response.data,
        // 	secretKey
        // ).toString();

        let data = {};

        if (decr) {
          try {
            let json_data = JSON.parse(decr);
            data = json_data;


            setProfileDetails(data);

            if (data) {
              const { co, dist, vtc } = data || {};
              let add = co ? co : "";

              if (dist) {
                add = add + ", " + dist;
              }
              if (vtc) {
                add = add + ", " + vtc;
              }

              setAddress(add);
            }


          } catch (e) {
            console.warn(e);
          }
        }



      }
    } catch (error) {
      if (error?.response?.data?.error) {
      } else {
      }
    }
  };

  useEffect(() => {
    getProfile();

    // const getUlbData = getUlb();
  }, []);

  const handleProfile = () => {
    setAnchorEl(null);
    router.push("/profile");
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

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
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
        <Toolbar elevation={0}>
          <Box sx={{ mr: 2, display: { xs: "none", md: "block" } }}>
            <Image src={AppLogo} width={50} height={30} alt="Logo" />
          </Box>

          <Typography
            variant="h6"
            sx={{ mr: 2, display: { xs: "none", md: "block" } }}
            noWrap
            component="div"
            marginLeft={2}
          >
            Him Access
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ mr: 2, display: { xs: "block", md: "none" } }}>
            <Image src={AppLogo} width={50} height={30} alt="Logo" />
          </Box>

          <Typography
            variant="h6"
            sx={{ mr: 2, display: { sm: "none" } }}
            noWrap
            component="div"
            marginLeft={2}
          >
            HP Him Access (Him Access)
          </Typography>

          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}></Box>

          <div>
            <IconButton
              aria-controls="user-profile-menu"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="user-profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfile}>
                <Avatar
                  sx={{ width: 66, height: 66 }}
                  style={{ background: "#1976d2" }}
                  alt={profileDetails.name ? profileDetails.name : "N.A"}
                  src="/static/images/avatar/1.jpg"
                />

                <div style={{ marginLeft: "10px" }}>
                  <Typography variant="subtitle1">
                    {profileDetails.name ? profileDetails.name : "N.A"}
                  </Typography>
                  <Typography variant="body2">
                    {profileDetails.email ? profileDetails.email : "N.A"}
                  </Typography>
                </div>
              </MenuItem>
              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>

          {/* <Stack direction={'row'} spacing={2}>

                        <Button color='inherit' onClick={handleMenuClick}>
                            <AccountCircleIcon />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={() => {
                                setAnchorEl(null);
                                router.push('profile');
                            }}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>Settings</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Stack>

 */}
        </Toolbar>
      </AppBar>
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
    </Box>
  );
}

export default DashboardLayout;
