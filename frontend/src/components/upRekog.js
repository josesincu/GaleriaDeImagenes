import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const UpRekog = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Hook para redireccionar a otra vista

  // Manejar la selección de imagen
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const apiURL = 'http://localhost:5000';
  // Simular la subida de imagen a S3
  const handleUpload = async () => {
    if (!selectedImage || !password) {
      alert('Por favor, sube una imagen y proporciona una contraseña.');
      return;
    }

    setUploading(true);

    try {
      // Simulamos el proceso de subida

        const formDataToSend = new FormData();
        formDataToSend.append('image', selectedImage);
        formDataToSend.append('password', password);
        formDataToSend.append('id_user', localStorage.getItem('id_user'));
        const response = await axios.post(`${apiURL}/upload_rekog`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log(response.data);    

      // Resetear el estado
        setUploading(false);
        alert('Imagen guardada exitosamente');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error subiendo la imagen. Intenta de nuevo.');
      setUploading(false);
    }
  };

  // Manejar el botón de cancelar para regresar a /profile
  const handleCancel = () => {
    navigate('/profile'); // Redirige a /profile
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Subir Imagen para Rekognition
      </Typography>

      <Grid container spacing={2}>
        {/* Campo para seleccionar la imagen */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Subir Imagen
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {selectedImage && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="body1">
                Imagen seleccionada: {selectedImage.name}
              </Typography>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Vista previa"
                style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}
        </Grid>

        {/* Campo para ingresar la contraseña */}
        <Grid item xs={12}>
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>

        {/* Botones para guardar o cancelar */}
        <Grid item xs={12}>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={uploading}
            style={{ marginRight: '10px' }}
          >
            {uploading ? 'Subiendo...' : 'Guardar Cambios'}
          </Button>
          <Button
            onClick={handleCancel}
            color="secondary"
            variant="outlined"
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpRekog;
