from flask import request, jsonify
from sqlalchemy.orm import Session
from models.album import Album
from db.db import get_db

# Crear álbum
def create_album():
    data = request.get_json()
    db: Session = next(get_db())

    try:
        # Crear un nuevo álbum
        new_album = Album(
            name=data['name'],
            id_user=data['id_user']
        )

        db.add(new_album)
        db.commit()
        db.refresh(new_album)  # Refrescar para obtener el id del álbum creado

        return jsonify({
            'id_album': new_album.id_album,
            'name': new_album.name,
            'id_user': new_album.id_user
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Error al crear el álbum', 'error': str(e)}), 500

# Obtener un álbum por ID
def get_album():
    data = request.get_json()
    album_id = data.get('id_album')

    if album_id is None:
        return jsonify({'message': 'id_album es requerido'}), 400

    db: Session = next(get_db())
    album = db.query(Album).filter(Album.id_album == album_id).first()

    if album is None:
        return jsonify({'message': 'Álbum no encontrado'}), 404

    return jsonify({
        'id_album': album.id_album,
        'name': album.name,
        'id_user': album.id_user
    }), 200

# Editar un álbum
def update_album():
    data = request.get_json()
    album_id = data.get('id_album')

    db: Session = next(get_db())
    album = db.query(Album).filter(Album.id_album == album_id).first()

    if album is None:
        return jsonify({'message': 'Álbum no encontrado'}), 404

    try:
        # Actualizar los datos del álbum
        album.name = data.get('name', album.name)
        db.commit()

        return jsonify({
            'id_album': album.id_album,
            'name': album.name,
            'id_user': album.id_user
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Error al editar el álbum', 'error': str(e)}), 500

# Eliminar álbum
def delete_album():
    data = request.get_json()
    album_id = data.get('id_album')

    db: Session = next(get_db())
    album = db.query(Album).filter(Album.id_album == album_id).first()

    if album is None:
        return jsonify({'message': 'Álbum no encontrado'}), 404

    try:
        db.delete(album)
        db.commit()

        return jsonify({'message': 'Álbum eliminado correctamente'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Error al eliminar el álbum', 'error': str(e)}), 500
    

# Obtener todos los álbumes de un usuario
def get_all_album():
    data = request.get_json()
    user_id = data.get('id_user')

    if user_id is None:
        return jsonify({'message': 'id_user es requerido'}), 400

    db: Session = next(get_db())
    albums = db.query(Album).filter(Album.id_user == user_id).all()

    if not albums:
        return jsonify({'message': 'No se encontraron álbumes para este usuario'}), 404

    # Crear una lista de álbumes en formato JSON
    response = [{
        'id_album': album.id_album,
        'name': album.name,
        'id_user': album.id_user
    } for album in albums]

    return jsonify(response), 200
