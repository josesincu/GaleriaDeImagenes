import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Container } from '@mui/material';
import axios from 'axios';

const CreateImage = ({ onUpload }) => {
  const apiURL = 'http://localhost:5000';
  const [imageName, setImageName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [albums, setAlbums] = useState([]);

  // Función para obtener los álbumes desde el backend
  const getAlbums = async () => {
    try {
      const id_user = localStorage.getItem('id_user');
      const response = await axios.post(`${apiURL}/get_all_album`, { id_user }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
      // Filtrar álbumes para excluir el que tenga el nombre "Imagenes de perfil"
      const filteredAlbums = response.data.filter(album => album.name !== 'Imagenes de perfil');
    
      setAlbums(filteredAlbums); // Almacenar álbumes obtenidos del backend
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbums(); // Obtener los álbumes al cargar el componente
  }, []);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Almacenar la imagen seleccionada
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (imageName.trim() && selectedAlbum && imageFile) {
      const formDataToSend = new FormData();
      formDataToSend.append('name', imageName);
      formDataToSend.append('description', imageDescription);
      formDataToSend.append('id_album', selectedAlbum); // El ID del álbum seleccionado
      formDataToSend.append('url_img', imageFile); // El archivo de imagen seleccionado

      try {
        const response = await axios.post(`${apiURL}/create_imagen`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log(response.data);
        alert('Imagen subida exitosamente');
        // Reiniciar los campos del formulario
        setImageName('');
        setImageDescription('');
        setSelectedAlbum('');
        setImageFile(null);
        // Llamar la función onUpload si es necesario
        onUpload && onUpload(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Subir Imagen
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de la Imagen"
            variant="outlined"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            variant="outlined"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Álbum</InputLabel>
            <Select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              label="Álbum"
            >
              {albums.map((album) => (
                <MenuItem key={album.id_album} value={album.id_album}>
                  {album.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '16px' }}
          >
            Seleccionar Imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {imageFile && <Typography variant="body2">Imagen seleccionada: {imageFile.name}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            style={{ marginRight: '8px' }}
          >
            Subir
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => window.history.back()}
          >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateImage;
