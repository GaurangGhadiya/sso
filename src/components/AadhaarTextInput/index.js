import React from "react";
import { Input } from "antd";

const formatNumberWithHyphens = (value) => {
	// Remove non-numeric characters
	const numericValue = value.replace(/\D/g, "");

	// Split the value into groups of 4 digits
	const formattedValue = numericValue.match(/.{1,4}/g);

	// Join the groups with hyphens
	return formattedValue ? formattedValue.join("-") : "";
};

const AadhaarNumericInput = (props) => {
	const { value, onChange } = props;

	const handleChange = (e) => {
		const { value: inputValue } = e.target;
		const formattedValue = formatNumberWithHyphens(inputValue);
		onChange(formattedValue);
	};

	const handleBlur = () => {
		// Optionally, you can remove leading zeros on blur
		const valueWithoutLeadingZeros = value.replace(/^0+/, "");
		onChange(valueWithoutLeadingZeros);
	};

	return (
		<Input
			size="large"
			variant="outlined"
			{...props}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder={props.label}
			maxLength={props.maxLength}
		/>
	);
};

export default AadhaarNumericInput;
