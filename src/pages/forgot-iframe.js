import LoginPage from "@/components/Login/LoginPage";
import Header from "@/components/UI/Header";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
import LoginPageOpenIframe from "@/components/Login/LoginPageOpenIframe";
import { useEffect, useState } from "react";
import ForgetIframe from "./ForgetIframe";

const ForgetOpenIframe = () => {
	const router = useRouter();
	const [iframeKey, setIframeKey] = useState(0);

	let url = "https://sso.hp.gov.in/login-iframe?service_id=";

	const { service_id, login_type } = router.query;

	return (
		<>
			<div style={{ marginTop: 24 }}>
				<ForgetIframe service_id={service_id} login_type={login_type} />
			</div>
		</>
	);
};
export default ForgetOpenIframe;
