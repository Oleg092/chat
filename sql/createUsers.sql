CREATE TABLE users(
id int(11) AUTO_INCREMENT,
login varchar(25) NOT NULL,
email varchar(50) NOT NULL,
pass varchar(20) NOT NULL,
sex char(1) NOT NULL,
berd_date date NOT NULL,
name varchar(22) NOT NULL,
sur_name varchar(30) NOT NULL,
PRIMARY KEY (id) );
