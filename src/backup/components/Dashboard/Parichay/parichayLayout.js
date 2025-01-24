import React, { useEffect, useState } from "react";
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
import AppLogo from "../../../../public/Himachal_Pradesh.png";
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
import api from "../../../../utils/api";

const drawerWidth = 260;

let drawerArray = [
  { redirect: "government-employee-dashboard", name: "Dashboard" },
  { redirect: "favourites-parichay-list", name: "Favourites List" },
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

function ParichayLayout(props) {
  const { window: windowScreen } = props;
  const { children } = props;

  const router = useRouter();

  const pathName = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [username, setUsername] = React.useState("");

  const [name, setName] = useState("");
  const [GovEmail, setGovEmail] = useState("");

  useEffect(() => {
    const encryptedData = Cookies.get("govEnc");

    let userInfo = "";
    if (encryptedData) {
      try {
        userInfo = JSON.parse(atob(encryptedData));
      } catch (e) {
        console.warn(e, "awewad");
      }

      setName(userInfo.name);
      setGovEmail(userInfo.userName);
    }
    // getLists("nakulkumar2010@gmail.com")
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    router.push("/profile");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    Cookies.remove("department");
    Cookies.remove("uid");

    let role = Cookies.get("role");
    Cookies.remove("role");

    window.location.href = `https://sso.hp.gov.in/official/site/logout?onboardingapp=himparivarsso&user_name=${GovEmail}`;

    router.push("/login");

    // if (role === "user") {
    //     router.push('/login')

    // }
    // else {
    //     router.push('/department-login')
    // }
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
                  style={{
                    color: pathName.startsWith("/" + item.redirect)
                      ? "#1976d2"
                      : "#000",
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
    windowScreen !== undefined ? () => windowScreen().document.body : undefined;

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
          height: 50,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar elevation={0}>
          <Box sx={{ mr: 2, display: { xs: "none", md: "block" } }} mb={1}>
            <Image src={AppLogo} width={30} height={20} alt="Logo" />
          </Box>

          <Typography
            sx={{ mb: 1, mr: 2, display: { xs: "none", md: "block" } }}
            noWrap
            component="div"
            marginLeft={1}
          >
            Him Access
          </Typography>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mb: 1, mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ mr: 2, display: { xs: "block", md: "none" } }} mb={1}>
            <Image src={AppLogo} width={30} height={20} alt="Logo" />
          </Box>

          <Typography
            sx={{ mb: 1, mr: 2, display: { sm: "none" } }}
            noWrap
            component="div"
          >
            Him Access
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
                  alt={name ? name : "N.A"}
                  src="/static/images/avatar/1.jpg"
                />

                <div style={{ marginLeft: "10px" }}>
                  <Typography variant="subtitle1">
                    {name ? name : "N.A"}
                  </Typography>
                  <Typography variant="body2">
                    {GovEmail ? GovEmail : "N.A"}
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

          {/* <Stack direction={'row'} spacing={2} mb={1}>

                        <Button style={{ fontSize: 12 }} color='inherit' onClick={handleMenuClick}>
                            Logged In User:  {name ? name : "N.A"}
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
                                router.push('/profile');
                            }}>Profile</MenuItem>

                            <MenuItem onClick={() => handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Stack> */}
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

        {/* Footer */}
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
      </Box>
    </Box>
  );
}

export default ParichayLayout;
