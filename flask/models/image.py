from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from models.base import Base 

class Image(Base):
    __tablename__ = 'image'
    id_image = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(String(255), nullable=True)
    url_img = Column(String(200), nullable=False)
    id_album = Column(Integer, nullable=False)