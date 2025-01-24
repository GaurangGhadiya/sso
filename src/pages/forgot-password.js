import ForgotPassword from "@/components/Login/forgot-password";
import HeaderUser from "@/components/UI/HeaderUser";
import Footer from "@/components/UI/Homepage/Footer";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Forgot = () => {
	return (
		<>
			<HeaderUser />
			<ForgotPassword service_id={"10000046"} />

			{/* <div style={{ backgroundColor: '#00293a', padding: '20px', color: '#fff', textAlign: 'center' }}>
                <p style={{ margin: 0 }}>Site designed, developed & hosted by Department of Digital Technologies & Governance, Himachal Pradesh</p>
            </div> */}

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
export default Forgot;
