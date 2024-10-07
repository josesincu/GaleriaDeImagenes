function RegistrarUsuario(nombre, apellido, fotoUsuario, correoElectronico, contrasena, confirmContrasena, fechaNacimiento){
    this.nombre = nombre;
    this.apellido = apellido;
    this.fotoUsuario = fotoUsuario;
    this.correoElectronico = correoElectronico;
    this.contrasena = contrasena;
    this.confirmContrasena = confirmContrasena;
    this.fechaNacimiento = fechaNacimiento;
}
module.exports = {RegistrarUsuario}