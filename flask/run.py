from flask import Flask
from routes.users import *
from routes.image import *
from routes.album import *

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


#Metodo de Hola Mundo
@app.route('/', methods=['GET'])
def hello_world():
    return 'Hola Mundo!',200

#Rutas de Imagenes
#crear una imagen
app.add_url_rule('/create_imagen', 'create_image', create_image, methods=['POST'])
#obtener una imagen
app.add_url_rule('/get_imagen', 'get_image', get_image, methods=['GET'])
#obtener las imagenes de un album
app.add_url_rule('/get_all_imagen_album', 'get_all_imagen_album', get_all_imagen_album, methods=['POST'])
#Editar una imagen
app.add_url_rule('/update_imagen', 'update_imagen', update_imagen, methods=['PUT'])
#Eliminar una imagen
app.add_url_rule('/delete_imagen', 'delete_imagen', delete_imagen, methods=['DELETE'])
#extraer texto de una imagen
app.add_url_rule('/extract_text', 'extract_text', extract_text, methods=['POST'])
#Obtener etiquetas de una imagen
app.add_url_rule('/extract_label', 'extract_label', get_labels, methods=['POST'])


#Rutas de Usuarios
app.add_url_rule('/login_user', 'login', login, methods=['POST'])
#obtener un usuario por id
app.add_url_rule('/get_user', 'get_user', get_user, methods=['POST'])
#registrar un usuario form-data
app.add_url_rule('/create_user', 'create_user', create_user, methods=['POST'])
#actualizar un usuario form-data
app.add_url_rule('/update_user', 'update_user', update_user, methods=['PUT'])
#Eliminar un usuario form-data
app.add_url_rule('/delete_user', 'delete_user', delete_user, methods=['DELETE'])
#crear reconocimiento facial
app.add_url_rule('/upload_rekog', 'upload_rekog', create_rek, methods=['POST'])


#obtener reconocimiento facial
app.add_url_rule('/validate_rek', 'validate_rek', validate_rek, methods=['POST'])


#Crear album
app.add_url_rule('/create_album', 'create_album', create_album, methods=['POST'])
#Editar album
app.add_url_rule('/update_album', 'update_album', update_album, methods=['PUT'])
#Eliminar album
app.add_url_rule('/delete_album', 'delete_album', delete_album, methods=['DELETE'])
#Obtener un album
app.add_url_rule('/get_album', 'get_album', get_album, methods=['POST'])
#Obtener los albumes de un usuario 
app.add_url_rule('/get_all_album', 'get_all_album', get_all_album, methods=['POST'])





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)