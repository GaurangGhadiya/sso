import React, { useState } from 'react';
import { Button, Input, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload = ({selectedFile, setSelectedFile}) => {

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        onChange={handleFileChange}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload Logo
        </Button>
      </label>
      
      <Typography variant="body2" mt={1}>
        {selectedFile ? `Selected File: ${selectedFile.name}` : 'No file selected'}
      </Typography>
      
    </div>
  );
};

export default ImageUpload;