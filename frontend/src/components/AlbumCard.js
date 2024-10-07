import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ImageGallery from './ImageGallery'; // Componente para las imágenes
import axios from 'axios';

const AlbumCard = ({ album }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [albumName, setAlbumName] = useState(album.name);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  const apiURL = 'http://localhost:5000';

  const handleSave = async () => {
    try {
      // Enviar la solicitud para actualizar el nombre del álbum
      const response = await axios.put(`${apiURL}/update_album`, {
        id_album: album.id_album,
        name: albumName
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        console.log('Álbum actualizado correctamente');
        alert('Álbum actualizado correctamente');
        setIsEditing(false); // Finalizar la edición
      }
    } catch (error) {
      alert('Error al actualizar el álbum');
      console.error('Error al actualizar el álbum:', error);
    }
  };

  return (
    <Card style={{ padding: '20px', margin: '10px', backgroundColor: '#f5f5f5' }}>
      <CardContent>
        {isEditing ? (
          <TextField
            label="Album Name"
            variant="outlined"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            fullWidth
          />
        ) : (
          <Typography variant="h6">{albumName}</Typography>
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        {isEditing && (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </CardActions>
      <ImageGallery id_album={album.id_album} /> {/* Componente que muestra imágenes */}
    </Card>
  );
};

export default AlbumCard;
