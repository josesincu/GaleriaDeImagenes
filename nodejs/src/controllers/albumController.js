const {
    crearAlbumService,  
    obtenerAlbumService,
    obtenerTodoAlbumUsuarioService,
    modificarAlbumService,  
    eliminarAlbumService,  
    holaAlbumService} = require('../services/albumService');

/************************************************************************************
 * 
 * 
 *   OPERACIONES PLAYLIST
 * 
 * 
 ************************************************************************************/

exports.crearAlbumController = async (req, res) => {
    // Implementación para registrar un nuevo usuario
    // Llamada de funcion registrarUsuarioService
    
    crearAlbumService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Se ha creado playlist exitosamente!!!","datosPlaylist":result});
        const {status,data} = result;
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

exports.obtenerAlbumController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    obtenerAlbumService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Lista de playlist obtenida exitosamente","datosPlaylist":result});
        const {status,data} = result;
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

exports.obtenerTodoAlbumUsuarioController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    obtenerTodoAlbumUsuarioService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Lista de playlist obtenida exitosamente","datosPlaylist":result});
        const {status,data} = result;
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

exports.modificarAlbumController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    modificarAlbumService(req)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Playlist modificado exitosamente!!","datosPlaylist":result});
        const {status,data} = result;
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

exports.eliminarAlbumController = async (req, res) => {
    // Implementación para obtener un usuario por ID
    eliminarAlbumService(req.body)
    .then((result)=>{
        //return   res.status(200).json({"status":200,"mensaje":"Playlist eliminado exitosamente","datosPlaylist":result});
        const {status,data} = result;
        return res.status(status).json(data);
    }
        
    )
    .catch(
        (err)=>{
            //return   res.status(400).json({"status":400,"mensaje":"Error,al eliminar playlist!!!","errorPlaylist":err.message});
            return res.json(err.message);
        }
    )
};



/***************************************************************************************************** */
// Controladores para hola mundo
exports.holaAlbumController = async (req, res) => {
    // Implementación para obtener un hola mundo
    holaAlbumService().then((result)=>{
        return res.status(200).json({status:200,mensaje:"Hola playlist correctamente"})    
    })
    .catch((error)=>{
        return res.status(400).json({status:400,mensaje:"Error al obtener hola playlist"})
    })  
};

