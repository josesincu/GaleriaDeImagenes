const {
    crearImageService,  
    obtenerImageService,
    obtenerTodoImageUsuarioService,
    modificarImageService,  
    eliminarImageService,
    detectarTextoImageService,
    detectarEtiquetaImageS3Service,  
    holaImageService,
    traducirALenguajeService
} = require('../services/imagenService');

/************************************************************************************
 * 
 * 
 *   OPERACIONES IMAGE
 * 
 * 
 ************************************************************************************/

exports.crearImageController = async (req, res) => {
    // Implementación para registrar un nuevo usuario
    // Llamada de funcion registrarUsuarioService
    
    crearImageService(req)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Se ha creado playlist exitosamente!!!","datosPlaylist":result});
        const{status, data} = result;
        return   res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al generar playlist!!!","errorPlaylist":err.message});
            return  res.json(err.message);
        }
    )

};

exports.obtenerImageController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    obtenerImageService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Lista de playlist obtenida exitosamente","datosPlaylist":result});
        const{status, data} = result;
        return   res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al obtener todas las playlist!!!","errorPlaylist":err.message});
            return   res.json(err.message);
        }
    )
};

exports.obtenerTodoImageUsuarioController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    obtenerTodoImageUsuarioService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Lista de playlist obtenida exitosamente","datosPlaylist":result});
        const{status, data} = result;
        return   res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al obtener todas las playlist!!!","errorPlaylist":err.message});
            return   res.json(err.message);
        }
    )
};

exports.modificarImageController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    modificarImageService(req)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Playlist modificado exitosamente!!","datosPlaylist":result});
        const{status, data} = result;
        return   res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al modificar playlist!!!","errorPlaylist":err.message});
            return   res.json(err.message);
        }
    )
};

exports.eliminarImageController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    eliminarImageService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Playlist eliminado exitosamente","datosPlaylist":result});
        const{status, data} = result;
        return   res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al eliminar playlist!!!","errorPlaylist":err.message});
            return   res.json(err.message);
        }
    )
};

/**
 * 
 * Inica detectar texto en imagenes 
 * 
 */

exports.detectarTextoImageController = async (req, res) => {
    // Implementación del servicio detectar texto imagen
    detectarTextoImageService(req)
    .then((result)=>{
        const{status, data} = result;
        return   res.status(status).json(data);
    })
    .catch(
        (err)=>{
            return  res.json(err.message);
    });

};

exports.detectarEtiquetaImageS3Controller = async (req, res) => {
    // Implementación del servicio detectar texto imagen
    detectarEtiquetaImageS3Service(req)
    .then((result)=>{
        const{status, data} = result;
        return   res.status(status).json(data);
    })
    .catch(
        (err)=>{
            return  res.json(err.message);
    });

};

exports.traducirALenguajeController = async (req, res) => {
    // Implementación del servicio para traducir a otros lenguajes
    traducirALenguajeService(req)
    .then((result)=>{
        const{status, data} = result;
        return   res.status(status).json(data);
    })
    .catch(
        (err)=>{
            return  res.json(err.message);
    });

};


/***************************************************************************************************** */
// Controladores para hola mundo
exports.holaImageController = async (req, res) => {
    // Implementación para obtener un hola mundo
    holaImageService().then((result)=>{
        return res.status(200).json({status:200,mensaje:"Hola image correctamente"})    
    })
    .catch((error)=>{
        return res.status(400).json({status:400,mensaje:"Error al obtener hola image"})
    })  
};
