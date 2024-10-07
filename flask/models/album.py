from sqlalchemy import Column, Integer, String, ForeignKey
from models.base import Base

class Album(Base):
    __tablename__ = 'album'
    id_album = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user', ondelete='CASCADE'), nullable=False)
