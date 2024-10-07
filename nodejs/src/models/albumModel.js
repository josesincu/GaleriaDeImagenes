function crearPlaylist(nombre, descripcion, fotoPlaylist, esFavorito, idUsuario, idCancion){
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fotoPlaylist = fotoPlaylist;
    this.esFavorito = esFavorito;
    this.idUsuario = idUsuario;
    this.idCancion = idCancion;
}
module.exports = {crearPlaylist}