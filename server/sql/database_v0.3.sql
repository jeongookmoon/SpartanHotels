-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema spartanhotel
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `spartanhotel` ;

-- -----------------------------------------------------
-- Schema spartanhotel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `spartanhotel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `spartanhotel` ;

-- -----------------------------------------------------
-- Table `spartanhotel`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`user` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`user` (
  `user_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `reward` INT(11) NOT NULL DEFAULT 0,
  `access_code` VARCHAR(10) NULL DEFAULT NULL,
  `access_code_expiration` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `email` ON `spartanhotel`.`user` (`email` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `spartanhotel`.`guest`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`guest` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`guest` (
  `guest_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`guest_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spartanhotel`.`transaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`transaction` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`transaction` (
  `transaction_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED NULL DEFAULT NULL,
  `guest_id` INT(11) UNSIGNED NULL DEFAULT NULL,
  `total_price` DECIMAL(13,2) UNSIGNED NOT NULL,
  `cancellation_charge` DECIMAL(13,2) UNSIGNED NULL DEFAULT NULL,
  `date_in` DATE NOT NULL,
  `date_out` DATE NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `amount_paid` DECIMAL(13,2) NOT NULL DEFAULT 0,
  `stripe_id` VARCHAR(45) NULL,
  PRIMARY KEY (`transaction_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`hotel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`hotel` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`hotel` (
  `hotel_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NULL DEFAULT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `zipcode` INT(11) NOT NULL,
  `description` TEXT NOT NULL,
  `amenities` VARCHAR(255) NOT NULL,
  `rating` INT(11) NOT NULL,
  `longitude` VARCHAR(255) NULL DEFAULT NULL,
  `latitude` VARCHAR(255) NULL DEFAULT NULL,
  `geo_point` POINT NULL DEFAULT NULL,
  PRIMARY KEY (`hotel_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`hotel_image`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`hotel_image` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`hotel_image` (
  `hotel_image_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` INT(11) UNSIGNED NOT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`hotel_image_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`room`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`room` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`room` (
  `room_id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` INT(11) UNSIGNED NOT NULL,
  `room_number` INT(11) NOT NULL,
  `price` DECIMAL(13,2) NOT NULL,
  `bed_type` VARCHAR(255) NOT NULL,
  `capacity` INT(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`room_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`room_image`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`room_image` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`room_image` (
  `room_image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `hotel_id` INT(11) UNSIGNED NOT NULL,
  `bed_type` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`room_image_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`sessions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`sessions` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NOT NULL,
  `expires` INT(11) UNSIGNED NOT NULL,
  `data` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `spartanhotel`.`reward_reason`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`reward_reason` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`reward_reason` (
  `reward_reason_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reason` VARCHAR(45) NULL,
  PRIMARY KEY (`reward_reason_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spartanhotel`.`reward`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`reward` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`reward` (
  `reward_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `reward_reason_id` INT UNSIGNED NOT NULL,
  `transaction_id` INT UNSIGNED NULL,
  `date_active` DATE NOT NULL,
  `change` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`reward_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spartanhotel`.`review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`review` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`review` (
  `review_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hotel_id` INT UNSIGNED NOT NULL,
  `review` VARCHAR(255) NULL,
  `rating` TINYINT(3) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`review_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spartanhotel`.`promo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`promo` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`promo` (
  `promo_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `promo_code` VARCHAR(32) NOT NULL,
  `included_hotels` JSON NULL,
  `excluded_hotels` JSON NULL,
  `included_room_bed_types` JSON NULL,
  `promo_type` ENUM("FIXED", "PERCENTAGE", "GIFT") NULL,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  `amount` DECIMAL(13,2) NOT NULL,
  `min_amount` DECIMAL(13,2) NULL,
  PRIMARY KEY (`promo_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `spartanhotel`.`transaction_room`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`transaction_room` ;

CREATE TABLE IF NOT EXISTS `spartanhotel`.`transaction_room` (
  `transaction_room_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_id` INT UNSIGNED NOT NULL,
  `room_id` INT UNSIGNED NOT NULL,
  `room_price` DECIMAL(13,2) UNSIGNED NOT NULL,
  `date_in` DATE NULL,
  `date_out` DATE NULL,
  PRIMARY KEY (`transaction_room_id`))
ENGINE = InnoDB;

USE `spartanhotel` ;

-- -----------------------------------------------------
-- Placeholder table for view `spartanhotel`.`booking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `spartanhotel`.`booking` (`transaction_id` INT, `transaction_room_id` INT, `user_id` INT, `guest_id` INT, `total_price` INT, `cancellation_charge` INT, `date_in` INT, `date_out` INT, `status` INT, `amount_paid` INT, `stripe_id` INT, `room_id` INT, `room_price` INT);

-- -----------------------------------------------------
-- View `spartanhotel`.`booking`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `spartanhotel`.`booking`;
DROP VIEW IF EXISTS `spartanhotel`.`booking` ;
USE `spartanhotel`;
CREATE  OR REPLACE VIEW `booking` AS
    SELECT 
        T.transaction_id,
        TR.transaction_room_id,
        T.user_id,
        T.guest_id,
        T.total_price,
        T.cancellation_charge,
        COALESCE(TR.date_in, T.date_in) AS date_in,
        COALESCE(TR.date_out, T.date_out) AS date_out,
        T.status,
        T.amount_paid,
        T.stripe_id,
        TR.room_id,
        TR.room_price
    FROM
        transaction T
            JOIN
        transaction_room TR ON T.transaction_id = TR.transaction_id
;
USE `spartanhotel`;

DELIMITER $$

USE `spartanhotel`$$
DROP TRIGGER IF EXISTS `spartanhotel`.`hotel_BEFORE_INSERT` $$
USE `spartanhotel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `spartanhotel`.`hotel_BEFORE_INSERT` BEFORE INSERT ON `hotel` FOR EACH ROW
BEGIN
SET     NEW.geo_point = ST_GeomFromText(CONCAT('POINT(',NEW.latitude,' ',NEW.longitude,')'),4326);
END$$


USE `spartanhotel`$$
DROP TRIGGER IF EXISTS `spartanhotel`.`hotel_BEFORE_UPDATE` $$
USE `spartanhotel`$$
CREATE DEFINER = CURRENT_USER TRIGGER `spartanhotel`.`hotel_BEFORE_UPDATE` BEFORE UPDATE ON `hotel` FOR EACH ROW
BEGIN
SET     NEW.geo_point = ST_GeomFromText(CONCAT('POINT(',NEW.latitude,' ',NEW.longitude,')'),4326);
END$$


DELIMITER ;
GRANT ALL ON `spartanhotel`.* TO 'cmpe165'@'localhost';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
