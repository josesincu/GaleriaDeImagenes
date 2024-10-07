import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();


  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PhotoBucket
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/home')}>
            Ver Álbumes
          </Button>
          <Button color="inherit" onClick={() => navigate('/upload_image')}>
            Subir Imagen
          </Button>
          <Button color="inherit" onClick={() => navigate('/extract_text')}>
            Extraer Texto
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Ver Perfil
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
