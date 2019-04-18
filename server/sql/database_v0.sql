create database spartanhotel;
use spartanhotel;

CREATE TABLE hotel (
    hotel_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    phone_number varchar(255),
    address varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    state varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    zipcode int NOT NULL,
    description TEXT NOT NULL,
    amenities varchar(255) NOT NULL,
    rating int NOT NULL,
    longitude varchar(255),
    latitude varchar(255)
);

CREATE TABLE room (
    room_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    hotel_id int,
    room_number int NOT NULL,
    price decimal(13,2) NOT NULL,
    bed_type varchar(255) NOT NULL,
    bed_number int NOT NULL
);

CREATE TABLE user (
    user_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(255),
    password varchar(255),
    email varchar(255) NOT NULL UNIQUE,
    reward int
);

CREATE TABLE booking (
    booking_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    room_id int, 
    total_price decimal(13, 2) NOT NULL,
    cancellation_charge decimal(13, 2),
    date_in date NOT NULL,
    date_out date NOT NULL,
    status varchar(255) NOT NULL
);

CREATE TABLE room_image (
    room_image_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    hotel_id int,
    bed_type varchar(255) NOT NULL,
    url varchar(255)
);

CREATE TABLE hotel_image (
    hotel_image_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    hotel_id int, 
    url varchar(255)
);

GRANT ALL PRIVILEGES ON spartanhotel.*  TO 'cmpe165'@'localhost';
FLUSH PRIVILEGES;
