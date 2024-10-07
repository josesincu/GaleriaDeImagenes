from flask import request, jsonify
from sqlalchemy.orm import Session
from datetime import datetime
from models.users import *
from models.image import *
from models.album import *
from db.db import get_db
from routes.uploadfile import *  # método de subir imagen
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import base64

def compare_faces(source_image, target_image_s3):
    response = rekognition_client.compare_faces(
        SourceImage={'Bytes': source_image},
        TargetImage={'S3Object': {'Bucket': os.getenv('S3_BUCKET'), 'Name': target_image_s3}},
        SimilarityThreshold=90  # Umbral de similitud (puedes ajustarlo)
    )
    return response

def login():
    data = request.get_json()
    db: Session = next(get_db())
    user = db.query(User).filter(User.email == data['email']).first()
    if user is None:
        return jsonify({'message':'Usuario no encontrado'})
    if not user.check_password(data['password']):
        return jsonify({'message':'Contraseña incorrecta'})
    response = {
        "id_user": user.id_user,
        "username": user.username,
        "email": user.email,
        "url_img": user.url_img
    }

    return jsonify(response)



# Método para obtener información de un usuario específico
def get_user():
    data = request.get_json()  # Obtener los datos del cuerpo de la solicitud
    user_id = data.get('id_user')  # Obtener el 'id_user' del JSON

    if user_id is None:
        return jsonify({'message': 'id_user es requerido'}), 400  # Validación si falta el id_user

    db: Session = next(get_db())  # Obtener la sesión de la base de datos
    user = db.query(User).filter(User.id_user == user_id).first()  # Buscar usuario por id_user

    if user is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404  # Retornar error si el usuario no existe

    # Crear la respuesta con la información del usuario
    response = {
        "id_user": user.id_user,
        "username": user.username,
        "email": user.email,
        "url_img": user.url_img
    }
    return jsonify(response), 200  # Retornar la información del usuario






def create_user():
    db: Session = next(get_db())

    # Obtener los datos del formulario form-data
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    #confirm_password = request.form.get('confirm_password')  # Obtener el campo de confirmación de contraseña
    file = request.files.get('url_img')  # Obtener el archivo de imagen desde el form-data

    '''if not username or not email or not password or not confirm_password or not file:
        return jsonify({"message": "Faltan campos requeridos"}), 400

    # Validar que las contraseñas coincidan
    if password != confirm_password:
        return jsonify({"message": "Las contraseñas no coinciden"}), 400'''

    # Subir la imagen de perfil a S3
    image_url = upload_img_perfil(file)
    if not image_url:
        return jsonify({"message": "Error al subir la imagen"}), 500

    # Crear el nuevo usuario
    try:
        new_user = User(
            username=username,
            email=email,
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  # Encriptar la contraseña
            url_img=image_url   # Guardar la URL de la imagen en la base de datos
        )
        db.add(new_user)
        db.commit()
        id_user = new_user.id_user
        print(id_user)
        #crear un album
        new_album = Album(
            id_user=id_user,
            name="Imagenes de perfil"
        )
        db.add(new_album)
        db.commit()
        id_album = new_album.id_album
        print(id_album)
        #crear una imagen
        name_img = secure_filename(file.filename)
        print(name_img)
        new_image = Image(
            name=name_img,
            description="Imagen de perfil",
            url_img=image_url,
            id_album=id_album
        )
        
        db.add(new_image)
        db.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Error al registrar usuario: {str(e)}"}), 500



def update_user():
    db: Session = next(get_db())

    user_id = request.form.get('id_user')
    new_password = request.form.get('password')
    #confirm_password = request.form.get('confirm_password')
    username = request.form.get('username')
    email = request.form.get('email')
    file = request.files.get('url_img')

    if not user_id:
        return jsonify({'message': 'id_user es requerido'}), 400

    user = db.query(User).filter(User.id_user == user_id).first()
    if user is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    # Actualizar los campos del usuario solo si se proporcionan
    if username:
        user.username = username
    if email:
        user.email = email
    if new_password:
        
        user.set_password(new_password)  # Encriptar la nueva contraseña
    if file:
        # Subir la nueva imagen de perfil a S3
        image_url = upload_img_perfil(file)
        if image_url:
            user.url_img = image_url

    try:
        db.commit()
        return jsonify({'message': 'Usuario actualizado con éxito'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Error al actualizar usuario: {str(e)}'}), 500



def delete_user():
    db: Session = next(get_db())
    data = request.get_json()
    user_id = data['id_user']
    password = data['password']  # Contraseña enviada en la solicitud

    if not user_id or not password:
        return jsonify({'message': 'id_user y contraseña son requeridos'}), 400

    # Buscar el usuario en la base de datos
    user = db.query(User).filter(User.id_user == user_id).first()
    if user is None:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    # Comparar la contraseña con la almacenada
    if not bcrypt.checkpw(password.encode('utf-8'),user.password.encode('utf-8')):  # Asegúrate de que user.password esté encriptada
        return jsonify({'message': 'Contraseña incorrecta'}), 403

    try:
        # Eliminar imágenes del bucket S3
        s3 = boto3.client('s3')
        bucket_name = 'tu-bucket-s3'

        # Buscar álbumes asociados al usuario
        albums = db.query(Album).filter(Album.id_user == user_id).all()
        
        for album in albums:
            # Buscar imágenes asociadas al álbum
            images = db.query(Image).filter(Image.id_album == album.id_album).all()
            
            for image in images:
                # Eliminar imagen del bucket S3
                #s3.delete_object(Bucket=bucket_name, Key=image.url_img)  # Asegúrate de tener una columna 's3_key' que almacene el nombre del archivo en S3
                
                # Eliminar imagen de la base de datos
                db.delete(image)
                db.commit()
            
            # Eliminar álbum de la base de datos
            
            db.delete(album)
            db.commit()

        # Finalmente, eliminar el usuario
        db.delete(user)
        db.commit()
        return jsonify({'message': 'Usuario y álbumes eliminados con éxito'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'message': f'Error al eliminar usuario: {str(e)}'}), 500
    


def create_rek():
    db: Session = next(get_db())

    # Obtener los datos del formulario form-data
    id_user = request.form.get('id_user')
   
    password = request.form.get('password')
    file = request.files.get('image')  # Obtener el archivo de imagen desde el form-data

    image_url = upload_img_Facial(file)
    if not image_url:
        return jsonify({"message": "Error al subir la imagen"}), 500

    # Crear el nuevo usuario
    try:
        
       
        #crear un album
        new_album = Album(
            id_user=id_user,
            name="Reconocimiento"
        )
        db.add(new_album)
        db.commit()
        id_album = new_album.id_album
        #crear una imagen
        name_img = secure_filename(file.filename)
        new_image = Image(
            name=name_img,
            description="Imagen de reconocimiento",
            url_img=image_url,
            id_album=id_album
        )
        
        db.add(new_image)
        db.commit()
        return jsonify({"message": "Reconocimiento facial creado"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"message": f"Error al reconocimiento facial: {str(e)}"}), 500


def validate_rek():
    try:
        # Obtener la imagen enviada desde el frontend
        data = request.json
        encoded_image = data['image'].split(",")[1]  # Ignorar el encabezado 'data:image/png;base64,'
        decoded_image = base64.b64decode(encoded_image)

        # Obtener la lista de archivos en el bucket de S3 para comparar
        response = s3_client.list_objects_v2(Bucket=os.getenv('S3_BUCKET'), Prefix='/Fotos_Reconocimiento_Facial')
        if 'Contents' not in response:
            return jsonify({'message': 'No se encontraron imágenes en el bucket.'}), 404
        
        # Comparar la imagen enviada con cada imagen en el bucket
        for obj in response['Contents']:
            if obj['Key'].endswith('.jpg') or obj['Key'].endswith('.png'):
                s3_image_key = obj['Key']
                
                # Realizar la comparación
                rekognition_response = compare_faces(decoded_image, s3_image_key)
                
                # Si se encuentra una coincidencia
                if rekognition_response['FaceMatches']:
                    match = rekognition_response['FaceMatches'][0]
                    similarity = match['Similarity']
                    return jsonify({
                        'message': 'Reconocimiento facial exitoso',
                        'matched_image': s3_image_key,
                        'similarity': similarity
                    }), 200
        
        # Si no hay coincidencias
        return jsonify({'message': 'No se encontraron coincidencias'}), 404

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Ocurrió un error en el reconocimiento facial'}), 500

