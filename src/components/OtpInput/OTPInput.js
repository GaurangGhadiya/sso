// components/OTPInput.js

import { useState, useRef, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';

const OTPInput = ({ onChange }) => {
     const [inputs, setInputs] = useState(['', '', '', '', '', '']);
     const inputRefs = useRef([]);

     const handleInputChange = (index, e) => {
          const value = e.target.value.replace(/\D/g, ''); // Allow only digits
          const newInputs = [...inputs];
          newInputs[index] = value.slice(0, 1); // Limit input to 1 character

          setInputs(newInputs);

          if (value.length === 1 && index < 5) {
               inputRefs.current[index + 1].focus(); // Move to the next input field
          } else if (value.length === 0 && index > 0) {
               inputRefs.current[index - 1].focus(); // Move to the previous input field on backspace
          }
     };

     useEffect(() => {
          // Send the OTP value to the parent component whenever the input changes
          const otp = inputs.join('');
          onChange(otp);
     }, [inputs, onChange]);

     return (
          <Grid container spacing={2} justifyContent="center" direction="row">
               {inputs.map((value, index) => (
                    <Grid item key={index}>
                         <TextField
                              inputRef={(el) => (inputRefs.current[index] = el)}
                              type="text"
                              value={value}
                              variant="outlined"
                              style={{ width: 30 }}
                              maxLength={1}
                              onChange={(e) => handleInputChange(index, e)}
                              onFocus={() => inputRefs.current[index].select()}
                              size="small"
                              inputProps={{ style: { textAlign: 'center' } }}
                         />
                    </Grid>
               ))}
          </Grid>
     );
};

export default OTPInput;
