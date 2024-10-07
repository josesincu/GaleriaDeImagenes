/* dotenv nos permite leer las variables de entorno de nuestro .env */
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const mysql = require('mysql2/promise'); // libreria conexion a db



connection = async function(){
    try {
    
        return await mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || "3306",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASS || "dark",
            database: process.env.DB_NAME || "practica2"
        });
        //return connect;
    } catch (error) {
        console.log("Error al conectar con la base de datos");
        return {error:`Error al conectar a la base de datos ${error}`};
    }

}





/*
try {
    
    connection = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "3306",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "dark",
        database: process.env.DB_NAME || "practica1"
    });
    
} catch (error) {
    console.log("Error al conectar con la base de datos");
}
console.log(process.env.PORT);
console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_NAME)
*/

module.exports = {connection};