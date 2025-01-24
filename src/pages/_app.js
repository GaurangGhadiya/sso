import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "../../store";
import DisableCopyPasteRightClick from "../components/UI/DisableCopyPasteRightClick";
import AntdStyledComponentsRegistry from "../../utils/AntdStyledComponentsRegistry";

import { ConfigProvider } from "antd";

import antdLocaleEnUS from "antd/lib/locale/en_US";

export default function App({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<ConfigProvider
				theme={{
					token: {
						fontSize: 16,
						colorPrimary: "#1876D1",
					},
				}}
				locale={antdLocaleEnUS}
			>
				{/* <AntdStyleProvider> */}
				<DisableCopyPasteRightClick />
				<Component {...pageProps} />
			</ConfigProvider>

			{/* </AntdStyleProvider> */}
		</Provider>
	);
}
