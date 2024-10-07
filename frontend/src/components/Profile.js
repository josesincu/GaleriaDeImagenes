import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('********');
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);  // Estado para el diálogo de eliminación
  const [confirmPassword, setConfirmPassword] = useState('');  // Para almacenar la contraseña de confirmación
  const apiURL = 'http://localhost:5000';

  useEffect(() => {
    // Obtener id_user de localStorage
    const id_user = localStorage.getItem('id_user');
    
    const fetchUserProfile = async () => {
      try {
        // Hacer la solicitud al backend
        const response = await axios.post(`${apiURL}/get_user`, { id_user });
        
        // Actualizar el estado con los datos recibidos del backend
        const { username, email, url_img } = response.data;
        setUsername(username);
        setEmail(email);
        setProfileImage(url_img); // Asumimos que el backend retorna la URL de la imagen
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);  // Guardar el archivo de imagen
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    const id_user = localStorage.getItem('id_user');
    const file = document.querySelector('input[type="file"]').files[0]; // Archivo de imagen
    const url_img = profileImage; // URL de la imagen, si se está manejando como URL
  
    if (!id_user || !username || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Crear un FormData para enviar archivos y datos juntos
    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    //formData.append('confirm_password', password);  // Puedes manejar confirmación aquí
    formData.append('url_img', file || url_img); // Enviar el archivo si existe, o la URL si ya está disponible
  
    try {
      const response = await axios.put(`${apiURL}/update_user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status === 200) {
        alert('Perfil actualizado con éxito');
        window.location.reload();  // Recargar la página para ver los cambios
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    alert('Cambios cancelados');
  };

  const handleFaceRecognition = () => {
    navigate('/upRekog');
  };

  const handleLogout = () => {
    localStorage.removeItem('id_user');
    alert('Sesión cerrada');
    navigate('/login')  // Refrescar la página o redirigir al usuario al inicio de sesión
  };

  const handleDeleteAccount = async () => {
    const id_user = localStorage.getItem('id_user');

    try {
      const response = await axios.delete(`${apiURL}/delete_user`, {
        data: { id_user, password: confirmPassword },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      
      if (response.status === 200) {
        alert('Cuenta eliminada con éxito');
        localStorage.removeItem('id_user');
        navigate('/login')  // Refrescar la página o redirigir al inicio de sesión
      } else {
        alert('Error al eliminar la cuenta');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert('Error al eliminar la cuenta');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Perfil
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Imagen de Perfil</Typography>
          <Avatar
            alt="Perfil"
            src={profileImage || 'https://via.placeholder.com/150'}
            sx={{ width: 150, height: 150 }}
          />
          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '16px' }}
          >
            Cambiar Imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de Usuario"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Correo Electrónico"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contraseña"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            style={{ marginRight: '8px' }}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="info"
            onClick={handleFaceRecognition}
            style={{ marginRight: '8px' }}
          >
            Configurar Reconocimiento Facial
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}  // Abrir el diálogo de eliminación
            style={{ marginRight: '8px' }}
          >
            Eliminar Cuenta
          </Button>
          <Button
            variant="contained"
            color="default"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Grid>
      </Grid>

      {/* Diálogo para confirmar la eliminación de cuenta */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminar Cuenta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para eliminar tu cuenta, por favor ingresa tu contraseña.
          </DialogContentText>
          <TextField
            margin="normal"
            label="Contraseña"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
