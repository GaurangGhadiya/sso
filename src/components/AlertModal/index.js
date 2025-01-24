import React, { useEffect, useState } from "react";
import {
	TextField,
	Grid,
	Box,
	Stack,
	LinearProgress,
	Modal,
	Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const AlertModal = ({ alert, handleClose }) => {
	const [values, setValues] = useState(["", "", "", ""]);

	useEffect(() => {
		let timer;
		if (alert) {
			timer = setTimeout(() => {
				handleClose(); // Close the modal after 3 seconds
			}, 3000);
		}

		return () => clearTimeout(timer); // Clear the timer on component unmount or modal closure
	}, [alert]);

	return (
		<Modal open={alert.open} onClose={handleClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 330,
					borderRadius: 2,
					bgcolor: "background.paper",
					boxShadow: 24,
				}}
			>
				<Stack
					flexDirection={"row"}
					justifyContent="flex-start"
					alignItems="center"
					style={{ padding: 12 }}
				>
					{alert.type === true ? (
						<CheckCircleIcon
							fontSize="large"
							style={{ color: alert.type === true ? "green" : "red" }}
						/>
					) : (
						<ErrorIcon
							fontSize="large"
							style={{ color: alert.type === true ? "green" : "red" }}
						/>
					)}
					<Typography style={{ marginLeft: 10 }}>{alert.message}</Typography>
				</Stack>
			</Box>
		</Modal>
	);
};

export default AlertModal;
