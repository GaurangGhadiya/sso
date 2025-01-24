import { AccountCircle, CompareArrows, Inbox, Login, Mail, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Menu, Button, IconButton, MenuItem, Stack, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, Drawer, Snackbar, Alert } from "@mui/material";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import { getImagePath } from "../../../utils/CustomImagePath";

const HeaderGovUser = () => {


    const route = useRouter();
    const [name, setName] = useState('');
    const [GovEmail, setGovEmail] = useState('');

    const [anchorEl, setAnchorEl] = useState(null);
    const [sideBar, setSideBar] = useState(false);
    const [device, setDevice] = useState('desktop');

    const [alert, setAlert] = useState({ open: false, type: false, message: null });


    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const encryptedData = Cookies.get('govEnc');


        let userInfo = "";
        if (encryptedData) {
            try {
                userInfo = JSON.parse(atob(encryptedData));

            }
            catch (e) {
                console.warn(e, "awewad")
            }

            setName(userInfo.name);
            setGovEmail(userInfo.userName)
        }
        else {
            route.push('./login')
        }

    }, [])




    const logOut = () => {

        handleClose();


        window.location.href = 'https://sso.hp.gov.in/official/site/logout?onboardingapp=himparivarsso';


        // Cookies.remove('name');
        // Cookies.remove('uid');
        // Cookies.remove('role');

        // route.push('/login')

    }




    useEffect(() => {

        const getDevice = async () => {
            try {
                const response = await fetch(getImagePath('/api/check-device'));

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                setDevice(data.device);

            } catch (error) {
                console.warn("error")
            }
        }

        getDevice();

    }, [])


    const selector = useSelector(state => state.AlertHandler);

    const dispatch = useDispatch();

    useEffect(() => {

        if (selector.type) {
            setAlert({ open: true, type: selector.type === 'success' ? true : false, message: selector.message });
        }

    }, [selector])

    const handleCloseAll = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });

        dispatch(callAlert({ message: null, type: 'CLEAR' }))

    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>

                <Drawer variant="temporary"
                    anchor="left"
                    PaperProps={{
                        style: {
                            backgroundColor: '#1976d2', // Set your desired background color here
                            boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.2)',
                            width: '240px',
                            overflow: 'hidden'
                        },
                    }}
                    open={sideBar}
                    ModalProps={{
                        BackdropProps: {
                            onClick: () => setSideBar(false)
                        }
                    }}
                >
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} bgcolor={'#fff'} height={'62px'}>
                        <Typography variant="h6" style={{ textAlign: 'center' }}>
                            HP Him Access
                        </Typography>
                    </Box>
                    <List>

                        <ListItem onClick={() => route.push('/dashboard')} button sx={{ backgroundColor: route.pathname === '/dashboard' && '#09539d' }}>
                            <ListItemIcon>
                                <Inbox style={{ color: '#fff' }} />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" style={{ color: '#fff' }} />
                        </ListItem>

                        <ListItem onClick={() => route.push('/transaction-history')} button sx={{ backgroundColor: route.pathname === '/transaction-history' && '#09539d' }}>
                            <ListItemIcon>
                                <CompareArrows style={{ color: '#fff' }} />
                            </ListItemIcon>
                            <ListItemText primary="Transaction History" style={{ color: '#fff' }} />
                        </ListItem>


                    </List>
                </Drawer>


                <AppBar position="static">
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
                            <Link href="/">
                                <Image src="/Himachal_Pradesh.png" width="70" height="50" alt="Himachal Pradesh Logo" />
                            </Link>
                        </Box>


                        {device === 'desktop' ? (
                            <Typography onClick={() => route.push('/')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Him Access
                            </Typography>
                        ) : (
                            <Typography onClick={() => route.push('/')} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                HP Him Access
                            </Typography>
                        )}


                        {name ? (
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
                            <Link href="/login">
                                <Button sx={{ color: '#fff' }} onClick={handleMenuClick}>
                                    <Login sx={{ marginRight: 1 }} /> Login
                                </Button>
                            </Link>
                        )}



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


            <Snackbar
                open={alert.open}
                autoHideDuration={2000}
                onClose={handleCloseAll}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={alert.type === true ? 'success' : 'error'}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    )
}
export default HeaderGovUser;