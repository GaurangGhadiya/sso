import { TextField } from '@mui/material';
import React, { useState } from 'react';

const AadhaarInput = ({ setAadhaar, aadhaar, otpField, disabled }) => {


    const handleChange = (e) => {
        let { value } = e.target;

        const sanitizedValue = value.replace(/\D/g, '');

        const maxLength = 12;
        const truncatedValue = sanitizedValue.slice(0, maxLength);

        let formattedValue = '';
        for (let i = 0; i < truncatedValue.length; i++) {
            if (i !== 0 && i % 4 === 0) {
                formattedValue += '-';
            }
            formattedValue += truncatedValue[i];
        }

        setAadhaar(formattedValue);
    };

    return (
        <TextField
            size='small'
            readOnly={otpField && true}
            className="form-control form-control-user"
            type="text"
            focused
            disabled={disabled ? disabled : false}
            required={true}
            value={aadhaar}
            onChange={handleChange}
            maxLength={14}
            placeholder="Enter Aadhaar number"
            fullWidth label="Aadhaar Number" variant="outlined"
        />
    );
};

export default AadhaarInput;