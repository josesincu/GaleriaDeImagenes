const bcrypt = require('bcrypt');
// Entre más rondas, mejor protección, pero más consumo de recursos. 10 está bien
const rondasDeSal = 10;

// Encriptamos la contrasenia
exports.EncriptarPass = async function(pass){
    palabraSecretaEncriptada = await bcrypt.hash(pass, rondasDeSal);
    return palabraSecretaEncriptada;
}

// Comparamos la comprasenia
exports.CompararPass = async function(pass,encriptada){
    const palabraSecretaValida = await bcrypt.compare(pass, encriptada);
    return palabraSecretaValida;
}

