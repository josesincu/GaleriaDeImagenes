import React, { useState, useEffect } from 'react';
import AlbumCard from './AlbumCard';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import axios from 'axios';

const Home = () => {
  const apiURL = 'http://localhost:5000';
  const [open, setOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [albums, setAlbums] = useState([]);

  const handleClickOpen = async() => {
    setOpen(true);
    
    

  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async() => {
    if (newAlbumName.trim()) {
      const id_user = localStorage.getItem('id_user');
      try {
        const response = await axios.post(`${apiURL}/create_album`, { id_user, name: newAlbumName }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log(response.data);

        // Añadir el nuevo álbum a la lista de álbumes en el frontend
        setAlbums([...albums, response.data]);

        // Limpiar el campo de texto y cerrar el modal
        setNewAlbumName('');
        setOpen(false);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  
  
  const getAlbums = async () => {
    try {
      const id_user = localStorage.getItem('id_user');
      const response = await axios.post(`${apiURL}/get_all_album`, { id_user }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
      setAlbums(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditAlbum = (id, newName) => {
    const updatedAlbums = albums.map((album) =>
      album.id === id ? { ...album, name: newName } : album
    );
    setAlbums(updatedAlbums);
  };

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <div className="home-page">
      <h1>Mis Álbumes</h1>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Agregar Álbum
      </Button>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album.id_album}>
            <AlbumCard album={album} onEdit={handleEditAlbum} />
          </div>
        ))}
      </div>

      {/* Modal para agregar un nuevo álbum */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nuevo Álbum</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Álbum"
            type="text"
            fullWidth
            variant="outlined"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;

