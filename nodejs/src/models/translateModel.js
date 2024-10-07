function traducirALenguaje(texto,traducirA){
    return{
        Text: texto,
        SourceLanguageCode: "es", // Detecta el idioma automáticamente
        TargetLanguageCode: traducirA, // Especifica el idioma de destino
    };
};

module.exports = {traducirALenguaje}
