import React, { useState, useRef } from 'react';
import { TextField, Button, Typography, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [showCamera, setShowCamera] = useState(false); // Estado para mostrar/ocultar la cámara
  const [capturedImage, setCapturedImage] = useState(null); // Imagen capturada
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const urlApi = 'http://localhost:5000';

  // Manejar inicio de sesión
  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${urlApi}/login_user`, {
        email: e.target.email.value,
        password: e.target.password.value,
      });
      console.log(response.data);
      alert('Inicio de sesión exitoso');
      localStorage.setItem('id_user', response.data.id_user);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar sesión');
    }
  };

  // Habilitar cámara para reconocimiento facial
  const handleFaceRecognition = () => {
    setShowCamera(true); // Mostrar el componente de cámara
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error("Error accediendo a la cámara:", err);
      });
  };

  // Capturar imagen desde la cámara
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData); // Guardar la imagen capturada
  };

  // Enviar la imagen al backend
  const sendImageToBackend = async () => {
    try {
      const response = await axios.post(`${urlApi}/validate_rek`, { image: capturedImage },{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Respuesta del backend:', response.data);
      alert('Reconocimiento facial exitoso');
      //navigate('/home');
    } catch (error) {
      console.error('Error enviando la imagen:', error);
      alert('Error en el reconocimiento facial');
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
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          PhotoBucket
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Nombre de usuario o correo"
            name="email"
            autoComplete="email"
            autoFocus
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
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="primary"
          >
            Iniciar sesión
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={handleFaceRecognition}
            sx={{ mb: 2 }}
          >
            Utilizar reconocimiento facial
          </Button>

          {/* Sección de la cámara para reconocimiento facial */}
          {showCamera && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <video ref={videoRef} style={{ width: '100%', maxHeight: '300px' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={captureImage}
              >
                Capturar Imagen
              </Button>

              {capturedImage && (
                <>
                  <Typography variant="body1" sx={{ mt: 2 }}>Vista previa de la imagen:</Typography>
                  <img src={capturedImage} alt="captured" style={{ width: '100%', maxHeight: '300px' }} />

                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={sendImageToBackend}
                  >
                    Enviar para reconocimiento facial
                  </Button>
                </>
              )}
            </Box>
          )}

          <Link href="/register" variant="body2" color="primary" onClick={() => navigate('/register')}>
            ¿No tienes una cuenta? Regístrate aquí
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
