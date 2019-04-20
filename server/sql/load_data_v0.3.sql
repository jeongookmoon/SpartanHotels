SHOW VARIABLES LIKE "secure_file_priv";

use spartanhotel;

load data infile "./data/v0.3/transaction_v0.3.csv" into table transaction 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@user_id, @guest_id, @total_price, @cancellation_charge, @date_in, @date_out, @status, @amount_paid)

set user_id=@user_id, guest_id=@guest_id, total_price=@total_price,
 cancellation_charge=@cancellation_charge, date_in=@date_in, 
 date_out=@date_out, status=@status, amount_paid=@amount_paid
;

load data infile "./data/Guest_v0.2.csv" into table guest 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@email, @name)

set email=@email, name=@name
;

load data infile "./data/v0.3/Hotels_v0.3.csv" into table hotel
character set utf8mb4 
fields terminated by ',' enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows 
(@name, @phone_number,@address,@city, @state, @country, @zip,
 @description, @amenities, @rating, @longitude, @latitude)


set name=@name, phone_number=@phone_number, address=@address,
 city=@city, state=@state, country=@country, zipcode=@zip,
  description=@description, amenities=@amenities, rating=@rating,
   longitude=@longitude, latitude=@latitude
;


UPDATE  spartanhotel.hotel
SET     geo_point = ST_GeomFromText(CONCAT('POINT(',latitude,' ',longitude,')'),4326);

ALTER TABLE `spartanhotel`.`hotel` 
CHANGE COLUMN `geo_point` `geo_point` POINT NOT NULL,
ADD SPATIAL INDEX (`geo_point`);



load data infile "./data/v0.3/Hotel_Image_v0.3.csv" into table hotel_image 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@hotel_id, @url)

set hotel_id=@hotel_id, url=@url
;

load data infile "./data/Reward_v0.2.csv" into table reward 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@user_id, @reward_reason_id, @transaction_id, @date_active, @change)

set user_id=@user_id, transaction_id=@transaction_id, reward_reason_id=@reward_reason_id,
 date_active=@date_active, `change`=@change
;

load data infile "./data/Reward_Reason_v0.2.csv" into table reward_reason
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@reason)

set reason=@reason
;

load data infile "./data/v0.3/Rooms_v0.3.csv" into table room 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@hotel_id, @room_number, @price, @bed_type, @capacity)

set hotel_id=@hotel_id, room_number=@room_number, price=@price,
 bed_type=@bed_type, capacity=@capacity
;

load data infile "./data/v0.3/Room_Image_v0.3.csv" into table room_image 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@hotel_id, @bed_type, @url, @description)

set hotel_id=@hotel_id, bed_type=@bed_type, url=@url, description=@description
;

load data infile "./data/User_v0.2.csv" into table user
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@name, @password, @email, @reward, @access_code, @access_code_expiration)

set name=@name, password=@password, email=@email, reward=@reward,
 access_code=@access_code,
  access_code_expiration= IF(@access_code_expiration='',CURRENT_TIMESTAMP,@access_code_expiration)
;



load data infile "./data/v0.3/transaction_room_v0.3.csv" into table transaction_room 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@transaction_id, @room_id, @room_price)

set transaction_id=@transaction_id, room_id=@room_id, room_price=@room_price
;
