import React from 'react';
import { ImageProvider } from './context/ImageContext';
import ImageUpload from './components/ImageUpload';
import ImageEditor from './components/ImageEditor';
import { Container, Typography, Paper } from '@mui/material';

const App: React.FC = () => {
  return (
    <ImageProvider>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Image Processing App
          </Typography>
          <ImageUpload />
          <ImageEditor />
        </Paper>
      </Container>
    </ImageProvider>
  );
};

export default App;