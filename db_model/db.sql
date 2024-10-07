CREATE DATABASE db_semi1_p2;
USE db_semi1_p2;


CREATE TABLE users (
	id_user INT PRIMARY KEY auto_increment,
    username VARCHAR(200),
    email VARCHAR(200),
    password VARCHAR(250),
    url_img VARCHAR(200)
);

CREATE TABLE album(
	id_album INT PRIMARY KEY auto_increment,
	name VARCHAR(250),
	id_user INT,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE image(
	id_image INT PRIMARY KEY auto_increment,
    name VARCHAR(200),
    description VARCHAR(255),
    url_img VARCHAR(200),
    id_album INT,
    FOREIGN KEY (id_album) REFERENCES album(id_album) ON DELETE CASCADE
);