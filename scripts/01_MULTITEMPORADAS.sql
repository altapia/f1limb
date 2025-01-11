-- Está mal revisar

CREATE TABLE temporada (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR2(100) NOT NULL

);

CREATE TABLE participante (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    temporada_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (temporada_id) REFERENCES temporada(id) 
);

INSERT INTO temporada ( nombre) VALUES ( '2024');

INSERT INTO participante (user_id, team_id, temporada_id) 
SELECT id, teamId, 1 FROM user;



CREATE TABLE user_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre TEXT, 
    email text, 
    admin integer, 
    telegramId INTEGER
);

INSERT INTO user_new (id, nombre, email, admin, telegramId)
SELECT id, nombre, email, admin, telegramId FROM user;


ALTER TABLE apuesta ADD participante_id INTEGER REFERENCES participante(id);

UPDATE apuesta SET participante_id = (SELECT id FROM participante WHERE user_id = apuesta.userid AND temporada_id = 1);

CREATE TABLE apuesta_new (
id INTEGER PRIMARY KEY AUTOINCREMENT,
participante_id INTEGER,
gpId INTEGER,
descripcion TEXT,
importe NUMERIC,
cuota NUMERIC,
estado INTEGER, ganancia numeric,
FOREIGN KEY (participante_id) REFERENCES participante(id),
FOREIGN KEY (gpId) REFERENCES gp(id)
);

INSERT INTO apuesta_new (id, participante_id, gpId, descripcion, importe, cuota, estado, ganancia)
SELECT id, participante_id, gpId, descripcion, importe, cuota, estado, ganancia FROM apuesta;

DROP TABLE apuesta;
ALTER TABLE apuesta_new RENAME TO apuesta;

ALTER TABLE clasificacion ADD participante_id INTEGER REFERENCES participante(id);
UPDATE clasificacion SET participante_id = (SELECT id FROM participante WHERE user_id = clasificacion.userid AND temporada_id = 1);

CREATE TABLE clasificacion_new (
id INTEGER PRIMARY KEY AUTOINCREMENT,
participante_id Integer,
gpId Integer,
ganancia numeric,
puntos numeric, puesto numeric,
FOREIGN KEY(participante_id) REFERENCES participante(id),
FOREIGN KEY(gpId) REFERENCES gp(id)
);

INSERT INTO clasificacion_new (id, participante_id, gpId, ganancia, puntos, puesto)
SELECT id, participante_id, gpId, ganancia, puntos, puesto FROM clasificacion;

DROP TABLE clasificacion;
DROP VIEW v_tabla_clasificacion;
ALTER TABLE clasificacion_new RENAME TO clasificacion;


CREATE VIEW v_tabla_clasificacion 
AS 
 select u.id, u.nombre, 
 c1.puntos as GP1, 
 c2.puntos as GP2, 
 c3.puntos as GP3, 
 c4.puntos as GP4, 
 c5.puntos as GP5, 
 c6.puntos as GP6, 
 c7.puntos as GP7, 
 c8.puntos as GP8, 
 c9.puntos as GP9, 
 c10.puntos as GP10, 
 c11.puntos as GP11,
 c12.puntos as GP12,
 c13.puntos as GP13,
 c14.puntos as GP14,
 c15.puntos as GP15,
 c16.puntos as GP16,
 c17.puntos as GP17,
 c18.puntos as GP18,
 c19.puntos as GP19,
 c20.puntos as GP20,
 c21.puntos as GP21,
 c22.puntos as GP22,
 c23.puntos as GP23,
 c24.puntos as GP24,
 (IFNULL(c1.puntos,0) +  IFNULL(c2.puntos, 0) +  IFNULL(c3.puntos, 0) +  IFNULL(c4.puntos, 0) +  IFNULL(c5.puntos, 0) +  IFNULL(c6.puntos, 0) +  IFNULL(c7.puntos, 0) +  IFNULL(c8.puntos, 0) +  IFNULL(c9.puntos, 0) +  IFNULL(c10.puntos, 0) +  IFNULL(c11.puntos, 0) +  IFNULL(c12.puntos, 0) +  IFNULL(c13.puntos, 0) +  IFNULL(c14.puntos, 0) +  IFNULL(c15.puntos, 0) +  IFNULL(c16.puntos, 0) +  IFNULL(c17.puntos, 0) +  IFNULL(c18.puntos, 0) +  IFNULL(c19.puntos, 0) +  IFNULL(c20.puntos, 0) +  IFNULL(c21.puntos, 0) +  IFNULL(c22.puntos, 0) +  IFNULL(c23.puntos, 0) +  IFNULL(c24.puntos, 0)) as total
 from user u 
 left join clasificacion c1 on c1.userId = u.id and c1.gpid=1 
 left join clasificacion c2 on c2.userId = u.id and c2.gpid=2 
 left join clasificacion c3 on c3.userId = u.id and c3.gpid=3 
 left join clasificacion c4 on c4.userId = u.id and c4.gpid=4 
 left join clasificacion c5 on c5.userId = u.id and c5.gpid=5 
 left join clasificacion c6 on c6.userId = u.id and c6.gpid=6 
 left join clasificacion c7 on c7.userId = u.id and c7.gpid=7 
 left join clasificacion c8 on c8.userId = u.id and c8.gpid=8 
 left join clasificacion c9 on c9.userId = u.id and c9.gpid=9 
 left join clasificacion c10 on c10.userId = u.id and c10.gpid=10 
 left join clasificacion c11 on c11.userId = u.id and c11.gpid=11 
 left join clasificacion c12 on c12.userId = u.id and c12.gpid=12 
 left join clasificacion c13 on c13.userId = u.id and c13.gpid=13 
 left join clasificacion c14 on c14.userId = u.id and c14.gpid=14 
 left join clasificacion c15 on c15.userId = u.id and c15.gpid=15 
 left join clasificacion c16 on c16.userId = u.id and c16.gpid=16 
 left join clasificacion c17 on c17.userId = u.id and c17.gpid=17 
 left join clasificacion c18 on c18.userId = u.id and c18.gpid=18 
 left join clasificacion c19 on c19.userId = u.id and c19.gpid=19 
 left join clasificacion c20 on c20.userId = u.id and c20.gpid=20 
 left join clasificacion c21 on c21.userId = u.id and c21.gpid=21 
 left join clasificacion c22 on c22.userId = u.id and c22.gpid=22 
 left join clasificacion c23 on c23.userId = u.id and c23.gpid=23 
 left join clasificacion c24 on c24.userId = u.id and c24.gpid=24 
 ;


DROP VIEW v_tabla_clasificacion;

CREATE TABLE participante_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    temporada_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_new(id),
    FOREIGN KEY (team_id) REFERENCES team(id),
    FOREIGN KEY (temporada_id) REFERENCES temporada(id) 
);

CREATE TABLE apuesta_new (
id INTEGER PRIMARY KEY AUTOINCREMENT,
participante_id INTEGER,
gpId INTEGER,
descripcion TEXT,
importe NUMERIC,
cuota NUMERIC,
estado INTEGER, ganancia numeric,
FOREIGN KEY (participante_id) REFERENCES participante_new(id),
FOREIGN KEY (gpId) REFERENCES gp(id)
);

CREATE TABLE clasificacion_new (
id INTEGER PRIMARY KEY AUTOINCREMENT,
participante_id Integer,
gpId Integer,
ganancia numeric,
puntos numeric, puesto numeric,
FOREIGN KEY(participante_id) REFERENCES participante_new(id),
FOREIGN KEY(gpId) REFERENCES gp(id)
);

DROP TABLE apuesta;
DROP TABLE clasificacion;
DROP TABLE participante;
DROP TABLE user;

ALTER TABLE participante_new RENAME TO participante;
ALTER TABLE apuesta_new RENAME TO apuesta;
ALTER TABLE clasificacion_new RENAME TO clasificacion;
ALTER TABLE user_new RENAME TO user;


CREATE VIEW v_tabla_clasificacion 
AS 
 select u.id, u.nombre, 
 c1.puntos as GP1, 
 c2.puntos as GP2, 
 c3.puntos as GP3, 
 c4.puntos as GP4, 
 c5.puntos as GP5, 
 c6.puntos as GP6, 
 c7.puntos as GP7, 
 c8.puntos as GP8, 
 c9.puntos as GP9, 
 c10.puntos as GP10, 
 c11.puntos as GP11,
 c12.puntos as GP12,
 c13.puntos as GP13,
 c14.puntos as GP14,
 c15.puntos as GP15,
 c16.puntos as GP16,
 c17.puntos as GP17,
 c18.puntos as GP18,
 c19.puntos as GP19,
 c20.puntos as GP20,
 c21.puntos as GP21,
 c22.puntos as GP22,
 c23.puntos as GP23,
 c24.puntos as GP24,
 (IFNULL(c1.puntos,0) +  IFNULL(c2.puntos, 0) +  IFNULL(c3.puntos, 0) +  IFNULL(c4.puntos, 0) +  IFNULL(c5.puntos, 0) +  IFNULL(c6.puntos, 0) +  IFNULL(c7.puntos, 0) +  IFNULL(c8.puntos, 0) +  IFNULL(c9.puntos, 0) +  IFNULL(c10.puntos, 0) +  IFNULL(c11.puntos, 0) +  IFNULL(c12.puntos, 0) +  IFNULL(c13.puntos, 0) +  IFNULL(c14.puntos, 0) +  IFNULL(c15.puntos, 0) +  IFNULL(c16.puntos, 0) +  IFNULL(c17.puntos, 0) +  IFNULL(c18.puntos, 0) +  IFNULL(c19.puntos, 0) +  IFNULL(c20.puntos, 0) +  IFNULL(c21.puntos, 0) +  IFNULL(c22.puntos, 0) +  IFNULL(c23.puntos, 0) +  IFNULL(c24.puntos, 0)) as total
 from user u 
 left join clasificacion c1 on c1.participante_id = u.id and c1.gpid=1 
 left join clasificacion c2 on c2.participante_id = u.id and c2.gpid=2 
 left join clasificacion c3 on c3.participante_id = u.id and c3.gpid=3 
 left join clasificacion c4 on c4.participante_id = u.id and c4.gpid=4 
 left join clasificacion c5 on c5.participante_id = u.id and c5.gpid=5 
 left join clasificacion c6 on c6.participante_id = u.id and c6.gpid=6 
 left join clasificacion c7 on c7.participante_id = u.id and c7.gpid=7 
 left join clasificacion c8 on c8.participante_id = u.id and c8.gpid=8 
 left join clasificacion c9 on c9.participante_id = u.id and c9.gpid=9 
 left join clasificacion c10 on c10.participante_id = u.id and c10.gpid=10 
 left join clasificacion c11 on c11.participante_id = u.id and c11.gpid=11 
 left join clasificacion c12 on c12.participante_id = u.id and c12.gpid=12 
 left join clasificacion c13 on c13.participante_id = u.id and c13.gpid=13 
 left join clasificacion c14 on c14.participante_id = u.id and c14.gpid=14 
 left join clasificacion c15 on c15.participante_id = u.id and c15.gpid=15 
 left join clasificacion c16 on c16.participante_id = u.id and c16.gpid=16 
 left join clasificacion c17 on c17.participante_id = u.id and c17.gpid=17 
 left join clasificacion c18 on c18.participante_id = u.id and c18.gpid=18 
 left join clasificacion c19 on c19.participante_id = u.id and c19.gpid=19 
 left join clasificacion c20 on c20.participante_id = u.id and c20.gpid=20 
 left join clasificacion c21 on c21.participante_id = u.id and c21.gpid=21 
 left join clasificacion c22 on c22.participante_id = u.id and c22.gpid=22 
 left join clasificacion c23 on c23.participante_id = u.id and c23.gpid=23 
 left join clasificacion c24 on c24.participante_id = u.id and c24.gpid=24 
 ;

 
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(1, 1, 1, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(2, 2, 1, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(3, 3, 2, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(4, 4, 3, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(5, 5, 3, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(6, 6, 4, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(7, 7, 2, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(8, 8, 5, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(9, 9, 5, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(10, 10 ,4, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(11, 11 ,6, 1);
INSERT INTO participante (id, user_id, team_id, temporada_id) VALUES(12, 12 ,6, 1);


ALTER TABLE config ADD COLUMN temporada_id INTEGER REFERENCES temporada(id);
UPDATE config SET temporada_id = 1;
ALTER TABLE config MODIFY COLUMN temporada_id INTEGER NOT NULL REFERENCES temporada(id);


CREATE TABLE config_new (key TEXT NOT NULL UNIQUE, value TEXT NOT NULL, temporada_id INTEGER NOT NULL REFERENCES temporada(id));
INSERT INTO config_new (key, value, temporada_id) SELECT key, value, 1 FROM config;
DROP TABLE config;
ALTER TABLE config_new RENAME TO config;

ALTER TABLE gp ADD COLUMN temporada_id INTEGER REFERENCES temporada(id);
UPDATE gp SET temporada_id = 1;