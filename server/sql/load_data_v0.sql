SHOW VARIABLES LIKE "secure_file_priv";

use spartanhotel;

load data infile "./data/Hotels_v0.csv" into table hotel
character set utf8mb4 
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows 
(@name, @phone_number,@address,@city, @state, @country, @zip,
 @description, @amenities, @rating, @longitude, @latitude)

set name=@name, phone_number=@phone_number, address=@address,
 city=@city, state=@state, country=@country, zipcode=@zip,
  description=@description, amenities=@amenities, rating=@rating,
   longitude=@longitude, latitude=@latitude
;

load data infile "./data/Rooms_v0.csv" into table room 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@hotel_id, @room_number, @price, @bed_type, @bed_number)

set hotel_id=@hotel_id, room_number=@room_number, price=@price,
 bed_type=@bed_type, bed_number=@bed_number
;

load data infile "./data/Booking_v0.csv" into table booking 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@user_id, @room_id, @total_price, @cancellation_charge, @date_in, @date_out, @status)

set user_id=@user_id, room_id=@room_id, total_price=@total_price,
 cancellation_charge=@cancellation_charge, date_in=@date_in, 
 date_out=@date_out, status=@status
;

load data infile "./data/Hotel_Image_v0.csv" into table hotel_image 
character set utf8mb4
fields terminated by "," enclosed by '"' 
lines terminated by "\r\n" 
ignore 1 rows
(@hotel_id, @url)

set hotel_id=@hotel_id, url=@url
;