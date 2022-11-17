CREATE TABLE main_info ( 
	id                      boolean DEFAULT true NOT NULL,
	password_hash_rgb				text NOT NULL,
	background_main_rgb     text NOT NULL,
	background_content_rgb  text NOT NULL,
	panel_rgb							  text NOT NULL,
	header_rgb				      text NOT NULL,
	details_rgb			        text NOT NULL,
	button_rgb		          text NOT NULL,
	highlight_rgb           text NOT NULL,
	CONSTRAINT pk_main_info PRIMARY KEY ( id )
);

ALTER TABLE main_info ADD CONSTRAINT cns_main_info CHECK ( id );

CREATE TABLE contact_info ( 
	id                  boolean DEFAULT true NOT NULL,
	street              text NOT NULL,
	zip_code						text NOT NULL,
	city                text NOT NULL,
	phone_number        text NOT NULL,
	mail                text NOT NULL,
	gmap_lat            decimal(20, 16) NOT NULL,
	gmap_lng            decimal(20, 16) NOT NULL,
	CONSTRAINT pk_contact_info PRIMARY KEY ( id )
);

CREATE TABLE image (
	name                text NOT NULL,
	visible							boolean NOT NULL,
	CONSTRAINT pk_image PRIMARY KEY ( name )
);

CREATE TABLE main_page_text_block (
	id 									smallserial NOT NULL,
	description 				text NOT NULL,
	image_name   				text,
	CONSTRAINT pk_text PRIMARY KEY ( id )
);

CREATE TABLE offer ( 
	id									serial NOT NULL,
	name             		text NOT NULL,
	for_whom            text NOT NULL,
	description         text NOT NULL,
	proposed_price      text NOT NULL,
	CONSTRAINT pk_offer PRIMARY KEY ( id )
);

CREATE TABLE horse ( 
	name                text NOT NULL,
	profile_image_name  text DEFAULT 'dummyImage.jpg' NOT NULL,
	description         text NOT NULL,
	CONSTRAINT pk_horse PRIMARY KEY ( name )
);

CREATE TABLE trainer ( 
	name                 text NOT NULL,
	profile_image_name   text DEFAULT 'dummyImage.jpg' NOT NULL,
	description          text NOT NULL,
	CONSTRAINT pk_trainer PRIMARY KEY ( name )
);

CREATE TABLE price_list ( 
 	id                  serial NOT NULL,
	name                text NOT NULL,
	price               text NOT NULL,
	CONSTRAINT pk_price_list PRIMARY KEY ( id )
);

CREATE TABLE image_horse_junction (
	image_name          text NOT NULL,
	horse_name          text,
	CONSTRAINT pk_image_horse_junction PRIMARY KEY ( image_name, horse_name )
);

CREATE TABLE image_trainer_junction (
	image_name          text NOT NULL,
	trainer_name        text,
	CONSTRAINT pk_image_trainer_junction PRIMARY KEY ( image_name, trainer_name )
);

CREATE TABLE image_offer_junction (
	image_name          text  NOT NULL,
	offer_id          	int NOT NULL,
	CONSTRAINT pk_image_offer_junction PRIMARY KEY ( image_name, offer_id )
);

ALTER TABLE contact_info ADD CONSTRAINT fk_contact_info_main_info FOREIGN KEY ( id ) REFERENCES main_info( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE horse ADD CONSTRAINT fk_horse_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE trainer ADD CONSTRAINT fk_trainer_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE main_page_text_block ADD CONSTRAINT fk_main_page_text_block_image FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE SET NULL ON UPDATE SET NULL;;

ALTER TABLE image_horse_junction ADD CONSTRAINT fk_image_horse_junction_1 FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE image_horse_junction ADD CONSTRAINT fk_image_horse_junction_2 FOREIGN KEY ( horse_name ) REFERENCES horse( name ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE image_trainer_junction ADD CONSTRAINT fk_image_trainer_junction_1 FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE image_trainer_junction ADD CONSTRAINT fk_image_trainer_junction_2 FOREIGN KEY ( trainer_name ) REFERENCES trainer( name ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE image_offer_junction ADD CONSTRAINT fk_image_offer_junction_1 FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE image_offer_junction ADD CONSTRAINT fk_image_offer_junction_2 FOREIGN KEY ( offer_id ) REFERENCES offer( id ) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE VIEW color_info_view AS
SELECT background_main_rgb 		as "backgroundMain",
			 background_content_rgb as "backgroundContent",
			 panel_rgb 							as panel,
			 header_rgb 						as header,
			 details_rgb 						as detail,
			 button_rgb 						as button,
			 highlight_rgb 					as highlight
FROM main_info
WHERE id = true;

CREATE VIEW contact_info_view AS
SELECT street,
			 zip_code			as "zipCode",
			 city,
			 phone_number as "phoneNumber",
			 mail, 
			 gmap_lat			as "gmapLat",
			 gmap_lng			as "gmapLng"
FROM contact_info
WHERE id = true;

CREATE VIEW image_list_view AS
SELECT name as image,
			 visible
FROM image;

CREATE VIEW text_block_list_view AS
SELECT id,
			 description,
			 image_name as image
FROM main_page_text_block;

CREATE VIEW horse_list_view AS
SELECT horse.name,
			 horse.description,
			 array_remove(array_prepend(horse.profile_image_name, array_agg(image_horse_junction.image_name)), NULL) as images
FROM horse
LEFT JOIN image_horse_junction ON horse.name = image_horse_junction.horse_name
GROUP BY name;

CREATE VIEW trainer_list_view AS
SELECT trainer.name,
			 trainer.description,
			 array_remove(array_prepend(trainer.profile_image_name, array_agg(image_trainer_junction.image_name)), NULL) as images
FROM trainer
LEFT JOIN image_trainer_junction ON trainer.name = image_trainer_junction.trainer_name
GROUP BY name;


INSERT INTO main_info VALUES(
	true,
	'$2b$15$7X95ZlV0ELPq.ljtRqRFFucEZAkWY0Ga8F3sYfsW3A97z2HBZ9yia',
	'#fff6de',
	'#fdffe8',
	'#ffffff',
	'#d19b5e',
	'#111111',
	'#000000',
	'#ffff82'
);
  
INSERT INTO contact_info VALUES( 
	true,
	'Podaj nazwę ulicy',
	'Podaj kod pocztowy',
	'Podaj miasto',
	'Ustan numer telefonu',
	'Ustaw adres email',
	0.01,
	0.01
);
