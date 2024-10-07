
const { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3'); 
//const {RegistrarUsuario} = require("../models/registrarUsuarioModel")
const {uploadImage,deleteImage,getAllImageS3} = require("../models/s3Model")
const {connection} = require('../../config/database')
const {s3} = require('../../config/awsS3')
const {EncriptarPass,CompararPass} = require('../models/encriptar');
const {compareFaceImageS3} = require('../models/rekognitionModel');

// imporacion de libreria rekognition
const {rekognition} = require('../../config/awsRekognition');
const {CompareFacesCommand } = require('@aws-sdk/client-rekognition');
/************************************************************************************
 * 
 * 
 *   OPERACIONES USUARIO
 * 
 * 
 ************************************************************************************/
//variables globales
//fotos perfil
const fotoPerfil = 'https://practica2-semi1-a-2s2024-imagenes-g7.s3.amazonaws.com/Fotos_Perfil/';

//fotos reconocimiento facial
const fotoReconocimientoFacial = 'https://practica2-semi1-a-2s2024-imagenes-g7.s3.amazonaws.com/Fotos_Reconocimiento_Facial/';

// Implementación de servicios para registrar usuario
exports.registrarUsuarioService = async function(registrarUsuario){
    //implementar la conexion con el bucker s3 y la db

    //variables
    const {username, email, password} = registrarUsuario.body;
    nuevoPassword = '';
    
    try {
          nuevoPassword = await EncriptarPass(password);
    } catch (error) {
          return {status:500, data:{error:`Error al encriptar password usuario en nodejs u`}}
    }

    let photo_url = `${fotoPerfil}${registrarUsuario.file.originalname}`;
    let nameImage = registrarUsuario.file.originalname;
    
    
    //implementado s3
    
    const subirImagen = new uploadImage("Fotos_Perfil",registrarUsuario.file);
    const command = new PutObjectCommand(subirImagen);
     try {
          await s3.send(command);

     } catch (error) {
          return {status:500,data:{error:`Error al subir imagen en s3 errro:${error}`}};
     }
          
     
     
     try {

          let conexion = await connection();// se llamo la funcion conexion en dbconfig

          sqlComandVerificar = `SELECT COUNT(*) as Contador FROM users WHERE username = "${username}" OR email = "${email}"`;
          const [resultVerificar, fieldsVerificar] = await conexion.query(sqlComandVerificar);
          
          if(resultVerificar[0].Contador === 0){
               
               sqlComandUser = `INSERT INTO users(username,email,password,url_img) VALUES ("${username}","${email}","${nuevoPassword}","${photo_url}");`
               const [resultUser, fieldsUser] = await conexion.query(sqlComandUser);
               
               //resultado al insrtar un usuario
               if(resultUser === undefined){
                    return {status:409,message:"No se puede crear este usuario, ya existe!!!"};
               }
               const idUser = resultUser.insertId;
               sqlComandAlbum = `INSERT INTO album(name,id_user) VALUES ("Imagenes de perfil",${idUser});`
               const [resultAlbum, fieldsAlbum] = await conexion.query(sqlComandAlbum);
               
               const idAlbum = resultAlbum.insertId;
               //resultado de la insercion en album
               if(resultAlbum === undefined){
                    return {status:500, data:{message:"No se puede crear el album imagenes de perfil!!!"}};
               }

               //resuldato de insercion en tabla imagen
               sqlComandImage = `INSERT INTO image(name,description,url_img,id_album) VALUES ("${nameImage}","Imagenes de perfil","${photo_url}",${idAlbum});`
               const [resultImage, fieldsImage] = await conexion.query(sqlComandImage);

               if(resultImage === undefined){
                    return {status:500, data:{message:"No se puede agregar imagen en  el album imagenes de perfil!!!"}};
               }

               return {status:201, data:{message:"Usuario y album favorito creado correctamente creado con exito"}};
          }else{
               return {status:409, data:{message:"Error, nombre de usuario o correo ya existentes!!!"}};
          }
          

     } catch (error) {
          //Este error sale cuando no hay modulos importados, librerias o consultas mal escritas.
          return {status:400, data:{error:`Error al crear usuario y album,datos en incorrectos. Error->${error}`}};
     }
     

}

exports.modificarUsuarioService = async function(modificarUsuario){
     //variables
     const {id_user,username,email,password} = modificarUsuario.body;
     let photo_url = `${fotoPerfil}${modificarUsuario.file.originalname}`;
     let nombreImagen = modificarUsuario.file.originalname;
    
     //implementado s3
     try {
          const subirImagen = new uploadImage("Fotos_Perfil",modificarUsuario.file);
          const command = new PutObjectCommand(subirImagen);
          await s3.send(command);

     } catch (error) {
          return {status:502, data:{error:"Error al subur fotos en s3!!!"}};
     }
     

     try {
          let conexion = await connection();// abre conexion a la bases de datos

          // count(*) nos verifica si existen datos repitentes o no para agregar los nuevos cambios
          sqlComandVerificar = `SELECT COUNT(*) as Contador FROM users WHERE username = "${username}" OR email = "${email}"`;
          const [resultVerificar, fieldsVerificar] = await conexion.query(sqlComandVerificar);

          if(resultVerificar[0].Contador === 0){
               //obtener la contrasena del usuario
               sqlComandPass = `SELECT u.password as pass FROM users u WHERE u.id_user =  ${id_user};`
               const [resultPass,fieldsPass] = await conexion.query(sqlComandPass);
               let passEncriptada = resultPass[0].pass;

               if(passEncriptada === undefined ){
                    return {status:400, data:{error:"La contrasenia del usuario no exitste!!!!"}};
               }
               
               //Se comparan los pass si es verdad devuelve un booleano
               let esContrasenia = await CompararPass(password,passEncriptada);

               if(esContrasenia){

                    //agregar aqui el nuevo link a imagenes de perfil por si acaso
                    sqlComandIdImagenPerfil = `SELECT a.id_album FROM album a
                                               INNER JOIN users u ON a.id_user  = u.id_user WHERE u.id_user = ${id_user} and a.name = "Imagenes de perfil";`;
                    const [resultIdImagenPerfil,fieldsIdImagenPerfil] = await conexion.query(sqlComandIdImagenPerfil);

                    if(resultIdImagenPerfil === undefined){
                         return {status:404, data:{message:"Error, imagenes de perfil no se encuentra!!!"}};
                    }

                    sqlComandInsertImagePerfil = `INSERT INTO image (name,description,url_img,id_album) VALUES ("${nombreImagen}","Imagen de perfil usuario ${id_user}","${photo_url}",${resultIdImagenPerfil[0].id_album});`
                    const [resultCreateImage,fieldsCrearteImage] = await conexion.query(sqlComandCreateImage);

                    //console.log(resultCreateImage);
                    if(resultCreateImage.affectedRows === 0){
                         return {status:500, data:{error:`Error, no se pudo crear imagen`}};
                    }

                    
                    //actualizacion del usuario
                    sqlComandUpdate = `UPDATE users SET username = "${username}",email = "${email}", url_img = "${photo_url}" WHERE id_user = ${id_user} and password = "${passEncriptada}";`
                    const [resultModificarUsuario,fieldsModificarUsuario] = await conexion.query(sqlComandUpdate);

                    if(resultModificarUsuario === undefined){
                         return {status:404, data:{message:"Error, usuario a modificar no existe!!!"}};
                    }

                    return {status:200, data:{message:"Usuario modificado correctamente!!"}};
               }
               return {status:401, data:{message:"Error, La contraseña es incorrecta, verificar...."}};
               
          }else{
               return {status:409, data:{message:"Error al modicar datos, username o correo repedito..."}};
          }
                   
     
     } catch (error) {
          return {status:500, data:{error:"Error al modificar datos usuarios!!!"}};
     }
}

exports.obtenerUsuarioService = async function(obtenerUsuario){
     //por crear conexion 
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la base de datos ${error.message}`}};
     }
     
     
     try {
         
          sqlComand = `SELECT u.id_user, u.username, u.password, u.email, u.url_img FROM users u WHERE u.id_user =  ${obtenerUsuario.id_user};`
          const [resultGetUser, fieldsGetUser] = await conexion.query(sqlComand);
          
          if(resultGetUser.length === 0){
               return{status:404, data:{error:"Error, el usuario a obtener no existe"}};
          }
          
          return {status:200,data:resultGetUser[0]};

     } catch (error) {
          return {status:500, data:{error:`Error al obtener usuario ${error.message}`}};
     }
              
     
}


exports.eliminarUsuarioService = async function(eliminarUsuario){
     //por implementar
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:500,data:{error:`Error en la conexion en la bade de datos ${error.message}`}};
     }
     
     try {

          //eliminacion de imagenes de usuario en bucket
          slqComandGetListImageUser = `SELECT  i.url_img FROM image i 
               INNER JOIN album a  ON i.id_album = a.id_album
               INNER JOIN users u ON a.id_user = u.id_user WHERE u.id_user = ${id_user};`

          const [resultImageUser,fieldsImageUser] = conexion.query(sqlComandGetListImageUser);
          
          //Eliminacion de imagenes en el bucket
          for (let i = 0; i < resultImageUser.length; i++) {
               // Encontrar el primer '/' después de 'https:'
               let index = resultImageUser[i].indexOf('/', 8); // 8 es la longitud de 'https://'
               // Separar en dos partes: antes del primer '/' y después
               let resto = resultImageUser[i].substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'

               // Dividir el resto por '/' para obtener las otras dos partes
               let splitResto = resto.split('/');

               const deleteImagen = new deleteImage(splitResto[0],splitResto[1]);
               const commandDelete = new DeleteObjectCommand(deleteImagen);
               await s3.send(commandDelete);
          }
          
          //Obtener todos los albumes relacionados con el usuario
          let sqlComandIdAlbum = `SELECT a.id_album FROM album a 
                                  INNER JOIN users u ON a.id_user  = u.id_user  WHERE u.id_user = ${eliminarUsuario.id_user};`;

          const [resultIdAlbum,fieldsIdAlbum] = conexion.query(sqlComandIdAlbum);
          
          for(let album of resultIdAlbum){
               try {
                    // Eliminacion de imagenes relacionados con el album en db
                    let sqlComandEliminarImageAlbum = `SELECT i.id_image FROM image i 
                              INNER JOIN album a ON i.id_album  = a.id_album  WHERE a.id_album = ${album.id_album};`;

                    const[resultEliminarImageAlbum, fieldsEliminarImageAlbum] = await conexion.query(sqlComandEliminarImageAlbum);

                    for(let imagen of resultEliminarImageAlbum){
                         try {
                              let sqlComandDeleteImage = `DELETE FROM image i WHERE i.id_image = ${imagen.id_image};`;
                              const[resultDeleteAlbum, fieldsDeleteAlbum] = await conexion.query(sqlComandDeleteImage);

                         } catch (error) {
                             return {status:500, data:{error:`Error al eliminar imagen en album ${error}`}};
                         }

                    }

                    // Eliminacion del album en db
                    let sqlComand = `DELETE FROM album WHERE id_album =  "${album.id_album}";`
                    const[resultDeleteAlbum, fieldsDeleteAlbum] = await conexion.query(sqlComand);

               } catch (error) {
                    return {status:500, data:{error:`Error al eliminar album relacionado con album error:${error.message}`}};
               }
          }

          //inicio de eliminacino de usuariollllll
          sqlComandDeleteUser = `DELETE FROM users WHERE id_user =  "${eliminarUsuario.id_user}";`
          const [resultDeleteUser,fieldsDeleteUser] = conexion.query(sqlComandDeleteUser);

          if(resultDeleteUser.length === 0 ){
               return {status:404,data:{error:`Error al eliminar usuario no existe`}};
          }


          return {status:200, data:{message:"Usuario eliminado exitosamente!!!"}};

     } catch (error) {

          return {status:500, data:{error:`Error al eliminar usuario ${error.message}`}};
     }
          
     
}

 
exports.loginUsuarioService = async function(loginUsuario){
     
     //obteniendo los datos
     const {email,password} = loginUsuario;
     let conexion ;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la bades de datos ${error.message}`}};
     }

     try {

          //validar si es nombre usuario o correo
          let sqlComandPass;
          const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          
          if (regex.test(email)){
               //para correo
               sqlComandPass = `SELECT u.password FROM users u WHERE u.email =  "${email}";`;
          } else {
               //para nombre usuario
               sqlComandPass = `SELECT u.password FROM users u WHERE u.username =  "${email}";`;
          }

          //recuperar lapass
          passEncriptado = ''
          //por implementar
          const[resultLog,fieldsLog] = await conexion.query(sqlComandPass);

          if(resultLog.length === 0){
               return {status:401, data:{error:"Error al logearse no se encontro contraseña"}};
          }

          passEncriptado = resultLog[0].password;
          let esCorrectoPass = await CompararPass(password,passEncriptado);
          
          if(esCorrectoPass){
               sqlComandSuccess = `SELECT u.id_user FROM users u WHERE u.password =  "${passEncriptado}";`
               const[resultLogSuccess,fieldsLogSuccess] = await conexion.query(sqlComandSuccess);
               
               return {status:200,data:resultLogSuccess[0]};

          }else{
               return {status:401, data:{error:"Error contrasena incorrecta"}};
          }

          
     } catch (error) {
          return {status:500, data:{error:`error al logearse ${error.message}`}};
     }
     
                         
}

/**
 * Login de reconocimiento facial
 */
exports.loginUsuarioFaceService = async function(loginUsuarioFacial){
     
     //Obtener todas las imagenes en el bucket s3
     let listaImagenesReconocimientoFacial;
     try {
          // Listar objetos en la carpeta
         listaImagenesReconocimientoFacial = await s3.send(new ListObjectsV2Command(getAllImageS3("Fotos_Reconocimiento_Facial")));
         
     } catch (error) {
          return {status:500, data:{error:`Error al obtener imagenes en el bucket`}};
     }
     
     try {
          // Solicitamos el reconocimiento de caras
          for(let usuarioFacial of listaImagenesReconocimientoFacial.Contents){
               
               let tempPath = usuarioFacial.Key.split('/');

               if(tempPath.length === 2 && tempPath[0]!== '' && tempPath[1] !== ''){

                    const paramsRekognitionCompareFace = new compareFaceImageS3(loginUsuarioFacial.file,usuarioFacial.Key);
                    const commandCompareFace = new CompareFacesCommand(paramsRekognitionCompareFace);
                    const response = await rekognition.send(commandCompareFace);

                    let encabezadoPath = 'https://practica2-semi1-a-2s2024-imagenes-g7.s3.amazonaws.com/';
                    if(response.FaceMatches.length !== 0 && response.FaceMatches[0].Similarity > 90){
                         // se crea la conexion con la db si tod esta correcto
                         let conexion ;

                         try {
                              conexion = await connection();
                         } catch (error) {
                              return {status:503, data:{error:`Error al conectarse a la bades de datos ${error.message}`}};
                         }

                         let pathImagenUsuario = encabezadoPath + usuarioFacial.Key;
                         console.log(pathImagenUsuario);
                         
                         sqlComandUsuario = `SELECT u.id_user FROM image i 
                                             INNER JOIN album a ON i.id_album  = a.id_album 
                                             INNER JOIN users u ON a.id_user  = u.id_user WHERE i.url_img  = "${pathImagenUsuario}"`
                         const[resultLogSuccess,fieldsLogSuccess] = await conexion.query(sqlComandUsuario);
                         return {status:200, data:{id_user:resultLogSuccess[0].id_user}};
                         //return response;
                    }
               }
               
          }
          
          return {status:404, data:{message:`Este usuario no existe en reconocimiento facial`}};
          
 
     } catch (error) {
           return {status:500, data:{error:`Error al comparar cara en recognition:${error}`}};
     }
     
                         
}

// Creacion de Reconocimieno facial
exports.crearFacialUsuarioService = async function(registrarFacialUsuario){
     //implementar la conexion con el bucker s3 y la db
 
     //variables
     const {id_user, password} = registrarFacialUsuario.body;
      
     let photo_url = `${fotoReconocimientoFacial}${registrarFacialUsuario.file.originalname}`;
     let nameImage = registrarFacialUsuario.file.originalname;
     
     
     //implementado s3
     
     const subirImagen = new uploadImage("Fotos_Reconocimiento_Facial",registrarFacialUsuario.file);
     const command = new PutObjectCommand(subirImagen);
     try {
           await s3.send(command);
 
     } catch (error) {
           return {status:502, data:{error:`Error al subir imagen en s3 errro:${error}`}};
     }
         
      
      
      try {
 
          let conexion = await connection();// se llamo la funcion conexion en dbconfig
          //verificar si existe album
          sqlComandVerificar = `SELECT COUNT(*) AS Contador FROM album a
                                INNER JOIN users u ON a.id_user  = u.id_user  WHERE a.name = "Reconocimiento" AND u.id_user = ${id_user};`;
          const [resultVerificar, fieldsVerificar] = await conexion.query(sqlComandVerificar);

          // ya existe el album
          if(resultVerificar[0].Contador === 1){
               
               sqlComandGetIdAlbum = `SELECT a.id_album FROM album a
                                     INNER JOIN users u ON a.id_user  = u.id_user  WHERE a.name = "Reconocimiento" AND u.id_user = ${id_user};`;
               const [resultIdAlbum, fieldsIdAlbum] = await conexion.query(sqlComandGetIdAlbum);
               
               if(resultIdAlbum === undefined){
                    return {status:500, data:{message:"Error, Al obtener id de  album reconocimiento facial"}};
               }

               sqlComandImage = `UPDATE image SET url_image = "${photo_url}" WHERE id_album = ${resultIdAlbum[0].id_album};`;
               const [resultImage, fieldsImage] = await conexion.query(sqlComandImage);

               if(resultImage === undefined){
                    return {status:500, data:{message:"Error, No se puede actualizar imagen en  el album reconocimiento facial"}};
               }
               return {status:201, data:{message:"Usuario y album favorito modificado correctamente creado con exito"}};

          // Se crea album de reconocimiento solo
          }else if(resultVerificar[0].Contador === 0){
               //Se creal el album de reconocimineto
               sqlComandAlbum = `INSERT INTO album(name,id_user) VALUES ("Reconocimiento",${id_user});`;
               const [resultAlbum, fieldsAlbum] = await conexion.query(sqlComandAlbum);

               if(resultAlbum === undefined){
                    return {status:500, data:{message:"Error no se puede crear album de Reconocimiento de usuario..."}};
               }
                //resuldato de insercion en tabla imagen
               sqlComandImage = `INSERT INTO image(name,description,url_img,id_album) VALUES ("Reconocimiento Facial","Reconocimeindo Facial ${id_user}","${photo_url}",${resultAlbum.insertId});`;
               const [resultImage, fieldsImage] = await conexion.query(sqlComandImage);

               if(resultImage === undefined){
                    return {status:500, data:{message:"No se puede agregar imagen en  el album imagenes de perfil!!!"}};
               }

               return {status:201, data:{message:"exito, Se agrego reconocimiento facial correctamente!!!"}};
          
          }else{
               return {status:401, data:{message:"Error, existen demasiados albumes llamados Reconocimiento!!!"}};
          }           
 
      } catch (error) {
           
           return {status:400, data:{error:`Error al crear usuario y album,datos en incorrectos. Error Sql:${error.sqlMessage}`}};
      }
      
 
 }

exports.holaUsuarioService = function(){ 
     return Promise.resolve({status:200,data:{message:"Hola Mundo Usuario!!!!!"}}); 
}
     
     