// Deteccion de textos en imagenes
function detectTextImage(file){
    return {
        Image: {
            Bytes: file.buffer
        }
    };
}

function detectTextImageS3(pathImage){
  let index = pathImage.indexOf('/', 8); // 8 es la longitud de 'https://'
  // Separar en dos partes: antes del primer '/' y después
  let rutaImagenBucket = pathImage.substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'
  return{
      Image: {
        S3Object: {
          Bucket: 'practica2-semi1-a-2s2024-imagenes-g7', //"images-website-uploaded"
          Name: rutaImagenBucket //"route/to/image.jpeg"
        }
      }
  };
}

// Deteccione de etiquetas en imagenes
function detectLabelImage(file){
  return {
    Image: {
        Bytes: file.buffer
    },
    MaxLabels: 10,  // Máximo número de etiquetas
    MinConfidence: 75  // Confianza mínima del 75%
}
}

function detectLabelImageS3(pathImage){
  let index = pathImage.indexOf('/', 8); // 8 es la longitud de 'https://'
  // Separar en dos partes: antes del primer '/' y después
  let rutaImagenBucket = pathImage.substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'

  return{
      Image: {
        S3Object: {
          Bucket: 'practica2-semi1-a-2s2024-imagenes-g7', //"images-website-uploaded"
          Name: rutaImagenBucket //"route/to/image.jpeg"
        }
      },
      MaxLabels: 10,  // Máximo número de etiquetas
      MinConfidence: 75  // Confianza mínima del 75%
    };
}

function compareFaceImageS3(sourceImage,pathFacial){
  let index = pathFacial.indexOf('/', 8); // 8 es la longitud de 'https://'
  // Separar en dos partes: antes del primer '/' y después
  
  //Descomentar por si acaso  ->  let rutaImagenBucket = pathFacial.substring(index + 1); // 'Fotos_Perfil/magodeOzI.jpeg'
  let rutaImagenBucket = pathFacial; //las imagenes del bucket ya estan configuradas por defecto xD
  return{
      SourceImage: {
        Bytes: sourceImage.buffer
      },
      TargetImage: {
        S3Object: {
          Bucket: 'practica2-semi1-a-2s2024-imagenes-g7',
          Name: rutaImagenBucket
        }
      },
      SimilarityThreshold: 70
  };
}

module.exports = {detectTextImage,detectTextImageS3,detectLabelImage,detectLabelImageS3,compareFaceImageS3};