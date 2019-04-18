use spartanhotel;

truncate table transaction;
truncate table transaction_room;
truncate table guest;
truncate table hotel;
truncate table hotel_image;
truncate table promo;
truncate table room;
truncate table room_image;
truncate table sessions;
truncate table review;
truncate table reward;
truncate table reward_reason;
truncate table user;

ALTER TABLE hotel DROP INDEX `geo_point`;
ALTER TABLE hotel
CHANGE COLUMN `geo_point` `geo_point` POINT NULL;

