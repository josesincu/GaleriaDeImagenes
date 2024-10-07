from flask import request, jsonify
from sqlalchemy.orm import Session
from datetime import datetime
from models.image import *
from routes.uploadfile import *
from db.db import get_db
import tempfile
from dotenv import load_dotenv
import os

def create_image():
    data = request.form
    file = request.files.get('url_img')
    #Subir imagen al S3
    url_img = None
    if file:
        url_img = upload_img_album(file)

    if url_img is None:
        return jsonify({"message": "Error al subir la imagen"}), 400
    
    db: Session = next(get_db())
    response = {}
    image = Image()

    try:
        image.name = data['name']
        image.description = data['description']
        image.url_img = url_img
        image.id_album = data['id_album']

        db.add(image)
        db.commit()

        response = {
        "id_imagen": image.id_image,
        "name": image.name,
        "descripcion": image.description,
        "url_image": image.url_img,
        "id_album": image.id_album
    }
    except Exception as e:
        response = {"message": "Error al crear la imagen"}
        print(e)
    return jsonify(response)
    
def get_image():
    data = request.get_json()
    db: Session = next(get_db())
    image = db.query(Image).filter(Image.id_image == data['id_imagen']).first()
    if image is None:
        return jsonify({"message": "Imagen no encontrada"}), 404
    
    response = {
        "id_imagen": image.id_image,
        "name": image.name,
        "description": image.description,
        "url_imagen": image.url_img
    }
    return jsonify(response)



# Obtener todas las imágenes de un álbum
def get_all_imagen_album():
    data = request.get_json()
    album_id = data.get('id_album')

    if album_id is None:
        return jsonify({'message': 'id_album es requerido'}), 400

    db: Session = next(get_db())
    images = db.query(Image).filter(Image.id_album == album_id).all()

    if not images:
        return jsonify({'message': 'No se encontraron imágenes para este álbum'}), 404

    # Crear una lista de imágenes en formato JSON
    response = [{
        'id_image': image.id_image,
        'name': image.name,
        'description': image.description,
        'url_img': image.url_img,
        'id_album': image.id_album
    } for image in images]
    print(response)

    return jsonify(response), 200

    
def update_imagen():
    data = request.get_json()
    image_id = data.get('id_imagen')

    if image_id is None:
        return jsonify({'message': 'id_imagen es requerido'}), 400

    db: Session = next(get_db())
    image = db.query(Image).filter(Image.id_image == image_id).first()

    if image is None:
        return jsonify({'message': 'Imagen no encontrada'}), 404

    # Actualizar solo los campos que se pasen en la solicitud
    if 'name' in data:
        image.name = data['name']
    if 'descripcion' in data:
        image.description = data['descripcion']

    try:
        db.commit()
        response = {
            "id_imagen": image.id_image,
            "name": image.name,
            "descripcion": image.description,
            "url_image": image.url_img,
            "id_album": image.id_album
        }
        return jsonify(response), 200
    except Exception as e:
        db.rollback()  # En caso de error, hacer rollback
        return jsonify({'message': 'Error al editar la imagen'}), 500


def delete_imagen():
    data = request.get_json()
    image_id = data.get('id_imagen')

    if image_id is None:
        return jsonify({'message': 'id_imagen es requerido'}), 400

    db: Session = next(get_db())
    image = db.query(Image).filter(Image.id_image == image_id).first()

    if image is None:
        return jsonify({'message': 'Imagen no encontrada'}), 404

    try:
        db.delete(image)
        db.commit()
        return jsonify({'message': 'Imagen eliminada correctamente'}), 200
    except Exception as e:
        db.rollback()  # En caso de error, hacer rollback
        return jsonify({'message': 'Error al eliminar la imagen'}), 500



def extract_text():
    file = request.files.get('image')
    if file is None:
        return jsonify({'error': 'No file provided'}), 400

    # Usa el directorio temporal del sistema
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, secure_filename(file.filename))
    
    # Guarda la imagen temporalmente
    file.save(file_path)

    # Llama a Rekognition para detectar texto
    with open(file_path, 'rb') as image:
        response = rekognition_client.detect_text(Image={'Bytes': image.read()})

    # Procesa la respuesta y extrae el texto
    detected_texts = set()  # Usar un conjunto para evitar duplicados
    for item in response['TextDetections']:
        if item['Type'] == 'LINE':  # Filtra solo las líneas de texto
            detected_texts.add(item['DetectedText'])

    # Elimina el archivo temporal
    os.remove(file_path)

    return jsonify({'text': ' '.join(detected_texts)})


def get_labels():
    try:
        # Obtener el nombre del archivo desde la solicitud
        data = request.json
        image_url = data['url_img']  # URL de la imagen en S3
        
        # Extraer el nombre del archivo desde el URL (es necesario que solo se proporcione el nombre, no el link completo)
        image_key = '/'.join(image_url.split('/')[-2:])

        # Llamar a Rekognition para detectar etiquetas
        response = rekognition_client.detect_labels(
            Image={
                'S3Object': {
                    'Bucket': os.getenv('S3_BUCKET'),
                    'Name': image_key
                }
            },
            MaxLabels=10,  # Máximo de 10 etiquetas
            MinConfidence=70  # Umbral de confianza
        )

        # Extraer etiquetas del resultado de Rekognition
        labels = response['Labels']
        extracted_labels = [label['Name'] for label in labels[:10]]  # Obtener entre 5 y 10 etiquetas

        # Asegurar que haya al menos 5 etiquetas
        extracted_labels = extracted_labels[:max(5, len(extracted_labels))]

        '''return jsonify({
            'status': 'success',
            'labels': extracted_labels
        }), 200'''
        return jsonify(extracted_labels), 200

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500