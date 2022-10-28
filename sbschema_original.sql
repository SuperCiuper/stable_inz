<schema name="public" >
		<table name="contact_info" prior="tbl" >
			<column name="id" type="boolean" jt="-7" mandatory="y" >
				<defo><![CDATA[true]]></defo>
			</column>
			<column name="street" type="text" jt="12" mandatory="y" >
				<defo><![CDATA['Street']]></defo>
			</column>
			<column name="zip_code" type="text" jt="12" mandatory="y" />
			<column name="city" type="text" jt="12" mandatory="y" >
				<defo><![CDATA['City']]></defo>
			</column>
			<column name="phone_number" type="decimal" length="9" decimal="0" jt="3" />
			<column name="mail" type="text" jt="12" />
			<column name="gmap_lat" prior="gmap_hash" type="numeric" length="9" decimal="6" jt="2" />
			<column name="gmap_lng" type="numeric" length="9" decimal="6" jt="2" />
			<index name="pk_contact_info" unique="PRIMARY_KEY" >
				<column name="id" />
			</index>
			<constraint name="cns_contact_info" >
				<string><![CDATA[phone_number >= 100000000]]></string>
			</constraint>
			<fk name="fk_contact_info_main_info" to_schema="public" to_table="main_info" delete_action="cascade" update_action="cascade" >
				<fk_column name="id" pk="id" />
			</fk>
		</table>
		<table name="horse" >
			<column name="name" type="text" length="50" jt="12" mandatory="y" />
			<column name="profile_image_id" prior="profile_image_name" type="smallint" jt="5" mandatory="y" />
			<column name="description" type="text" jt="12" mandatory="y" />
			<index name="pk_horse" unique="PRIMARY_KEY" >
				<column name="name" />
			</index>
			<index name="unq_horse_name" unique="UNIQUE_KEY" >
				<column name="name" />
			</index>
			<fk name="fk_horse_image" to_schema="public" to_table="image" >
				<fk_column name="profile_image_id" pk="id" />
			</fk>
		</table>
		<table name="image" prior="images" >
			<column name="id" prior="name" type="smallserial" jt="5" mandatory="y" />
			<column name="horse_name" type="text" length="100" jt="12" />
			<column name="trainer_name" type="text" length="100" jt="12" />
			<column name="offer_item" type="text" length="100" jt="12" />
			<column name="name" prior="type" type="text" jt="12" mandatory="y" />
			<index name="pk_image" unique="PRIMARY_KEY" >
				<column name="id" />
			</index>
			<fk name="fk_image_horse" to_schema="public" to_table="horse" delete_action="setNull" update_action="cascade" >
				<fk_column name="horse_name" pk="name" />
			</fk>
			<fk name="fk_image_trainer" to_schema="public" to_table="trainer" delete_action="setNull" update_action="cascade" >
				<fk_column name="trainer_name" pk="name" />
			</fk>
			<fk name="fk_image_offer" to_schema="public" to_table="offer" delete_action="setNull" update_action="cascade" >
				<fk_column name="offer_item" pk="item" />
			</fk>
		</table>
		<table name="main_info" prior="stable_info" >
			<column name="id" type="boolean" jt="-7" mandatory="y" >
				<defo><![CDATA[true]]></defo>
			</column>
			<column name="password_hash" prior="password" type="text" length="200" jt="12" mandatory="y" >
				<defo><![CDATA['admin']]></defo>
				<comment><![CDATA[change]]></comment>
			</column>
			<column name="main_theme_rgb" prior="colorset_id" type="text" jt="12" mandatory="y" >
				<defo><![CDATA[000000]]></defo>
			</column>
			<column name="support_theme_rgb" type="text" jt="12" mandatory="y" >
				<defo><![CDATA['ffffff']]></defo>
			</column>
			<column name="background_rgb" type="text" jt="12" mandatory="y" >
				<defo><![CDATA[666666]]></defo>
			</column>
			<column name="details_rgb" type="text" jt="12" mandatory="y" >
				<defo><![CDATA[000000]]></defo>
			</column>
			<column name="buttons_rgb" type="text" jt="12" mandatory="y" >
				<defo><![CDATA[000000]]></defo>
			</column>
			<column name="highlight_rgb" type="text" jt="12" mandatory="y" >
				<defo><![CDATA['ffda22']]></defo>
			</column>
			<index name="pk_main_info" unique="PRIMARY_KEY" >
				<column name="id" />
			</index>
			<constraint name="cns_main_info" >
				<string><![CDATA[id]]></string>
			</constraint>
		</table>
		<table name="offer" prior="tbl" >
			<column name="item" type="text" jt="12" mandatory="y" />
			<column name="for_whom" prior="for_who" type="text" jt="12" mandatory="y" />
			<column name="description" type="text" jt="12" mandatory="y" />
			<column name="proposed_price" type="text" jt="12" mandatory="y" />
			<index name="pk_offer" unique="PRIMARY_KEY" >
				<column name="item" />
			</index>
		</table>
		<table name="price_list" prior="tbl" >
			<column name="item" type="text" jt="12" mandatory="y" />
			<column name="price" type="decimal" length="8" decimal="2" jt="3" mandatory="y" />
			<index name="pk_price_list" unique="PRIMARY_KEY" >
				<column name="item" />
			</index>
		</table>
		<table name="text" prior="tbl" >
			<column name="id" type="serial" jt="-7" mandatory="y" />
			<column name="description" prior="main_page_description" type="text" jt="12" mandatory="y" />
			<column name="image_id" prior="main_page_image_id" type="smallint" jt="5" />
			<index name="pk_text" unique="PRIMARY_KEY" >
				<column name="id" />
			</index>
			<fk name="fk_text_main_info" to_schema="public" to_table="main_info" delete_action="cascade" update_action="cascade" options="" >
				<fk_column name="id" pk="id" />
			</fk>
			<fk name="fk_text_image" to_schema="public" to_table="image" >
				<fk_column name="image_id" pk="id" />
			</fk>
		</table>
		<table name="trainer" prior="coach" >
			<column name="name" type="text" jt="12" mandatory="y" />
			<column name="profile_image_id" prior="profile_image_name" type="smallint" jt="5" mandatory="y" />
			<column name="description" type="text" jt="12" mandatory="y" />
			<index name="pk_trainer" unique="PRIMARY_KEY" >
				<column name="name" />
			</index>
			<fk name="fk_trainer_image" to_schema="public" to_table="image" delete_action="setNull" update_action="setNull" >
				<fk_column name="profile_image_id" pk="id" />
			</fk>
		</table>
	</schema>	

CREATE  TABLE "public".main_info ( 
	id                   boolean DEFAULT true NOT NULL  ,
	name                 text DEFAULT 'Stable' NOT NULL  ,
	"password"           text DEFAULT 'admin' NOT NULL  ,
	main_theme_rgb       text DEFAULT 000000 NOT NULL  ,
	support_theme_rgb    text DEFAULT 'ffffff' NOT NULL  ,
	background_rgb       text DEFAULT 666666 NOT NULL  ,
	CONSTRAINT pk_main_info PRIMARY KEY ( id )
 );

ALTER TABLE "public".main_info ADD CONSTRAINT cns_main_info CHECK ( id );

CREATE  TABLE "public".offer ( 
	item                 text DEFAULT 'Item' NOT NULL  ,
	for_whom             text DEFAULT 'Everyone' NOT NULL  ,
	description          text DEFAULT 'Description' NOT NULL  ,
	proposed_price       text DEFAULT 'Proposed price' NOT NULL  ,
	CONSTRAINT pk_offer PRIMARY KEY ( item )
 );

CREATE  TABLE "public".price_list ( 
	item                 text DEFAULT 'Item' NOT NULL  ,
	price                decimal(8,2) DEFAULT 1.00 NOT NULL  ,
	CONSTRAINT pk_price_list PRIMARY KEY ( item )
 );

CREATE  TABLE "public".contact_info ( 
	id                   boolean DEFAULT true NOT NULL  ,
	city                 text DEFAULT 'City' NOT NULL  ,
	street               text DEFAULT 'Street' NOT NULL  ,
	phone_number         decimal(9,0)    ,
	mail                 text    ,
	gmap_hash            text    ,
	CONSTRAINT pk_contact_info PRIMARY KEY ( id )
 );

ALTER TABLE "public".contact_info ADD CONSTRAINT cns_contact_info CHECK ( phone_number >= 100000000 );

CREATE  TABLE "public".horse ( 
	name                 text  NOT NULL  ,
	profile_image_id     smallint    ,
	description          text DEFAULT 'Description' NOT NULL  ,
	CONSTRAINT pk_horse PRIMARY KEY ( name ),
	CONSTRAINT unq_horse_name UNIQUE ( name ) 
 );

CREATE  TABLE "public".image ( 
	id                   smallserial  NOT NULL  ,
	horse_name           text    ,
	trainer_name         text    ,
	offer_item           text    ,
	CONSTRAINT pk_image PRIMARY KEY ( id )
 );

CREATE  TABLE "public".text ( 
	id                   boolean DEFAULT true NOT NULL  ,
	main_page_description text DEFAULT 'Description' NOT NULL  ,
	main_page_image_id   smallint    ,
	CONSTRAINT pk_text PRIMARY KEY ( id )
 );

CREATE  TABLE "public".trainer ( 
	name                 text  NOT NULL  ,
	profile_image_id     smallint    ,
	description          text DEFAULT 'Description'   ,
	CONSTRAINT pk_trainer PRIMARY KEY ( name )
 );

ALTER TABLE "public".contact_info ADD CONSTRAINT fk_contact_info_main_info FOREIGN KEY ( id ) REFERENCES "public".main_info( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public".horse ADD CONSTRAINT fk_horse_image FOREIGN KEY ( profile_image_id ) REFERENCES "public".image( id );

ALTER TABLE "public".image ADD CONSTRAINT fk_image_horse FOREIGN KEY ( horse_name ) REFERENCES "public".horse( name ) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public".image ADD CONSTRAINT fk_image_trainer FOREIGN KEY ( trainer_name ) REFERENCES "public".trainer( name ) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public".image ADD CONSTRAINT fk_image_offer FOREIGN KEY ( offer_item ) REFERENCES "public".offer( item ) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public".text ADD CONSTRAINT fk_text_main_info FOREIGN KEY ( id ) REFERENCES "public".main_info( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public".text ADD CONSTRAINT fk_text_image FOREIGN KEY ( main_page_image_id ) REFERENCES "public".image( id );

ALTER TABLE "public".trainer ADD CONSTRAINT fk_trainer_image FOREIGN KEY ( profile_image_id ) REFERENCES "public".image( id ) ON DELETE SET NULL ON UPDATE SET NULL;
