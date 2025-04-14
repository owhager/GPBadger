1.  made docker compose file: compose.yml
2.  ran script to compose 2 containers (1 for mysql and 1 for phpadmin): docker container exec -it e698f329c455 mysql -u root -p 
3.  open new terminal on local and run ssh tunnel:  ssh -L 3306:localhost:3306 CSLOGIN@cs506x15.cs.wisc.edu 
4.  open new connection in mysql workbench and connect to mysqlt15 (passowrd: shoelace)

![sql connection info](mysql-workbench-connection.png)

5.  create tables
6.  in virtual machine run: mysql -h localhost -P 3306 --protocol=TCP -u root -p 
7.  check to make sure tables and changes are reflected in virtual machine mysql container


user_login mysql (has not null, unique, and auto-incremented primary key, unique and not null username, and not null password ):
create user_login table

CREATE TABLE t15.user_login (
	iduser_login int auto_increment NOT NULL,
	email varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	password varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	first_name varchar(100) NULL,
	last_name varchar(100) NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (iduser_login),
	CONSTRAINT iduser_login_UNIQUE UNIQUE KEY (iduser_login),
	CONSTRAINT user_name_UNIQUE UNIQUE KEY (email)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
COMMENT='';

CREATE TABLE t15.user_fav (
	email TEXT NOT NULL,
	fav_code TEXT NOT NULL,
	id INT auto_increment NOT NULL,
	CONSTRAINT user_fav_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


