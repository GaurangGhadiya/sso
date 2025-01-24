import LoginPage from "@/components/Login/LoginPage";
import Header from "@/components/UI/Header";
import withUserCheck from "../../utils/withUserCheck";
import { useRouter } from "next/router";
import LoginPageOpenIframe from "@/components/Login/LoginPageOpenIframe";
import { useEffect, useState } from "react";
import Registration from "./regFrame";

const RegistrationIframe = () => {
	const router = useRouter();
	const [iframeKey, setIframeKey] = useState(0);

	let url = "https://sso.hp.gov.in/login-iframe?service_id=";

	const {
		service_id,
		is_iframe,
		email_verified,
		mobile_verified,
		umap,
		umap_var,
		username,
		primary_user,
		login_type,
	} = router.query;

	return (
		<>
			<div style={{}}>
				<Registration
					service_id={service_id}
					is_iframe={true}
					umap={umap}
					umap_var={umap_var}
					username={username}
					primary_user={primary_user}
					login_type={login_type}
				/>
			</div>
		</>
	);
};
export default RegistrationIframe;
