const { DeleteObjectCommand } = require('@aws-sdk/client-s3'); 
const {connection} = require('../../config/database')
const {s3} = require('../../config/awsS3')


/************************************************************************************
 * 
 * 
 *   OPERACIONES PLAYLIST
 * 
 * 
 ************************************************************************************/
// Crea un album
exports.crearAlbumService = async function(crearAlbum){
    //implementar la conexion con el bucker s3 y la db
    let conexion;
    try {
          conexion = await connection();
    } catch (error) {
          return {status:503, data:{error:`Erro al conectar a la base de datos: ${error.message}`}};
    }
    //variables
     
     const {name,id_user} = crearAlbum;
     

//implementado s3

     try {
          sqlComandCreateAlbum = `INSERT INTO album (name,id_user) VALUES ("${name}",${id_user});`
          const [resultCreateAlbum,fieldsCrearteAlbum] = await conexion.query(sqlComandCreateAlbum);

          if(resultCreateAlbum.affectedRows === 0){
               return {status:500, data:{error:`Error, no se pudo crear album`}};
          }
          
          sqlComandGetAlbum = `SELECT p.id_album, p.name FROM album p WHERE p.id_album = ${resultCreateAlbum.insertId};`

          const [resultGetAlbum,fieldsGetAlbum] = await conexion.query(sqlComandGetAlbum);

          if(resultGetAlbum.length === 0){
               return {status:500, data:{error:`Error al obtener el album`}};
          }
          return {status:200,data:resultGetAlbum[0]};
     } catch (error) {
          return {status:500, data:{error:`Error al crear album ${error.message}`}};
     }      

}

//obtiene un album a traves de su id
exports.obtenerAlbumService = async function(obtenerAlbum){
     //por implementar s3 y db
     let conexion;
     const {id_album} = obtenerAlbum

     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la debe ${error.message}`}};
     }

     try {
          sqlComand = `SELECT id_album, name FROM album WHERE id_album  = ${id_album};`
          const [resultGetAlbum,fieldsGetAlbum] = await conexion.query(sqlComand);
          
          if(resultGetAlbum.length === 0 ){
               return {status:404, data:{error:"Error,este album no posee el usuario"}};
          }
           return {status:200, data:resultGetAlbum[0]};

     } catch (error) {
          console.log(error);
          return {status:500, data:{error:`Error al obtener album ${error.menssage}`}};
     }
     
}

//obtiene todos los  albumes de un usuario con su id
exports.obtenerTodoAlbumUsuarioService = async function(obtenerAlbum){
     //por implementar  db
     let conexion;
     const {id_user} = obtenerAlbum

     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la debe ${error.message}`}};
     }

     try {
          sqlComand = `SELECT  a.id_album,a.name FROM album a 
          INNER JOIN users u ON a.id_user  = u.id_user WHERE u.id_user = ${id_user} ;`
          const [resultGetAllAlbum,fieldsGetAlbum] = await conexion.query(sqlComand);
          
          if(resultGetAllAlbum.length === 0 ){
               return {status:404, data:{error:"Error,este album no posee el usuario"}};
          }
           return {status:200,data:resultGetAllAlbum};

     } catch (error) {
          console.log(error);
          return {status:500, data:{error:`Error al obtener album ${error.menssage}`}};
     }
     
}



//modifica el album actual
exports.modificarAlbumService = async function(modificarAlbum){
     //implementacion de la db
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la base de datos ${error.message}`}};
     }
     //variables
     const {id_album,name} = modificarAlbum.body;
     
     try {
          sqlComandMod = `UPDATE album SET name = "${name}" WHERE id_album = ${id_album};`;
          const [resultModAlbum,fieldsModAlbum] = await conexion.query(sqlComandMod);
          

          if(resultModAlbum.affectedRows === 0){
               return {status:404, data:{error:`Error, no se encontro album a modificar`}};     
          }

          return {status:200, data:{message:`Album modificado correctamente!!!!`}};

     } catch (error) {
          return {status:500, data:{error:`Erro al modificar album ${error.menssage}`}};    
     }

}


//Elemina un album con su id
exports.eliminarAlbumService = async function(eliminarAlbum){
     //por implementar db
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la base de datos ${error.message}`}};
     }

     
     try {
          
          
          //Eliminacion de imagenes en el bucket
          let sqlComandImagenAlbum = `SELECT i.url_img FROM image i INNER JOIN album a ON i.id_album  = a.id_album  WHERE a.id_album = ${eliminarAlbum.id_album};`; 
          
          const [resultImageAlbum,fieldsImageAlbum] = conexion.query(sqlComandImagenAlbum);
          
          for (let i = 0; i < resultImageAlbum.length; i++) {
               // Encontrar el primer '/' después de 'https:'
               let index = resultImageAlbum[i].indexOf('/', 8); // 8 es la longitud de 'https://'
               // Separar en dos partes: antes del primer '/' y después
               let resto = resultImageAlbum[i].substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'

               // Dividir el resto por '/' para obtener las otras dos partes
               let splitResto = resto.split('/');

               const deleteImagen = new deleteImage(splitResto[0],splitResto[1]);
               const commandDelete = new DeleteObjectCommand(deleteImagen);
               await s3.send(commandDelete);// analizar si no da error al imagen que no exista en bucket
          }
          

          // Eliminacion de imagenes relacionados con el album
          let sqlComandEliminarImageAlbum = `SELECT i.id_image FROM image i 
                                     INNER JOIN album a ON i.id_album  = a.id_album  WHERE a.id_album = ${eliminarAlbum.id_album};`;

          const[resultEliminarImageAlbum, fieldsEliminarImageAlbum] = await conexion.query(sqlComandEliminarImageAlbum);
          
          for(let imagen of resultEliminarImageAlbum){
               try {
                    let sqlComandDeleteImage = `DELETE FROM image i WHERE i.id_image = ${imagen.id_image};`;
                    const[resultDeleteAlbum, fieldsDeleteAlbum] = await conexion.query(sqlComandDeleteImage);

               } catch (error) {
                    return {status:500, data:{error:`Error al eliminar imagen en album ${error}`}};
               }
               
          }

          // Inicio de eliminacion de album en db
          let sqlComand = `DELETE FROM album WHERE id_album =  "${eliminarAlbum.id_album}";`

          const[resultDeleteAlbum, fieldsDeleteAlbum] = await conexion.query(sqlComand);

          if(resultDeleteAlbum.affectedRows === 0){
               return {status:404, data:{error:'Error no se encontro album a eliminar'}};
          }
          return {status:200,data:{message:'Album eliminado exitosamente!!!'}};

     } catch (error) {
          return {status:500, data:{error:`Error al eliminar album ${error.message}`}};
     }
         
}


exports.holaAlbumService = function(){ 
     return new Promise(function(resolve,reject){
          resolve("Hola Mundo!!!!!");
         
     });
     
}
     
     