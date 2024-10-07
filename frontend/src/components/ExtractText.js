import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

const ExtractText = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const apiURL = 'http://localhost:5000';
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleExtractText = async () => {
    if (selectedImage) {
      const formData = new FormData();
      console.log(selectedImage);
      formData.append('image', selectedImage);

      try {
        const response = await axios.post(`${apiURL}/extract_text`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setExtractedText(response.data.text);

      } catch (error) {
        console.error('Error al extraer texto:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <Box display="flex" p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Box width="50%" p={2}>
        {selectedImage && (
          <Card>
            <CardContent>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                style={{ width: '80%', height: 'auto', borderRadius: 8 }}
              />
            </CardContent>
          </Card>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: 16 }}
        />
      </Box>
      <Box width="50%" p={2}>
        <Typography variant="h5" gutterBottom>
          Texto Extraído
        </Typography>
        <TextField
          multiline
          rows={10}
          value={extractedText}
          readOnly
          variant="outlined"
          fullWidth
          placeholder="El texto extraído aparecerá aquí..."
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleExtractText}
          style={{ marginTop: 16 }}
        >
          Extraer Texto
        </Button>
      </Box>
    </Box>
  );
};

export default ExtractText;
