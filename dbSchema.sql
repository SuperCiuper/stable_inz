CREATE TABLE main_info ( 
	id                 boolean DEFAULT true NOT NULL,
	password_hash				text DEFAULT '$2a$15$ani0.9CJfR2.ta8ZPgtz.OclwaOdXh6VpN4iYJifJ5mUN2NAkLxpC' NOT NULL,
	main_theme_rgb      text DEFAULT 000000 NOT NULL,
	support_theme_rgb   text DEFAULT 'ffffff' NOT NULL,
	background_rgb      text DEFAULT 666666 NOT NULL,
	details_rgb         text DEFAULT 111111 NOT NULL,
	buttons_rgb         text DEFAULT 'FFFFFF' NOT NULL,
	highlight_rgb       text DEFAULT 'FFFF82' NOT NULL,
	CONSTRAINT pk_main_info PRIMARY KEY ( id )
);

ALTER TABLE main_info ADD CONSTRAINT cns_main_info CHECK ( id );

CREATE TABLE contact_info ( 
	id                  boolean DEFAULT true NOT NULL,
	street              text DEFAULT 'Street' NOT NULL,
	city                text DEFAULT 'City' NOT NULL,
	phone_number        decimal(9,0) DEFAULT 123456789 NOT NULL,
	mail                text DEFAULT 'stajnia.malta@gmail.com',
	gmap_lat            decimal(20, 16) DEFAULT '53.053995',
	gmap_lng            decimal(20, 16) DEFAULT '23.095907',
	CONSTRAINT pk_contact_info PRIMARY KEY ( id )
 );

ALTER TABLE contact_info ADD CONSTRAINT cns_contact_info_phone_number_min CHECK ( phone_number >= 100000000 );

CREATE TABLE image ( 
	name                text  NOT NULL,
	horse_name          text,
	trainer_name        text,
	offer_item          text,
	CONSTRAINT pk_image PRIMARY KEY ( name )
 );

CREATE TABLE main_page_text_block (
	id 									smallserial NOT NULL,
	description 				text DEFAULT 'Description' NOT NULL,
	image_name   				text,
	CONSTRAINT pk_text PRIMARY KEY ( id )
 );

CREATE TABLE offer ( 
	name             		text DEFAULT 'Item' NOT NULL,
	for_whom            text DEFAULT 'Everyone' NOT NULL,
	description         text DEFAULT 'Description' NOT NULL,
	proposed_price      text DEFAULT 'Proposed price' NOT NULL,
	CONSTRAINT pk_offer PRIMARY KEY ( name )
 );

CREATE TABLE horse ( 
	name                text NOT NULL,
	profile_image_name  text DEFAULT 0 NOT NULL,
	description         text DEFAULT 'Description' NOT NULL,
	CONSTRAINT pk_horse PRIMARY KEY ( name )
 );

CREATE TABLE trainer ( 
	name                 text NOT NULL,
	profile_image_name   text DEFAULT 0 NOT NULL,
	description          text DEFAULT 'Description' NOT NULL,
	CONSTRAINT pk_trainer PRIMARY KEY ( name )
 );

 CREATE TABLE price_list ( 
 	id                  serial NOT NULL,
	name                text DEFAULT 'Item' NOT NULL,
	price               text DEFAULT 'Price' NOT NULL,
	CONSTRAINT pk_price_list PRIMARY KEY ( id )
 );

ALTER TABLE contact_info ADD CONSTRAINT fk_contact_info_main_info FOREIGN KEY ( id ) REFERENCES main_info( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE horse ADD CONSTRAINT fk_horse_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE trainer ADD CONSTRAINT fk_trainer_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE main_page_text_block ADD CONSTRAINT fk_main_page_text_block_image FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE SET NULL ON UPDATE SET NULL;;

ALTER TABLE image ADD CONSTRAINT fk_image_horse FOREIGN KEY ( horse_name ) REFERENCES horse( name ) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE image ADD CONSTRAINT fk_image_trainer FOREIGN KEY ( trainer_name ) REFERENCES trainer( name ) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE image ADD CONSTRAINT fk_image_offer FOREIGN KEY ( offer_item ) REFERENCES offer( item ) ON DELETE SET NULL ON UPDATE CASCADE;

