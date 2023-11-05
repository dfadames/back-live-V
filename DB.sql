drop schema if exists LifeV;
create schema if not exists LifeV;
use LifeV;

-- ------ --
-- TABLAS --
-- ------ --

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

drop table if exists Usuario;
create table Usuario (id_usuario int auto_increment key not null, 
						id_perfil int,
						nombre_usuario varchar(100), 
						contrasena varchar(100),
						correo varchar(100),
                        foreign key (id_perfil) references LifeV.Perfil (id_perfil));


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

drop table if exists Perfil_tiene_Objetivo;
create table Perfil_tiene_Objetivo (
						id_perfil int,
                        id_objetivo int,
                        foreign key (id_perfil) references LifeV.Perfil (id_perfil),
                        foreign key (id_objetivo) references LifeV.Objetivo (id_objetivo));

drop table if exists Perfil_sigue_Dieta;
create table Perfil_sigue_Dieta (
						id_perfil int,
                        id_dieta int,
                        foreign key (id_perfil) references LifeV.Perfil (id_perfil),
                        foreign key (id_dieta) references LifeV.Dieta (id_dieta));

drop table if exists Objetivo_tiene_Dieta;
create table Objetivo_tiene_Dieta (
						id_objetivo int,
                        id_dieta int,
                        foreign key (id_objetivo) references LifeV.Objetivo (id_objetivo),
                        foreign key (id_dieta) references LifeV.Dieta (id_dieta));

drop table if exists Plato_pertenece_Dieta;
create table Plato_pertenece_Dieta (
						id_plato int,
                        id_dieta int,
                        foreign key (id_plato) references LifeV.Plato (id_plato),
                        foreign key (id_dieta) references LifeV.Dieta (id_dieta));

drop table if exists Plato_favorito_Perfil;
create table Plato_favorito_Perfil (
						id_perfil int,
                        id_plato int,
                        foreign key (id_perfil) references LifeV.Perfil (id_perfil),
                        foreign key (id_plato) references LifeV.Plato (id_plato));

drop table if exists Comida_pertenece_Plato;
create table Comida_pertenece_Plato (
						id_plato int,
                        id_comida int,
                        foreign key (id_plato) references LifeV.Plato (id_plato),
                        foreign key (id_comida) references LifeV.Comida (id_comida));

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

insert into Perfil (nombre, edad, genero, altura, peso, alergias, nivel_actividad_fisica) values ('Brandolfo Steven', 20, 'Masculino', 1.70, 90, 'Nueces', 'Moderadamente Activo');
insert into Perfil (nombre, edad, genero, altura, peso, alergias, nivel_actividad_fisica) values ('Pepita Pérez', 20, 'Femenino', 1.70, 55, null, 'Activo');

insert into Usuario (id_perfil, nombre_usuario, contrasena) values (1, 'bforerob', '12345678','emailfalso1@gmail.com');
insert into Usuario (id_perfil, nombre_usuario, contrasena) values (2, 'pepitap', '12345678','emailfalso2@gmail.com');

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

insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) values ('Agua', 'Agua potable', 0, 0, 0, 0, 'Bebida');
insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) values ('Lechona', 'Lechona con arroz', 800, 25, 20, 50, 'Alimento proteico');
insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) values ('Arroz', 'Lechona con arroz', 800, 25, 20, 50, 'Harina');

insert into Registro_comida (id_perfil, id_plato, fecha) values (1, 1, '2023-10-31');
insert into Registro_comida (id_perfil, id_plato, fecha) values (2, 2, '2023-10-31');

insert into Perfil_tiene_objetivo (id_perfil, id_objetivo) values (1, 1);
insert into Perfil_tiene_objetivo (id_perfil, id_objetivo) values (2, 2);

insert into Perfil_sigue_Dieta (id_perfil, id_dieta) values (1, 1);
insert into Perfil_sigue_Dieta (id_perfil, id_dieta) values (2, 2);

insert into Objetivo_tiene_Dieta (id_objetivo, id_dieta) values (1, 1);
insert into Objetivo_tiene_Dieta (id_objetivo, id_dieta) values (2, 2);

insert into Plato_pertenece_Dieta (id_plato, id_dieta) values (1, 1);
insert into Plato_pertenece_Dieta (id_plato, id_dieta) values (2, 2);

insert into Plato_favorito_Perfil (id_perfil, id_plato) values (1, 1);
insert into Plato_favorito_Perfil (id_perfil, id_plato) values (2, 2);

insert into Comida_pertenece_Plato (id_plato, id_comida) values (1, 1);
insert into Comida_pertenece_Plato (id_plato, id_comida) values (2, 2);
insert into Comida_pertenece_Plato (id_plato, id_comida) values (2, 3);

-- ------- --
-- Selects --
-- ------- --

select*from Usuario;
select*from Perfil;
select*from Progreso;
select*from Objetivo;
select*from Dieta;
select*from Plato;
select*from Comida;
select*from Registro_comida;
select Perfil.id_perfil, Objetivo.id_objetivo, Perfil.nombre, Objetivo.nombre_objetivo from Perfil_tiene_Objetivo join Perfil on Perfil_tiene_Objetivo.id_perfil = Perfil.id_perfil join Objetivo on Perfil_tiene_Objetivo.id_objetivo = Objetivo.id_objetivo;
select Perfil.id_perfil, Dieta.id_dieta, Perfil.nombre, Dieta.nombre_dieta from Perfil_sigue_Dieta join Perfil on Perfil_sigue_Dieta.id_perfil = Perfil.id_perfil join Dieta on Perfil_sigue_Dieta.id_dieta = Dieta.id_dieta;
select Objetivo.id_objetivo, Dieta.id_dieta, Objetivo.nombre_objetivo, Dieta.nombre_dieta from Objetivo_tiene_Dieta join Objetivo on Objetivo_tiene_Dieta.id_objetivo = Objetivo.id_objetivo join Dieta on Objetivo_tiene_Dieta.id_dieta = Dieta.id_dieta;
select Plato.id_plato, Dieta.id_dieta, Plato.nombre_plato, Dieta.nombre_dieta from Plato_pertenece_Dieta join Plato on Plato_pertenece_Dieta.id_plato = Plato.id_plato join Dieta on Plato_pertenece_Dieta.id_dieta = Dieta.id_dieta;
select Perfil.id_perfil, Plato.id_plato, Perfil.nombre, Plato.nombre_plato from Plato_favorito_Perfil join Plato on Plato_favorito_Perfil.id_plato = Plato.id_plato join Perfil on Plato_favorito_Perfil.id_perfil = Perfil.id_perfil;
select Plato.id_plato, Comida.id_comida, Plato.nombre_plato, Comida.nombre_comida from Comida_pertenece_Plato join Plato on Comida_pertenece_Plato.id_plato = Plato.id_plato join Comida on Comida_pertenece_Plato.id_comida = Comida.id_comida;
