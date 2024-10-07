from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from models.base import Base 

import bcrypt

class User(Base):
    __tablename__ = 'users'
    id_user = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    password = Column(String(250), nullable=False)
    url_img = Column(String(200), nullable=True)

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

