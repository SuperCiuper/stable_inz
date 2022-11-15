CREATE TABLE main_info ( 
	id                 boolean DEFAULT true NOT NULL,
	password_hash				text NOT NULL,
	main_theme_rgb      text NOT NULL,
	support_theme_rgb   text NOT NULL,
	background_rgb      text NOT NULL,
	details_rgb         text NOT NULL,
	buttons_rgb         text NOT NULL,
	highlight_rgb       text NOT NULL,
	CONSTRAINT pk_main_info PRIMARY KEY ( id )
);

ALTER TABLE main_info ADD CONSTRAINT cns_main_info CHECK ( id );

CREATE TABLE contact_info ( 
	id                  boolean DEFAULT true NOT NULL,
	street              text NOT NULL,
	city                text NOT NULL,
	phone_number        text NOT NULL,
	mail                text NOT NULL,
	gmap_lat            decimal(20, 16) NOT NULL,
	gmap_lng            decimal(20, 16) NOT NULL,
	CONSTRAINT pk_contact_info PRIMARY KEY ( id )
);

CREATE TABLE image ( 
	name                text  NOT NULL,
	visible							boolean NOT NULL,
	horse_name          text,
	trainer_name        text,
	offer_name          text,
	CONSTRAINT pk_image PRIMARY KEY ( name )
);

CREATE TABLE main_page_text_block (
	id 									smallserial NOT NULL,
	description 				text NOT NULL,
	image_name   				text,
	CONSTRAINT pk_text PRIMARY KEY ( id )
);

CREATE TABLE offer ( 
	name             		text NOT NULL,
	for_whom            text NOT NULL,
	description         text NOT NULL,
	proposed_price      text NOT NULL,
	CONSTRAINT pk_offer PRIMARY KEY ( name )
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

ALTER TABLE contact_info ADD CONSTRAINT fk_contact_info_main_info FOREIGN KEY ( id ) REFERENCES main_info( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE horse ADD CONSTRAINT fk_horse_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE trainer ADD CONSTRAINT fk_trainer_image FOREIGN KEY ( profile_image_name ) REFERENCES image( name ) ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;
ALTER TABLE main_page_text_block ADD CONSTRAINT fk_main_page_text_block_image FOREIGN KEY ( image_name ) REFERENCES image( name ) ON DELETE SET NULL ON UPDATE SET NULL;;

ALTER TABLE image ADD CONSTRAINT fk_image_horse FOREIGN KEY ( horse_name ) REFERENCES horse( name ) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE image ADD CONSTRAINT fk_image_trainer FOREIGN KEY ( trainer_name ) REFERENCES trainer( name ) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE image ADD CONSTRAINT fk_image_offer FOREIGN KEY ( offer_name ) REFERENCES offer( name ) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO main_info VALUES(
	true,
	'$2b$15$7X95ZlV0ELPq.ljtRqRFFucEZAkWY0Ga8F3sYfsW3A97z2HBZ9yia',
	'fff6de',
	'd19b5e',
	'fdffe8',
	'111111',
	'FFFFFF',
	'FFFF82'
);
  
INSERT INTO contact_info VALUES( 
	true,
	'Podaj nazwę ulicy',
	'Podaj miasto',
	'Ustan numer telefonu',
	'Ustaw adres email',
	0,
	0
);
