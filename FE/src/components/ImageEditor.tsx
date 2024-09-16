import React, { useEffect, useState, useCallback } from 'react';
import { useImageContext } from '../context/ImageContext';
import { Box, Slider, Typography, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Download } from '@mui/icons-material';
import useDebounce from '../hooks/useDebounce';

const ImageEditor: React.FC = () => {
  const {
    imagePath, brightness, setBrightness, contrast, setContrast,
    saturation, setSaturation, rotation, setRotation, format, setFormat
  } = useImageContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePreview = useCallback(async () => {
    if (!imagePath) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/images/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: imagePath,
          brightness,
          contrast,
          saturation,
          rotation,
          format
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPreview(data.preview);
      setError(null);
    } catch (error) {
      console.error('Preview update failed:', error);
      setError('Failed to update preview');
    } finally {
      setIsLoading(false);
    }
  }, [imagePath, brightness, contrast, saturation, rotation, format]);

  const debouncedUpdatePreview = useDebounce(updatePreview, 500);

  useEffect(() => {
    if (imagePath) {
      debouncedUpdatePreview();
    }
  }, [imagePath, brightness, contrast, saturation, rotation, format, debouncedUpdatePreview]);

  const handleSliderChange = (setter: (value: number) => void) => (event: Event, newValue: number | number[]) => {
    setter(newValue as number);
  };

  const handleDownload = async () => {
    setError(null);
    const url = `${process.env.REACT_APP_API_URL}/images/download?filePath=${imagePath}&brightness=${brightness}&contrast=${contrast}&saturation=${saturation}&rotation=${rotation}&format=${format}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `processed_image.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error('Download failed:', error);
      setError(`Download failed: ${error.message}`);
    }
  };

  if (!imagePath) return null;

  return (
    <Box>
      <Box my={3} display="flex" justifyContent="center" position="relative" minHeight="400px">
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              position: 'absolute',
              opacity: isLoading ? 0.5 : 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
        )}
        {isLoading && (
          <Typography 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            Loading...
          </Typography>
        )}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Brightness</Typography>
          <Slider
            value={brightness}
            onChange={handleSliderChange(setBrightness)}
            min={0.5}
            max={1.5}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Contrast</Typography>
          <Slider
            value={contrast}
            onChange={handleSliderChange(setContrast)}
            min={0.5}
            max={1.5}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Saturation</Typography>
          <Slider
            value={saturation}
            onChange={handleSliderChange(setSaturation)}
            min={0.5}
            max={1.5}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Rotation</Typography>
          <Slider
            value={rotation}
            onChange={handleSliderChange(setRotation)}
            min={0}
            max={360}
            step={1}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
      <Box my={3} display="flex" justifyContent="space-between" alignItems="center">
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
            label="Format"
          >
            <MenuItem value="png">PNG</MenuItem>
            <MenuItem value="jpeg">JPEG</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          startIcon={<Download />}
        >
          Download Processed Image
        </Button>
      </Box>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageEditor;