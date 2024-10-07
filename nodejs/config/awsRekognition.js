const dotenv = require('dotenv');
const {RekognitionClient} = require('@aws-sdk/client-rekognition');// libreria que usa rekognition

dotenv.config({path: '../.env'});

//Inicializamos la instancia de AWS Rekognition 
    const rekognition = new RekognitionClient({
        region:process.env.REKOGNITION_REGION,
        credentials:{
            accessKeyId: process.env.REKOGNITION_ACCESS_KEY,
            secretAccessKey: process.env.REKOGNITION_ACCESS_SECRET_KEY
        }
        
    });
module.exports = {rekognition};