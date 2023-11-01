drop schema if exists LifeV;
create schema if not exists LifeV;
use LifeV;

-- ------ --
-- TABLAS --
-- ------ --

drop table if exists Usuario;
create table Usuario (id_usuario int auto_increment key not null, 
						nombre_usuario varchar(100), 
						contrasena varchar(100));

drop table if exists Perfil;
create table Perfil (id_perfil int auto_increment key not null, 
						nombre varchar(100), 
                        edad int, 
                        genero varchar(100), 
                        altura float,
                        peso  float,
                        alergias varchar(100),
                        imc float as (peso / (altura * altura)), -- se puede incluir una tabla para clasificar
                        pgc float as (
							case
								when genero = 'Masculino' then (1.20*imc)+(0.23*edad)-(10.8*1)-5.4
								when genero = 'Femenino' then (1.20*imc)+(0.23*edad)-(10.8*2)-5.4
								else null
							end
						),
                        porcentaje_masa_magra float as (100-pgc),
                        nivel_actividad_fisica varchar(100), -- se puede incluir una tabla para clasificar
                        metabolismo_basal float as (
							case
								when genero = 'Masculino' and nivel_actividad_fisica = 'Sedentario' then 
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))*1.2
                                when genero = 'Masculino' and nivel_actividad_fisica = 'Poco activo' then 
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))*1.375
                                when genero = 'Masculino' and nivel_actividad_fisica = 'Moderadamente activo' then 
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))*1.55
                                when genero = 'Masculino' and nivel_actividad_fisica = 'Activo' then 
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))*1.725
                                when genero = 'Masculino' and nivel_actividad_fisica = 'Muy activo' then 
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))*1.9
								when genero = 'Femenino' and nivel_actividad_fisica = 'Sedentario' then 
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))*1.2
								when genero = 'Femenino' and nivel_actividad_fisica = 'Poco activo' then 
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))*1.375
                                when genero = 'Femenino' and nivel_actividad_fisica = 'Moderadamente activo' then 
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))*1.55
                                when genero = 'Femenino' and nivel_actividad_fisica = 'Activo' then 
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))*1.725
                                when genero = 'Femenino' and nivel_actividad_fisica = 'Muy activo' then 
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))*1.9
                                else null
                            end
                        ));

drop table if exists Progreso;
create table Progreso (id_progreso int auto_increment key not null,
						id_perfil int,
                        peso  float,
                        imc float,
                        pgc float,
                        porcentaje_masa_magra float,
                        nivel_actividad_fisica varchar(100),
                        metabolismo_basal float,
                        fecha datetime,
						foreign key (id_perfil) references LifeV.Perfil (id_perfil));

drop table if exists Objetivo;
create table Objetivo (id_objetivo int auto_increment key not null,
						nombre_objetivo varchar(100),
                        descripcion_objetivo varchar(100));
                        
drop table if exists Dieta;
create table Dieta (id_dieta int auto_increment key not null,
						nombre_dieta varchar(100),
                        descripcion_dieta varchar(100));

drop table if exists Plato;
create table Plato (id_plato int auto_increment key not null,
						nombre_plato varchar(100),
                        descripcion_plato varchar(100),
                        calorias float,
                        carbohidratos float,
                        proteinas float,
                        grasas float,
                        tipo varchar(100));

drop table if exists Comida;
create table Comida (id_comida int auto_increment key not null,
						nombre_comida varchar(100),
                        descripcion_comida varchar(100),
                        calorias float,
                        carbohidratos float,
                        proteinas float,
                        grasas float,
                        tipo varchar(100));

drop table if exists Registro_comida;
create table Registro_comida (id_registro_comida int auto_increment key not null,
						id_perfil int,
                        id_plato int,
                        fecha date,
						foreign key (id_perfil) references LifeV.Perfil (id_perfil),
                        foreign key (id_plato) references LifeV.Plato (id_plato));

-- -------- --
-- TRIGGERS --
-- -------- --

DELIMITER //
CREATE TRIGGER Calculos_progreso
BEFORE INSERT ON Progreso FOR EACH ROW
BEGIN

    SET NEW.imc = NEW.peso / (SELECT Perfil.altura * Perfil.altura FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil);

    SET NEW.pgc = (
        CASE
            WHEN (SELECT Perfil.genero FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) = 'Masculino' THEN
                (1.20 * NEW.imc) + (0.23 * (SELECT Perfil.edad FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil)) - (10.8 * 1) - 5.4
            WHEN (SELECT Perfil.genero FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) = 'Femenino' THEN
                (1.20 * NEW.imc) + (0.23 * (SELECT Perfil.edad FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil)) - (10.8 * 2) - 5.4
            ELSE NULL
        END
    );

    SET NEW.porcentaje_masa_magra = 100 - NEW.pgc;

    SET NEW.metabolismo_basal = (
        CASE
            WHEN (SELECT Perfil.genero FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) = 'Masculino' THEN
                (
                    (66.5 + (13.7 * NEW.peso) + (5 * (SELECT Perfil.altura FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) * 100) - (6.8 * (SELECT Perfil.edad FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil)))
                    *
                    (
                        CASE
                            WHEN NEW.nivel_actividad_fisica = 'Sedentario' THEN 1.2
                            WHEN NEW.nivel_actividad_fisica = 'Poco activo' THEN 1.375
                            WHEN NEW.nivel_actividad_fisica = 'Moderadamente activo' THEN 1.55
                            WHEN NEW.nivel_actividad_fisica = 'Activo' THEN 1.725
                            WHEN NEW.nivel_actividad_fisica = 'Muy activo' THEN 1.9
                            ELSE NULL
                        END
                    )
                )
            WHEN (SELECT Perfil.genero FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) = 'Femenino' THEN
                (
                    (665 + (9.6 * NEW.peso) + (1.8 * (SELECT Perfil.altura FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil) * 100) - (4.7 * (SELECT Perfil.edad FROM Perfil WHERE Perfil.id_perfil = NEW.id_perfil)))
                    *
                    (
                        CASE
                            WHEN NEW.nivel_actividad_fisica = 'Sedentario' THEN 1.2
                            WHEN NEW.nivel_actividad_fisica = 'Poco activo' THEN 1.375
                            WHEN NEW.nivel_actividad_fisica = 'Moderadamente activo' THEN 1.55
                            WHEN NEW.nivel_actividad_fisica = 'Activo' THEN 1.725
                            WHEN NEW.nivel_actividad_fisica = 'Muy activo' THEN 1.9
                            ELSE NULL
                        END
                    )
                )
            ELSE NULL
        END
    );
END;
//
DELIMITER ;

-- ------- --
-- INSERTS --
-- ------- --

insert into Usuario (nombre_usuario, contrasena) values ('bforerob', '12345678');
insert into Usuario (nombre_usuario, contrasena) values ('pepitap', '12345678');

insert into Perfil (nombre, edad, genero, altura, peso, alergias, nivel_actividad_fisica) values ('Brandolfo Steven', 20, 'Masculino', 1.70, 90, 'Nueces', 'Moderadamente Activo');
insert into Perfil (nombre, edad, genero, altura, peso, alergias, nivel_actividad_fisica) values ('Pepita Pérez', 20, 'Femenino', 1.70, 55, null, 'Activo');

insert into Progreso (id_perfil, peso, nivel_actividad_fisica, fecha) values (1, 120, 'Sedentario', '2023-5-1');
insert into Progreso (id_perfil, peso, nivel_actividad_fisica, fecha) values (1, 90, 'Moderadamente activo', '2023-10-1');
insert into Progreso (id_perfil, peso, nivel_actividad_fisica, fecha) values (2, 45, 'Muy activo', '2023-5-28');
insert into Progreso (id_perfil, peso, nivel_actividad_fisica, fecha) values (2, 55, 'Activo', '2023-10-28');

insert into Objetivo (nombre_objetivo, descripcion_objetivo) values ('Bajar de peso', 'Actualmente el usuario tiene obesidad grado 3 pero se propuso llegar a la meta de 80kg en 1 año');
insert into Objetivo (nombre_objetivo, descripcion_objetivo) values ('Subir de peso', 'Actualmente el usuario tiene bajo peso pero se propuso llegar a la meta de 60kg en 6 meses');

insert into Dieta (nombre_dieta, descripcion_dieta) values ('Dieta para bajar de peso', 'Se propone un deficit calorico y teniendo en cuenta no incluir comidas con nueces');
insert into Dieta (nombre_dieta, descripcion_dieta) values ('Dieta para subir de peso', 'Se propone un superavit calorico');

insert into Plato (nombre_plato, descripcion_plato, calorias, carbohidratos, proteinas, grasas, tipo) values ('Agua molida', 'Se muele el agua', 0, 0, 0, 0, 'Almuerzo');
insert into Plato (nombre_plato, descripcion_plato, calorias, carbohidratos, proteinas, grasas, tipo) values ('Lechona tolimense', 'Lechona con arroz', 800, 25, 20, 50, 'Desayuno');

insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) values ('Lechona', 'Lechona con arroz', 800, 25, 20, 50, 'Alimento proteico');
insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) values ('Arroz', 'Lechona con arroz', 800, 25, 20, 50, 'Harina');

insert into Registro_comida (id_perfil, id_plato, fecha) values (1, 1, '2023-10-31');
insert into Registro_comida (id_perfil, id_plato, fecha) values (2, 2, '2023-10-31');

select*from Usuario;
select*from Perfil;
select*from Progreso;
select*from Objetivo;
select*from Dieta;
select*from Plato;
select*from Comida;
select*from Registro_comida;