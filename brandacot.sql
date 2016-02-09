-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: brandacot
-- ------------------------------------------------------
-- Server version	5.5.44-0+deb8u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admin_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `login` varchar(100) NOT NULL,
  `mdp` varchar(100) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'brandacot','brandacot33');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lama`
--

DROP TABLE IF EXISTS `lama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lama` (
  `id_lama` int(11) NOT NULL AUTO_INCREMENT,
  `date_lama` datetime NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id_lama`)
) ENGINE=MyISAM AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lama`
--

LOCK TABLES `lama` WRITE;
/*!40000 ALTER TABLE `lama` DISABLE KEYS */;
/*!40000 ALTER TABLE `lama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lien`
--

DROP TABLE IF EXISTS `lien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lien` (
  `id_lien` tinyint(4) NOT NULL AUTO_INCREMENT,
  `description` text,
  `libelle` text,
  `url` text,
  PRIMARY KEY (`id_lien`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lien`
--

LOCK TABLES `lien` WRITE;
/*!40000 ALTER TABLE `lien` DISABLE KEYS */;
INSERT INTO `lien` VALUES (6,'A 7 km - La citadelle de Blaye classÃ©e au patrimoine mondial de l\'UNESCO, visite guidÃ©e par les souterrains.','tourisme','http://www.tourisme-blaye.com'),(4,'Enfant Bordeaux','','http://bordeaux.citizenkid.com'),(5,'Office de tourisme de BLAYE ','tourisme','http://www.tourisme-blaye.com'),(8,'Producteur de Safran - Ferme de DÃ©couverte','tourisme','http://www.safrandebordeaux.fr'),(9,'Camping Le Maine Blanc (***)  Ã  St Christoly  tÃ©l. 05 57 42 52 81','camping',''),(10,'Camping Municipal de la Citadelle (**) Ã  BLAYE  TÃ©l. 05 57 42 00 20','camping',''),(11,'Camping municipal de Braud et St Louis  (**) ','camping','http://www.mairie-braud.com'),(12,'A  St Ciers de Canesse - 8 km  HÃ´tel *** Restaurant La Closerie des Vignes','hotelresto','http://www.hotel-restaurant-gironde.com'),(13,'A St Seurin de Cursac - 5 km -  Hôtel Restaurant La Renaissance','hotelresto','http://www.larenaissance33.com'),(14,'A 1 km - Les Denias  tÃ©l. 05 57 64 32 93  - 06 28 27 46 00','chambrehote','http://lesdenias.com'),(15,'A 7km - Saint Martin Lacaussade ','chambrehote','http://www.chateau-fredignac.fr/'),(16,'A Blaye - 7 km - Villa Premayac  ','chambrehote','http://www.villa-premayac.com'),(17,'A St Seurin de Cursac - 5 km -  HÃ´tel Restaurant La Renaissance ','gastronomie','http://www.larenaissance33.com'),(18,'A  Blaye - 7 km Auberge du Porche ','gastronomie','http://www.auberge-du-porche.com'),(19,'Sur place - ChÃ¢teau du Bois Lafont\r\nTÃ©l. 05 57 42 28 11\r\n','chateauviti',''),(22,'TraversÃ©e de la Gironde, BAC BLAYE/LAMARQUE \r\nTÃ©l.05 57 42 04 49\r\n','transport','');
/*!40000 ALTER TABLE `lien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_lama`
--

DROP TABLE IF EXISTS `media_lama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_lama` (
  `id_media_lama` int(11) NOT NULL AUTO_INCREMENT,
  `id_lama` int(11) NOT NULL,
  `url_media` varchar(250) NOT NULL,
  `url_apercu` varchar(250) NOT NULL,
  `type_media` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_media_lama`,`id_lama`)
) ENGINE=MyISAM AUTO_INCREMENT=99 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_lama`
--

LOCK TABLES `media_lama` WRITE;
/*!40000 ALTER TABLE `media_lama` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_lama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_news`
--

DROP TABLE IF EXISTS `media_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_news` (
  `id_media_news` int(11) NOT NULL AUTO_INCREMENT,
  `id_news` int(11) NOT NULL,
  `url_media` varchar(250) NOT NULL,
  `url_apercu` varchar(250) NOT NULL,
  `type_media` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_media_news`,`id_news`)
) ENGINE=MyISAM AUTO_INCREMENT=115 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_news`
--

LOCK TABLES `media_news` WRITE;
/*!40000 ALTER TABLE `media_news` DISABLE KEYS */;
INSERT INTO `media_news` VALUES (92,61,'http://www.fermelama.com/actu/jour_de_l_an_00643879.jpg','http://www.fermelama.com/actu/vignette/jour_de_l_an_00643879.jpg',0),(90,61,'http://www.fermelama.com/actu/3027163.jpg','http://www.fermelama.com/actu/vignette/3027163.jpg',0),(91,61,'http://www.fermelama.com/actu/nov10310.jpg','http://www.fermelama.com/actu/vignette/nov10310.jpg',0),(83,22,'http://www.fermelama.com/actu/img_346295036.jpg','http://www.fermelama.com/actu/vignette/img_346295036.jpg',0),(71,36,'http://www.fermelama.com/actu/kako_00574413.jpg','http://www.fermelama.com/actu/vignette/kako_00574413.jpg',0),(73,36,'http://www.fermelama.com/actu/25_sept_2011_01186625.jpg','http://www.fermelama.com/actu/vignette/25_sept_2011_01186625.jpg',0),(113,84,'http://www.fermelama.com/actu/juin_2015_05693859.jpg','http://www.fermelama.com/actu/vignette/juin_2015_05693859.jpg',0),(114,84,'http://www.fermelama.com/actu/juin_2015_03912460.jpg','http://www.fermelama.com/actu/vignette/juin_2015_03912460.jpg',0);
/*!40000 ALTER TABLE `media_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id_news` int(11) NOT NULL AUTO_INCREMENT,
  `date_news` datetime NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id_news`)
) ENGINE=MyISAM AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (41,'2013-04-17 00:00:00','ATELIER SUPPLEMENTAIRE POUR LES ECOLES PRIMAIRES.\r\nEn plus de nos ateliers existants, nous crÃ©ons actuellement un atelier dont le thÃ¨me est l\'AMERIQUE DU SUD. Dans quelques jours cet atelier figurera sur notre fiche pÃ©dagogique (tÃ©lÃ©chargeable) \r\nPour l\'instant, nous contacter. '),(22,'2011-06-29 00:00:00','LAMA GARDIEN DE TROUPEAU. Dans le cadre de notre spÃ©cialitÃ© Lama Gardien de Troupeau, notre dernier lama sÃ©lectionnÃ© a Ã©tÃ© vendu. Pour toute demande, nous contacter pour une nouvelle sÃ©lection. '),(35,'2011-10-14 00:00:00','REPORTAGE SUR DIRECT 8\r\nDans le cadre de notre spÃ©cialisÃ© de \"lama gardien de troupeau\" un tournage a Ã©tÃ© effectuÃ© sur notre Ã©levage le 14 septembre dernier. La diffusion de ce reportage est prÃ©vue le dimanche 16 octobre prochain, 11h30, Ã©mission Les animaux de la 8 sur Direct 8.'),(36,'2011-09-19 00:00:00','KAKO, alpaga suri.\r\nKako de Garenne est un jeune alpaga Suri entier que nous venons d\'acquÃ©rir pour tenir compagnie Ã  KhÃ©ops , l\'un de nos jeunes Ã©talons lamas. Dans le cadre de notre ferme de dÃ©couverte les visiteurs verront ainsi la diffÃ©rence entre lama et alpaga qui plus est suri, c\'est Ã  dire pourvu d\'une toison rare et particuliÃ¨re (mÃ¨ches longues). '),(61,'2014-01-27 00:00:00','NOUVEAUTES DANS L\'ELEVAGE\r\nDeux nouvelles femelles lamas fortement lainÃ©e provenant d\'un troupeau exterieur ont pris rang dans notre Ã©levage. Il s\'agit de OKARINA et de LILLY, cette derniÃ¨re Ã©tant primÃ©e au salon europÃ©en 2012.'),(84,'2015-06-03 00:00:00','NAISSANCE LAMAS\r\n2015 sera une annÃ©e avec peu de naissances.Nous espÃ©rons mieux pour l\'an prochain.\r\nUne femelle est nÃ©e dÃ©but juin et un deuxiÃ¨me cria (nom d\'un petit lama) devrait Ã©galement voir le jour les semaines qui suivent.\r\nPour l\'instant nous nous contentons de la petite \"Patcha\"   '),(83,'2015-10-27 00:00:00','DATE VISITE DE Lâ€™Ã‰LEVAGE.\r\nLe 18/02/2016\r\nDurant les vacances de fÃ©vrier, nous organisons pour le \"grand public\" une visite de dÃ©couverte de notre Ã©levage le jeudi 18 fÃ©vrier 2016 - dÃ©part visite Ã  15h30 - durÃ©e 01h30.\r\nPrairies humides - prÃ©voir chaussures adaptÃ©es \r\nTÃ©l. 05 57 42 20 61.\r\n');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-09 21:21:14
