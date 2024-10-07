const express = require('express');
const router = express.Router();


const multer = require('multer');

// Configura multer
const storage = multer.memoryStorage();  // Puedes usar diskStorage si prefieres guardar en disco
const upload = multer({ storage: storage });

//Importacionde los modulos de playlistController
const {
    crearImageController,
    obtenerImageController,
    obtenerTodoImageUsuarioController,
    modificarImageController,
    eliminarImageController,
    detectarTextoImageController,
    detectarEtiquetaImageS3Controller,
    traducirALenguajeController,
    holaImageController
} = require('../controllers/imagenController');

// Rutas para album
router.post('/create_imagen',upload.single('url_img'), crearImageController); // crear album para foto
router.post('/get_imagen',obtenerImageController);//obtener todas las playlist relacionadas con el usuario
router.post('/get_all_imagen_album',obtenerTodoImageUsuarioController);//Obtiene todos los albumes del usuario
router.put('/update_imagen',modificarImageController); // modificar los datos de un album
router.delete('/delete_imagen', eliminarImageController); //borrar una album

//rekognition
router.post('/extract_text',upload.single('image'),detectarTextoImageController);
router.post('/extract_label',detectarEtiquetaImageS3Controller);
router.post('/translate_text',traducirALenguajeController);
//translate 


router.get('/hola_image',holaImageController); //test prueba


module.exports = router;
