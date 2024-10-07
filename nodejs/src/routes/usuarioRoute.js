const express = require('express');
const router = express.Router();

const multer = require('multer');

// Configura multer
const storage = multer.memoryStorage();  // Puedes usar diskStorage si prefieres guardar en disco
const upload = multer({ storage: storage });
//Eportacion de modulos Usuarios
const {
    holaUsuarioController,
    registrarUsuarioController, 
    obtenerUsuarioController, 
    modificarUsuarioController, 
    eliminarUsuarioController,
    loginUsuarioController,
    loginUsuarioFaceController,
    crearFacialUsuarioController
} = require('../controllers/usuarioController');

// Rutas para usuarios
router.post('/get_user',obtenerUsuarioController); //para obtener los datos del  usuario
router.post('/login_user', loginUsuarioController); // login
router.post('/create_user', upload.single('url_img'), registrarUsuarioController);// para crear un usuario


router.put('/update_user', upload.single('url_img'),modificarUsuarioController); // modificar uno de los usuarios
router.delete('/delete_user', eliminarUsuarioController); //borrar uno de los usaruios

//Ruta Reconocimiento facial
router.post('/upload_rekog',upload.single('image'),crearFacialUsuarioController); // login
router.post('/validate_rek',upload.single('image'),loginUsuarioFaceController); // login

router.get('/', holaUsuarioController); //saludos usuarios


module.exports = router;
