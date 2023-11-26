drop schema if exists LifeV;
create schema if not exists LifeV;
use LifeV;

-- ------ --
-- TABLAS --
-- ------ --

drop table if exists Usuario;
create table Usuario (id_perfil int auto_increment key not null unique,
						nombre_usuario varchar(100) unique not null, 
						contrasena varchar(100) not null,
						correo varchar(100) unique not null);

drop table if exists Objetivo;
create table Objetivo (id_objetivo int auto_increment key not null unique,
						nombre_objetivo varchar(100) not null unique,
                        descripcion_objetivo varchar(100) not null);

drop table if exists Perfil;
create table Perfil (id_perfil int key not null unique, 
						nombre varchar(100) not null, 
                        edad int not null, 
                        genero varchar(100) not null, 
                        altura float not null,
                        peso  float not null,
                        alergias varchar(100),
                        habitos_dietarios int not null,
                        nombre_objetivo varchar(100) not null,
                        dieta varchar(100) not null,
                        favorita varchar(100) not null,
                        no_favorita varchar(100) not null,
                        imc float as (peso / (altura * altura)),
                        clasificacion_imc varchar(100) as (
							case
								when imc < 18.5 then 'Bajo peso'
                                when 18.5 <= imc and imc < 25 then 'Adecuado'
                                when 25 <= imc and imc < 30 then 'Sobrepeso'
                                when 30 <= imc and imc < 35 then 'Obesidad grado 1'
                                when 35 <= imc and imc < 40 then 'Obesidad grado 2'
                                when 40 <= imc then 'Obesidad grado 3'
								else null
							end
                        ),
                        pgc float as (
							case
								when genero = 'Masculino' then (1.20*imc)+(0.23*edad)-16.2
								when genero = 'Femenino' then (1.20*imc)+(0.23*edad)-5.4
								else null
							end
						),
                        porcentaje_masa_magra float as (100-pgc),
                        nivel_actividad_fisica varchar(100) not null,
                        metabolismo_basal float as (
							case
								when genero = 'Masculino' then
									(66.5 +(13.7*peso)+(5*altura*100)-(6.8*edad))
								when genero = 'Femenino' then
									(665 +(9.6*peso)+(1.8*altura*100)-(4.7*edad))
								else null
							end
                        ),
                        calorias_necesarias_diarias float as (
							case
								when nivel_actividad_fisica = 'Sedentario' then 
									metabolismo_basal*1.2
                                when nivel_actividad_fisica = 'Poco activo' then 
									metabolismo_basal*1.375
                                when nivel_actividad_fisica = 'Moderadamente activo' then 
									metabolismo_basal*1.55
                                when nivel_actividad_fisica = 'Activo' then 
									metabolismo_basal*1.725
                                when nivel_actividad_fisica = 'Muy activo' then 
									metabolismo_basal*1.9
                                else null
                            end
                        ),
                        calorias_ideales_diarias float as (
							case
								when nombre_objetivo = 'Bajar de peso' then calorias_necesarias_diarias*0.85
								when nombre_objetivo = 'Subir de peso' then calorias_necesarias_diarias*1.15
								else null
							end
                        ),
                        foreign key (id_perfil) references Usuario (id_perfil),
                        foreign key (nombre_objetivo) references Objetivo (nombre_objetivo));

drop table if exists Progreso;
create table Progreso (id_progreso int auto_increment key not null unique,
						id_perfil int not null,
                        peso  float not null,
                        imc float not null,
                        pgc float not null,
                        porcentaje_masa_magra float not null,
                        nivel_actividad_fisica varchar(100) not null,
                        metabolismo_basal float not null,
                        fecha datetime not null,
						foreign key (id_perfil) references Perfil (id_perfil));

drop table if exists Dieta;
create table Dieta (id_dieta int auto_increment key not null unique,
						nombre_dieta varchar(100) not null unique,
                        descripcion_dieta varchar(100) not null);

drop table if exists Plato;
create table Plato (id_plato int auto_increment key not null unique,
                        nombre_plato varchar(100) not null,
                        descripcion_plato varchar(100) not null,
                        calorias float not null,
                        carbohidratos float not null,
                        proteinas float not null,
                        grasas float not null,
                        tipo varchar(100) not null);

drop table if exists Comida;
create table Comida (id_comida int auto_increment key not null unique,
						nombre_comida varchar(100) not null,
                        descripcion_comida varchar(100) not null,
                        calorias float not null,
                        carbohidratos float not null,
                        proteinas float not null,
                        grasas float not null,
                        tipo varchar(100) not null);

drop table if exists Registro_comida;
create table Registro_comida (id_registro_comida int auto_increment key not null unique,
						id_perfil int not null,
                        id_plato int not null,
                        fecha date not null,
						foreign key (id_perfil) references Perfil (id_perfil),
                        foreign key (id_plato) references Plato (id_plato));

drop table if exists Objetivo_tiene_Dieta;
create table Objetivo_tiene_Dieta (
						id_objetivo int not null,
                        id_dieta int not null,
                        foreign key (id_objetivo) references Objetivo (id_objetivo),
                        foreign key (id_dieta) references Dieta (id_dieta));

drop table if exists Plato_pertenece_Dieta;
create table Plato_pertenece_Dieta (
						id_plato int not null,
                        id_dieta int not null,
                        foreign key (id_plato) references Plato (id_plato),
                        foreign key (id_dieta) references Dieta (id_dieta));

drop table if exists Comida_pertenece_Plato;
create table Comida_pertenece_Plato (
						id_plato int not null,
                        id_comida int not null,
                        foreign key (id_plato) references Plato (id_plato),
                        foreign key (id_comida) references Comida (id_comida));

-- ------- --
-- INSERTS --
-- ------- --

insert into Usuario (nombre_usuario, contrasena, correo) 
			 values ('bforerob', '12345678','emailfalso1@gmail.com');
insert into Usuario (nombre_usuario, contrasena, correo) 
			 values ('pepitap', '12345678','emailfalso2@gmail.com');

insert into Objetivo (nombre_objetivo, descripcion_objetivo) 
			  values ('Bajar de peso', 'Actualmente el usuario tiene obesidad grado 3 pero se propuso llegar a la meta de 80kg en 1 año');
insert into Objetivo (nombre_objetivo, descripcion_objetivo) 
			  values ('Subir de peso', 'Actualmente el usuario tiene bajo peso pero se propuso llegar a la meta de 60kg en 6 meses');

insert into Perfil (id_perfil, nombre, edad, genero, altura, peso, alergias, habitos_dietarios, nombre_objetivo, dieta, favorita, no_favorita, nivel_actividad_fisica) 
			values (1, 'Brandolfo Steven', 20, 'Masculino', 1.70, 90, 'Nueces', 3, 'Bajar de peso', 'Vegetariana', 'Agua molida', 'Changua', 'Moderadamente Activo');
insert into Perfil (id_perfil, nombre, edad, genero, altura, peso, alergias, habitos_dietarios, nombre_objetivo, dieta, favorita, no_favorita, nivel_actividad_fisica) 
			values (2, 'Pepita Pérez', 20, 'Femenino', 1.70, 55, null, 3, 'Subir de peso', 'Sin restriccion', 'Pizza', 'Changua', 'Activo');

insert into Progreso (id_perfil, peso, imc, pgc, porcentaje_masa_magra, nivel_actividad_fisica, metabolismo_basal, fecha) 
			  values (1, 120, 41.5225, 38.227, 61.773, 'Sedentario', 2909.4, '2023-5-1');
insert into Progreso (id_perfil, peso, imc, pgc, porcentaje_masa_magra, nivel_actividad_fisica, metabolismo_basal, fecha) 
			  values (1, 90, 31.1419, 25.7702, 74.2298, 'Moderadamente activo', 3120.93, '2023-10-1');
insert into Progreso (id_perfil, peso, imc, pgc, porcentaje_masa_magra, nivel_actividad_fisica, metabolismo_basal, fecha) 
			  values (2, 45, 15.5709, 17.8851, 82.1149, 'Muy activo', 2487.1, '2023-5-28');
insert into Progreso (id_perfil, peso, imc, pgc, porcentaje_masa_magra, nivel_actividad_fisica, metabolismo_basal, fecha) 
			  values (2, 55, 19.0311, 22.0374, 77.9626, 'Activo', 2423.62, '2023-10-28');

insert into Dieta (nombre_dieta, descripcion_dieta) 
		   values ('Vegetariana', 'No incluir carnes');
insert into Dieta (nombre_dieta, descripcion_dieta) 
		   values ('Sin restriccion', 'No se limitan las recomendaciones');

insert into Plato (nombre_plato, descripcion_plato, calorias, carbohidratos, proteinas, grasas, tipo) 
		   values ('Agua molida', 'Se muele el agua', 0, 0, 0, 0, 'Almuerzo');
insert into Plato (nombre_plato, descripcion_plato, calorias, carbohidratos, proteinas, grasas, tipo) 
		   values ('Lechona tolimense', 'Lechona con arroz', 800, 25, 20, 50, 'Desayuno');

insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) 
			values ('Agua', 'Agua potable', 0, 0, 0, 0, 'Bebida');
insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) 
			values ('Lechona', 'Lechona con arroz', 800, 25, 20, 50, 'Alimento proteico');
insert into Comida (nombre_comida, descripcion_comida, calorias, carbohidratos, proteinas, grasas, tipo) 
			values ('Arroz', 'Lechona con arroz', 800, 25, 20, 50, 'Harina');

insert into Registro_comida (id_perfil, id_plato, fecha) 
					 values (1, 1, '2023-10-31');
insert into Registro_comida (id_perfil, id_plato, fecha) 
					 values (2, 2, '2023-10-31');

insert into Objetivo_tiene_Dieta (id_objetivo, id_dieta) 
						  values (1, 1);
insert into Objetivo_tiene_Dieta (id_objetivo, id_dieta) 
						  values (2, 2);

insert into Plato_pertenece_Dieta (id_plato, id_dieta) 
						   values (1, 1);
insert into Plato_pertenece_Dieta (id_plato, id_dieta) 
						   values (2, 2);

insert into Comida_pertenece_Plato (id_plato, id_comida) 
							values (1, 1);
insert into Comida_pertenece_Plato (id_plato, id_comida) 
							values (2, 2);
insert into Comida_pertenece_Plato (id_plato, id_comida) 
							values (2, 3);

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
select Objetivo.id_objetivo, Dieta.id_dieta, Objetivo.nombre_objetivo, Dieta.nombre_dieta from Objetivo_tiene_Dieta join Objetivo on Objetivo_tiene_Dieta.id_objetivo = Objetivo.id_objetivo join Dieta on Objetivo_tiene_Dieta.id_dieta = Dieta.id_dieta;
select Plato.id_plato, Dieta.id_dieta, Plato.nombre_plato, Dieta.nombre_dieta from Plato_pertenece_Dieta join Plato on Plato_pertenece_Dieta.id_plato = Plato.id_plato join Dieta on Plato_pertenece_Dieta.id_dieta = Dieta.id_dieta;
select Plato.id_plato, Comida.id_comida, Plato.nombre_plato, Comida.nombre_comida from Comida_pertenece_Plato join Plato on Comida_pertenece_Plato.id_plato = Plato.id_plato join Comida on Comida_pertenece_Plato.id_comida = Comida.id_comida;
