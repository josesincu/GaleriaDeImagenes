const dotenv = require('dotenv');

// libreria que usa translate
const {TranslateClient} = require("@aws-sdk/client-translate");

dotenv.config({path: '../.env'});

//Inicializamos la instancia de AWS translate 
const translate = new TranslateClient({
    
    region: process.env.TRANSLATE_REGION,
    credentials: {
        accessKeyId: process.env.TRANSLATE_ACCESS_KEY,
        secretAccessKey: process.env.TRANSLATE_ACCESS_SECRET_KEY
    }
});

module.exports = {translate};

