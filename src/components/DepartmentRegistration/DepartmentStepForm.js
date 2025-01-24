import { useEffect, useState } from "react";
import BasicInfo from "./BasicInfo";
import AddressInfo from "./AddressInfo";
import ContactPerson from "./ContactPerson";
import HodInfo from "./HodInfo";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { getImagePath } from "../../../utils/CustomImagePath";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../../utils/globalEncryption";
import expirationDate from "../../../utils/cookiesExpire";

const {
	Container,
	Box,
	Stepper,
	StepLabel,
	StepContent,
	Step,
	Typography,
	Button,
} = require("@mui/material");

const DepartmentStepForm = () => {
	const router = useRouter();

	const [device, setDevice] = useState("desktop");
	const [activeStep, setActiveStep] = useState(0);

	const [basicInfo, setBasicInfo] = useState({
		username: "",
		password: "",
		department: "",
		personalMessage: "",
	});

	const [addressInfo, setAddressInfo] = useState({
		house: "",
		street: "",
		lm: "",
		loc: "",
		vtc: "",
		dist: "",
		state: "",
		pc: "",
	});

	const [contactPerson, setContactPerson] = useState({
		cpName: "",
		cpDesignation: "",
		cpEmail: "",
		cpMobile: "",
	});

	const [hodInfo, setHodInfo] = useState({
		hodName: "",
		hodDesignation: "",
		hodEmail: "",
		hodMobile: "",
	});

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

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const finalSubmit = async () => {
		const reqData = {
			basicInfo,
			addressInfo,
			contactPerson,
			hodInfo,
		};

		try {
			const response = await api.post("/register-department", { data: encryptBody(JSON.stringify(reqData)) });

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

							Cookies.set("role", "department", { expires: expirationDate });
							Cookies.set("uid", data?.id, { expires: expirationDate });
							Cookies.set("department", data?.department, { expires: expirationDate });

							router.push("/department/department-service");


						} catch (e) {
							console.warn(e)
						}
					}



				}

			}
		} catch (error) {}
	};

	const steps = [
		"Basic Information",
		"Address Information",
		"Contact Person Information",
		"HOD Information",
	];

	const handleSteps = (step) => {
		switch (step) {
			case 0:
				return (
					<BasicInfo
						activeStep={activeStep}
						setActiveStep={setActiveStep}
						basicInfo={basicInfo}
						setBasicInfo={setBasicInfo}
					/>
				);
			case 1:
				return (
					<AddressInfo
						handleBack={handleBack}
						addressInfo={addressInfo}
						activeStep={activeStep}
						setActiveStep={setActiveStep}
						setAddressInfo={setAddressInfo}
					/>
				);
			case 2:
				return (
					<ContactPerson
						handleBack={handleBack}
						contactPerson={contactPerson}
						activeStep={activeStep}
						setActiveStep={setActiveStep}
						setContactPerson={setContactPerson}
					/>
				);
			case 3:
				return (
					<HodInfo
						finalSubmit={finalSubmit}
						handleBack={handleBack}
						hodInfo={hodInfo}
						activeStep={activeStep}
						setActiveStep={setActiveStep}
						setHodInfo={setHodInfo}
					/>
				);
			default:
				throw new Error("Unknown step");
		}
	};

	return (
		<Container maxWidth="md" sx={{ marginTop: 2, position: "relative" }}>
			<Typography mb={3} mt={2} variant="h5">
				Department Registration Form
			</Typography>

			<Container maxWidth="md">
				<Box sx={{ width: "100%" }}>
					<Stepper
						activeStep={activeStep}
						alternativeLabel={device === "desktop" ? true : false}
						orientation={device === "desktop" ? "horizontal" : "vertical"}
					>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>

								{device !== "desktop" && (
									<StepContent>{handleSteps(activeStep)}</StepContent>
								)}
							</Step>
						))}
					</Stepper>
					{device === "desktop" && handleSteps(activeStep)}
				</Box>
			</Container>
		</Container>
	);
};
export default DepartmentStepForm;
