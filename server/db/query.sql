use midterm;

DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `Phone` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Address` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `Note` varchar(50) COLLATE utf8_unicode_ci,
  `Status` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `CreatedTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `CurCoordinates` JSON, 
  `NewCoordinates` JSON, 
  `NewAddress` varchar(150) COLLATE utf8_unicode_ci,
  `DriverId` int(11),
  PRIMARY KEY (`Id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SELECT * FROM requests;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Username` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL UNIQUE,
  `Password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Permission` int(11) NOT NULL,
  `Coordinates` JSON,
  `Status` varchar(30),
  `License` varchar(10),
  PRIMARY KEY (`Id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `refreshtoken`;
CREATE TABLE `refreshtoken` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `rftoken` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `rtd` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;