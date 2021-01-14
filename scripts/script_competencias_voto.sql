CREATE TABLE competencias (id int NOT NULL AUTO_INCREMENT, nombre varchar(200), PRIMARY KEY(id));

INSERT INTO competencias (nombre) VALUES ("MEJOR PELICULA PARA VER CON AMIGOS");
INSERT INTO competencias (nombre) VALUES ("LA PELICULA QUE VERIAS CON TU PAREJA");


CREATE TABLE registroVotos (id int NOT NULL AUTO_INCREMENT, competencia_id int(5), pelicula_id int (5), PRIMARY KEY(id));

ALTER TABLE competencias ADD COLUMN genero_id int(6);
ALTER TABLE competencias ADD COLUMN director_id int(6);
ALTER TABLE competencias ADD COLUMN actor_id int(6);
ALTER TABLE competencias ADD COLUMN estado int(2);

UPDATE competencias SET estado = 1 WHERE id = 1;
UPDATE competencias SET estado = 1 WHERE id = 2;

