const express = require('express');
const router = express.Router();


const multer = require('multer');

// Configura multer
const storage = multer.memoryStorage();  // Puedes usar diskStorage si prefieres guardar en disco
const upload = multer({ storage: storage });

//Importacionde los modulos de playlistController
const {
    crearAlbumController,
    obtenerAlbumController,
    obtenerTodoAlbumUsuarioController,
    modificarAlbumController,
    eliminarAlbumController,
    holaAlbumController
} = require('../controllers/albumController');

// Rutas para album
router.post('/create_album', crearAlbumController); // crear album para foto
router.post('/get_album',obtenerAlbumController);//obtener todas las playlist relacionadas con el usuario
router.post('/get_all_album',obtenerTodoAlbumUsuarioController);//Obtiene todos los albumes del usuario
router.put('/update_album',modificarAlbumController); // modificar los datos de un album
router.delete('/delete_album', eliminarAlbumController); //borrar una album


router.get('/hola_album',holaAlbumController); //test prueba


module.exports = router;
