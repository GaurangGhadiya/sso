import {
	Box,
	Button,
	Container,
	Grid,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ImageUpload from "./ImageUpload";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import Image from "next/image";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";


const EditService = ({ service_id }) => {
	const router = useRouter();
	const name = useRef();
	const desp = useRef();
	const success_url = useRef();
	const logout_url = useRef();

	const [serviceInfo, setServiceInfo] = useState({
		name: "",
		desp: "",
		success_url: "",
		logout_url: "",
	});

	const [selectedFile, setSelectedFile] = useState(null);
	const [error, setError] = useState({});

	useEffect(() => {
		const getServiceDetails = async () => {
			const reqData = {
				service_id: service_id,
			};

			try {
				const response = await api.post("/get-service-details", { data: encryptBody(JSON.stringify(reqData)) });

				if (response.status === 200) {
					if (response.status === 200 || response.status === "OK") {
						let url = "";
						const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

						var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
						decr = decr.toString(CryptoJS.enc.Utf8);

						let data = {};

						if (decr) {
							try {
								let json_data = JSON.parse(decr);
								data = json_data;

								setServiceInfo({
									name: data?.name,
									desp: data?.desp,
									success_url: data?.success_url,
									logout_url: data?.logout_url,
								});


							} catch (e) {
								console.warn(e)
							}
						}



					}

				}
			} catch (error) {
				if (error?.response?.data?.error) {
					dispatch(
						callAlert({ message: error.response.data.error, type: "FAILED" })
					);
				} else if (error?.response?.data) {
					dispatch(callAlert({ message: error.response.data, type: "FAILED" }));
				} else {
					dispatch(callAlert({ message: error.message, type: "FAILED" }));
				}
			}
		};

		if (service_id) {
			getServiceDetails();
		}
	}, [service_id]);

	const changeHandler = () => {
		setServiceInfo({
			name: name.current.value,
			desp: desp.current.value,
			success_url: success_url.current.value,
			logout_url: logout_url.current.value,
		});
	};

	function isValidURL(url) {
		var urlRegex =
			/^(http[s]?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9.-]*)*\/?$/;

		var httpCheck = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

		return urlRegex.test(url) && httpCheck.test(url);
	}

	const dispatch = useDispatch();

	const submitHandler = async () => {
		const newError = {
			name: name.current.value.length < 1,
			desp: desp.current.value.length < 1,
			success_url: success_url.current.value.length < 1,
			logout_url: logout_url.current.value.length < 1,
		};

		setError(newError);

		if (Object.values(newError).every((value) => value !== true)) {
			const dept_user_id = Cookies.get("uid");

			const formData = new FormData();
			formData.append("name", serviceInfo.name);
			formData.append("desp", serviceInfo.desp);
			formData.append("success_url", serviceInfo.success_url);
			formData.append("logout_url", serviceInfo.logout_url);
			formData.append("dept_user_id", dept_user_id);

			formData.append("service_id", service_id);

			try {
				const response = await api.post("/create-service", formData);

				if (response.status === 200) {
					if (response.status === 200 || response.status === "OK") {
						let url = "";
						const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

						var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
						decr = decr.toString(CryptoJS.enc.Utf8);

						let data = {};

						if (decr) {
							try {
								// let json_data = JSON.parse(decr);
								// data = json_data;

								router.push("/department/registered-services");


							} catch (e) {
								console.warn(e)
							}
						}



					}
				}
			} catch (error) {
				if (error?.response?.data?.error) {
					dispatch(
						callAlert({ message: error.response.data.error, type: "FAILED" })
					);
				} else if (error?.response?.data) {
					dispatch(callAlert({ message: error.response.data, type: "FAILED" }));
				} else {
					dispatch(callAlert({ message: error.message, type: "FAILED" }));
				}
			}
		}
	};

	return (
		<Box mt={5}>
			<Container>
				<Grid spacing={3} container direction={"row"}>
					<Grid item md={12}>
						<Typography variant="h5">Service Registration Form</Typography>
					</Grid>
					<Grid item md={6} xs={12}>
						<Paper>
							<Box p={2}>
								<Typography mb={4} variant="h6">
									Service Information
								</Typography>

								<Stack spacing={2}>
									<TextField
										inputRef={name}
										onChange={changeHandler}
										error={error.name && true}
										fullWidth
										helperText="Service Name"
										value={serviceInfo.name && serviceInfo.name}
										label="Name"
										variant="outlined"
									/>
									<TextField
										inputRef={desp}
										onChange={changeHandler}
										error={error.desp && true}
										fullWidth
										helperText="Service Description"
										value={serviceInfo.desp && serviceInfo.desp}
										label="Description"
										variant="outlined"
									/>
									{/* <ImageUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} /> */}

									{/* <Box height={50} width={50}>
                                        <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads/" + serviceInfo.logo} height={50} width={50} layout="responsive" />
                                    </Box> */}
								</Stack>
							</Box>
						</Paper>
					</Grid>
					<Grid item md={6} xs={12}>
						<Paper>
							<Box p={2}>
								<Typography mb={4} variant="h6">
									Service Related Urls
								</Typography>

								<Stack spacing={2}>
									<TextField
										inputRef={success_url}
										onChange={changeHandler}
										error={error.success_url && true}
										fullWidth
										helperText="Him Access success response consumer URL."
										value={serviceInfo.success_url && serviceInfo.success_url}
										label="Him Access Success URL"
										variant="outlined"
									/>
									<TextField
										inputRef={logout_url}
										onChange={changeHandler}
										error={error.logout_url && true}
										fullWidth
										value={serviceInfo.logout_url && serviceInfo.logout_url}
										label="Logout Success URL"
										helperText="logout success response consumer URL."
										variant="outlined"
									/>
								</Stack>
							</Box>
						</Paper>

						<Box mt={1.3} component={Paper} p={2} textAlign={"right"}>
							<Button variant="contained" onClick={submitHandler}>
								Submit
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
export default EditService;
