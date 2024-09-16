import React from 'react';
import { useImageContext } from '../context/ImageContext';
import { Button, Typography, Box } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const ImageUpload: React.FC = () => {
  const { setImagePath } = useImageContext();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/images/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setImagePath(data.filePath);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <Box my={3}>
      <input
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" startIcon={<CloudUpload />}>
          Upload Image
        </Button>
      </label>
      <Typography variant="caption" display="block" gutterBottom>
        Supported formats: PNG, JPEG
      </Typography>
    </Box>
  );
};

export default ImageUpload;