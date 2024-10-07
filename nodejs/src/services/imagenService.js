const { PutObjectCommand,DeleteObjectCommand} = require('@aws-sdk/client-s3'); 
const {uploadImage} = require("../models/s3Model");
const {connection} = require('../../config/database');
const {s3} = require('../../config/awsS3');

// para rekognition
const {DetectTextCommand,DetectLabelsCommand} = require('@aws-sdk/client-rekognition'); 
const {detectTextImage,detectTextImageS3,detectLabelImage,detectLabelImageS3} = require("../models/rekognitionModel");
const {rekognition} = require('../../config/awsRekognition');

// para translate
const {translate} = require('../../config/awsTraslate');
const {TranslateTextCommand} = require("@aws-sdk/client-translate");
const {traducirALenguaje} = require("../models/translateModel");
/************************************************************************************
 * 
 * 
 *   OPERACIONES Image
 * 
 * 
 ************************************************************************************/

//fotos publicadas
const fotoPublicada = 'https://practica2-semi1-a-2s2024-imagenes-g7.s3.amazonaws.com/Fotos_Publicadas/';

// Crea un imagen
exports.crearImageService = async function(crearImage){
    //implementar la conexion con el bucker s3 y la db
    let conexion;
    try {
          conexion = await connection();
    } catch (error) {
          return {status:500, data:{error:`Erro al conectar a la base de datos: ${error.message}`}};
    }
    //variables
     
     const {name,description,id_album} = crearImage.body;
     
     let photo_url = `${fotoPublicada}${crearImage.file.originalname}`;
     //implementado s3
    
     const subirImagen = new uploadImage("Fotos_Publicadas",crearImage.file);
     
     const command = new PutObjectCommand(subirImagen);
     try {
          await s3.send(command);

     } catch (error) {
          return {status:502, data:{error:`Error al subir imagen en s3 errro:${error}`}};
     }
         
     try {
          sqlComandCreateImage = `INSERT INTO image (name,description,url_img,id_album) VALUES ("${name}","${description}","${photo_url}",${id_album});`
          const [resultCreateImage,fieldsCrearteImage] = await conexion.query(sqlComandCreateImage);

          //console.log(resultCreateImage);
          if(resultCreateImage.affectedRows === 0){
               return {status:500, data:{error:`Error, no se pudo crear imagen`}};
          }
          
          sqlComandGetImage = `SELECT i.id_image, i.name,i.description,i.url_img, i.id_album FROM image i WHERE i.id_image = ${resultCreateImage.insertId};`

          const [resultGetImage,fieldsGetAlbum] = await conexion.query(sqlComandGetImage);

          if(resultGetImage.length === 0){
               return {status:500, data:{error:`Error al obtener el album`}};
          }
          return {status:200,data:resultGetImage[0]};
     } catch (error) {
          return {status:500, data:{error:`Error al crear album ${error.message}`}};
     }      

}

//obtiene una imagen a traves de su id
exports.obtenerImageService = async function(obtenerImage){
     //por implementar s3 y db
     let conexion;
     const {id_image} = obtenerImage

     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la debe ${error.message}`}};
     }

     try {
          sqlComand = `SELECT i.id_image,i.name,i.description,i.url_img,i.id_album FROM image i WHERE id_image  = ${id_image};`
          const [resultGetImage,fieldsGetAlbum] = await conexion.query(sqlComand);
          
          if(resultGetImage.length === 0 ){
               return {status:404, data:{error:"Error,este album no posee el usuario"}};
          }
           return {status:200,data:resultGetImage[0]};

     } catch (error) {
          
          return {status:500, data:{error:`Error al obtener album ${error.menssage}`}};
     }
     
}

//obtiene todos los  albumes de un usuario con su id
exports.obtenerTodoImageUsuarioService = async function(obtenerImagenAlbum){
     //por implementar  db
     let conexion;
     const {id_album} = obtenerImagenAlbum
     
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la debe ${error.message}`}};
     }

     try {
          sqlComand = `SELECT  i.id_image,i.name,i.description,i.url_img FROM image i
          INNER JOIN album a  ON i.id_album  = a.id_album WHERE a.id_album = ${id_album} ;`
          
          const [resultGetAllImagenAlbum,fieldsGetallImageAlbum] = await conexion.query(sqlComand);
          
          /**
           * Condicional que sirve para para obtener imagenes del album
          */
          /*if(resultGetAllImagenAlbum.length === 0 ){
               return {error:"Error,este album no posee imagen"};
          }*/
           return {status:200,data:resultGetAllImagenAlbum};

     } catch (error) {
          console.log(error);
          return {status:500, data:{error:`Error al obtener album ${error.menssage}`}};
     }
     
}



//modifica el album actual
exports.modificarImageService = async function(modificarAlbum){
     //implementacion de la db
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la base de datos ${error.message}`}};
     }
     //variables
     const {id_image,name,description} = modificarAlbum.body;
     
     try {
          sqlComandMod = `UPDATE image SET name = "${name}",description = "${description}" WHERE id_image = ${id_image};`;
          const [resultModImage,fieldsModImage] = await conexion.query(sqlComandMod);
          

          if(resultModImage.affectedRows === 0){
               return {status:404, data:{error:`Error, no se encontro imagen a modificar`}};     
          }

          sqlComandGetImage = `SELECT i.id_image,i.name,i.description,i.url_img FROM image i WHERE i.id_image =  ${id_image};`;
          const [resultGetImage,fieldsGetImage] = await conexion.query(sqlComandGetImage);
          

          if(resultGetImage.length === 0){
               return {status:404, data:{error:`Error, no se encontro imagen a obtener`}};     
          }

          return {status:200, data:resultGetImage[0]};

     } catch (error) {
          return {status:500, data:{error:`Erro al modificar imagen ${error.menssage}`}};    
     }

}


//Elemina un album con su id
exports.eliminarImageService = async function(eliminarImage){
     //por implementar db
     let conexion;
     try {
          conexion = await connection();
     } catch (error) {
          return {status:503, data:{error:`Error al conectarse a la base de datos ${error.message}`}};
     }

     
     try {
          //Eliminacion de imagen en el bucket
          
          let sqlComandImagen = `SELECT i.url_img FROM image i WHERE i.id_image = ${eliminarImage.id_image};`; 
          
          const [resultImage,fieldsImage] = conexion.query(sqlComandImagen);
          
          if(resultImage.length !== 0){
               // Encontrar el primer '/' después de 'https:'
               let index = resultImage[0].indexOf('/', 8); // 8 es la longitud de 'https://'
               // Separar en dos partes: antes del primer '/' y después
               let resto = resultImage[0].substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'

               // Dividir el resto por '/' para obtener las otras dos partes
               let splitResto = resto.split('/');

               const deleteImagen = new deleteImage(splitResto[0],splitResto[1]);
               const commandDelete = new DeleteObjectCommand(deleteImagen);
               await s3.send(commandDelete);// analizar si no da error al imagen que no exista en bucket
          }
          
          //Eliminacion de la imagen en db
          let sqlComand = `DELETE FROM image i WHERE i.id_image = ${eliminarImage.id_image};`;
          const[resultDeleteImage, fieldsDeleteAlbum] = await conexion.query(sqlComand);

          if(resultDeleteImage.affectedRows === 0){
               return {status:404,data:{error:'Error no se encontro album a eliminar'}};
          }
          
          return {status:200, data:{message:'Imagen eliminado exitosamente!!!'}};
     } catch (error) {
          return {status:500, data:{error:`Error al eliminar imagen ${error.message}`}};
     }     
     
}

/*
*
*    Detectar Texto En Imagen
*/ 

exports.detectarTextoImageService = async function(detectarTextoImage){
     //implementar la conexion con el bucker s3 y la db
     let conexion;
     try {
           conexion = await connection();
     } catch (error) {
           return {status:503, data:{error:`Erro al conectar a la base de datos: ${error.message}`}};
     } 
      
     try {
          // Implementado rekognition
          const paramsRekognitionText = new detectTextImage(detectarTextoImage.file);
          const commandDectectText = new DetectTextCommand(paramsRekognitionText);
          const response = await rekognition.send(commandDectectText);
          //const response = await rekognition.detectText(paramsRekognitionText).promise();
          let texto = "";
          for(let textDetect of response.TextDetections){
               if(textDetect.Type === "LINE"){
                    texto += textDetect.DetectedText + "\n";
               }
          }
          return {status:200, data:{text:texto}};
          
 
     } catch (error) {
           return {status:500, data:{error:`Error al extraer texo de imagen:${error}`}};
     }
          

 }


 exports.detectarEtiquetaImageS3Service = async function(detectarEtiquetaImage){
     //implementar la conexion con el bucker s3 y la db
     
     let conexion;
     try {
           conexion = await connection();
     } catch (error) {
           return {status:503, data:{error:`Error al conectar a la base de datos: ${error.message}`}};
     }
     //variables
     const {url_img} = detectarEtiquetaImage.body;
           
     try {
          // Solicitamos el reconocimiento a AWS de las etiquetas 
          const paramsRekognitionLabel = new detectLabelImageS3(url_img);
          const commandDetectLabel = new DetectLabelsCommand(paramsRekognitionLabel);

          const response = await rekognition.send(commandDetectLabel);

          const etiquetaObtenida = response.Labels.map(detects => detects.Name);
          return {status:200, data:etiquetaObtenida};
          
 
     } catch (error) {
           return {status:500,data:{error:`Error al extraer texo de imagen:${error}`}};
     }
          

 }


 exports.traducirALenguajeService = async function(traducirLenguaje){
     //variables
     const {description} = traducirLenguaje.body;
     
     try {
          
          //parametro ingles
          const paramTranslateIngles = new traducirALenguaje(description,"en");
          const commandIngles = new TranslateTextCommand(paramTranslateIngles);
          const responseIngles = await translate.send(commandIngles);
          
          //parametro frances
          const paramTranslateFrances = new traducirALenguaje(description,"fr");
          const commandFrances = new TranslateTextCommand(paramTranslateFrances);
          const responseFrances = await translate.send(commandFrances);

          //parametro portugues
          const paramTranslatePortugues = new traducirALenguaje(description,"pt");
          const commandPortugues = new TranslateTextCommand(paramTranslatePortugues);
          const responsePortugues = await translate.send(commandPortugues);
          
          let response = {
               ingles:responseIngles.TranslatedText,
               frances:responseFrances.TranslatedText,
               portugues:responsePortugues.TranslatedText
          };
          return {status:200, data:response};
     } catch (error) {
          return {status:500, data:{error:`Error al traducir ${error}`}};
     } 
          
 }


//========================================================================
exports.holaImageService = function(){ 
     return new Promise(function(resolve,reject){
          resolve("Hola Mundo!!!!!");
         
     });
     
}
     
     