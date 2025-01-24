import React, { useState } from "react";
import { TextField, Grid } from "@mui/material";

const AadhaarInput = () => {
	const [values, setValues] = useState(["", "", "", ""]);

	const handleChange = (index, event) => {
		const inputValue = event.target.value.replace(/\D/g, "").slice(0, 4); // Allow only digits and limit to 4 characters
		const newValues = [...values];
		newValues[index] = inputValue;
		setValues(newValues);

		// Move focus to the next input when 4 digits are entered
		if (inputValue.length === 4 && index < values.length - 1) {
			document.getElementById(`field${index + 2}`).focus();
		}
	};

	const handleBackspace = (index, event) => {
		if (event.key === "Backspace" && values[index] === "" && index > 0) {
			document.getElementById(`field${index}`).focus();
		}
	};

	return (
		<Grid container spacing={1}>
			{values.map((value, index) => (
				<Grid item xs={3} key={index}>
					<TextField
						id={`field${index + 1}`}
						variant="outlined"
						value={value}
						onChange={(event) => handleChange(index, event)}
						onKeyDown={(event) => handleBackspace(index, event)}
						maxLength={4}
						placeholder="XXXX"
						autoFocus={index === 0}
						inputProps={{
							style: { textAlign: "center" },
						}}
					/>
				</Grid>
			))}
		</Grid>
	);
};

export default AadhaarInput;
