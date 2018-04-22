CREATE TABLE dialogue(
	id_dialogue int(4),
	id_1 int(11) NOT NULL,
	id_2 int(11) NOT NULL,
	PRIMARY KEY (id_dialogue)
);


CREATE TABLE message (
	id_message int(12),
	text_message varchar(2000),
	time_message time NOT NULL,
	date_message date NOT NULL,
	id_dialogue int(4),
	PRIMARY KEY (id_message),
	FOREIGN KEY (id_dialogue) REFERENCES dialogue(id_dialogue)
);