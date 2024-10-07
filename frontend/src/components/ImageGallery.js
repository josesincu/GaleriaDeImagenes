import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';

const ImageGallery = ({ id_album }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const apiURL = 'http://localhost:5000';

  const handleImageClick = async(image) => {
    setSelectedImage(image);
    try {
      const response = await axios.post(`${apiURL}/extract_label`, {
        url_img: image.url_img, // Enviar el URL de la imagen
      });
      setLabels(response.data); // Guardar las etiquetas en el estado
      console.log('Labels:', response.data);
    } catch (error) {
      console.error('Error extracting labels:', error);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setLabels([]); // Limpiar las etiquetas al cerrar el modal
  };
  
  const getImagesByAlbum = async () => {
    try {
      console.log("albumId", id_album);
      const response = await axios.post(`${apiURL}/get_all_imagen_album`, { id_album },{
        headers: {
          'Content-Type': 'application/json',
        }
        });

        console.log(response.data);
        setImages(response.data);
      }
      
    catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    getImagesByAlbum(); // Llama a la función al montar el componente
  }, [id_album]); // Agrega getImagesByAlbum si quieres evitar la advertencia o pasa el albumId

  return (
    <>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.url_img} // Asegúrate de que la propiedad de imagen sea correcta
                alt={image.name}
                onClick={() => handleImageClick(image)}
                style={{ cursor: 'pointer' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal para mostrar información de la imagen */}
      <Dialog open={Boolean(selectedImage)} onClose={handleClose}>
        <DialogTitle>Información de la Imagen</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <div>
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                <strong>Nombre:</strong> {selectedImage.name}
              </Typography>
              <img src={selectedImage.url_img} alt="Selected" style={{ width: '100%' }} />
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                <strong>Descripcion:</strong> {selectedImage.description}
              </Typography>

              {/* Mostrar etiquetas extraídas */}
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                <strong>Etiquetas:</strong> {labels.length > 0 ? labels.join(', ') : 'Cargando...'}
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
