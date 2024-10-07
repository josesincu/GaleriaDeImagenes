import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Link, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    // Previsualizar la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const urlApi = 'http://localhost:5000';
  const handleRegister = async(event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    
    if (formData.image) {
      console.log(formData.image);
      formDataToSend.append('url_img', formData.image);
    }

    try {
      const response = await axios.post(`${urlApi}/create_user`, formDataToSend,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('Usuario registrado exitosamente');
      navigate('/login');
      }catch (error) {
        console.error('Error:', error);
      }
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" color="info" gutterBottom>
          Registro
        </Typography>

        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Cargar Imagen
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {preview && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                src={preview}
                alt="Previsualización de la imagen"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="success"
            onClick={handleRegister}
          >
            Registrarse
          </Button>

          <Link href="#" variant="body2" color="primary" onClick={() => navigate('/')}>
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
