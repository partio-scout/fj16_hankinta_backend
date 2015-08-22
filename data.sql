INSERT INTO account (account_id,name,description) VALUES (0,'Tuntematon tili','Tuntematon tili: Tilinumero FIxxxyyyzzz');
INSERT INTO account (name,description) VALUES ('Testitili 1','Testitili 1: Tilinumero FIxxxyyyzzz');
INSERT INTO account (name,description) VALUES ('Testitili 2','Testitili 2: Tilinumero FIxxxyyyzzz');
INSERT INTO titlegroup (titlegroup_id,name,description) VALUES (0,'Tuntematon','Ei tunneta ryhmää');
INSERT INTO titlegroup (name,description) VALUES ('Rautatavara','Pultit ja mutterit');
INSERT INTO titlegroup (name,description) VALUES ('Puutavara','Laudat ja lankut');
INSERT INTO supplier (supplier_id,name,address,contact_person,phone,email,customer_number,business_id,terms_of_payment,terms_of_delivery,method_of_delivery) VALUES (0,'Tuntematon','Osoite tuntematon','Nimi tuntematon','000','tero@toimitta.ja','222','Y-222-222','Käteinen','Maksu ensin','Paikan päälle');
INSERT INTO supplier (name,address,contact_person,phone,email,customer_number,business_id,terms_of_payment,terms_of_delivery,method_of_delivery) VALUES ('Tmi Toimittaja','Toimituskatu 1','Tero Toimittaja','123','tero@toimitta.ja','222','Y-222-222','Käteinen','Maksu ensin','Paikan päälle');
INSERT INTO delivery (description,earliest,latest,address) VALUES ('Tavaroitten toimitus','2015-08-25','2015-08-27','Evo');
INSERT INTO costcenter (name) VALUES ('Roihun rahat');
INSERT INTO purchaseuser (name,phone,email,enlistment,user_section) VALUES ('Teuvo Tilaaja','123','teuvo@tilaa.ja','Ostaja','Palvelut');
INSERT INTO purchaseuser (name,phone,email,enlistment,user_section) VALUES ('Pekka Päällikkö','123','pekka@paallik.ko','Päällikkö','Palvelut');
INSERT INTO purchaseuser (name,phone,email,enlistment,user_section) VALUES ('Kaisa Controller','123','kaisa@controll.er','Controller','Palvelut');
INSERT INTO purchaseuser (name,phone,email,enlistment,user_section) VALUES ('Heidi Hankkija','123','heidi@hankki.ja','Hankkija','Palvelut');
INSERT INTO usageobject (name,master,controller,provider) VALUES ('Leiriostot',2,3,4);
INSERT INTO purchaseorder (name,costcenter_id,usageobject_id,subscriber) VALUES ('Leirin tavarat',1,1,1);
