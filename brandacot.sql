-- MySQL dump 10.13  Distrib 5.1.72, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: brandacot
-- ------------------------------------------------------
-- Server version	5.1.72-2

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
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
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
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lien`
--

LOCK TABLES `lien` WRITE;
/*!40000 ALTER TABLE `lien` DISABLE KEYS */;
INSERT INTO `lien` VALUES (6,'A 7 km - La citadelle de Blaye classée au patrimoine mondial de l\'UNESCO, visite guidée par les souterrains.','tourisme','http://www.tourisme-blaye.com'),(4,'Enfant Bordeaux','','http://bordeaux.citizenkid.com'),(5,'Office de tourisme de BLAYE ','tourisme','http://www.tourisme-blaye.com'),(8,'Producteur de Safran - Ferme de Découverte','tourisme','http://www.safrandebordeaux.fr'),(9,'Camping Le Maine Blanc (***)  à St Christoly  tél. 05 57 42 52 81','camping',''),(10,'Camping Municipal de la Citadelle (**) à BLAYE  Tél. 05 57 42 00 20','camping',''),(11,'Camping municipal de Braud et St Louis  (**) ','camping','http://www.mairie-braud.com'),(12,'A  St Ciers de Canesse - 8 km  Hôtel *** Restaurant La Closerie des Vignes','hotelresto','http://www.hotel-restaurant-gironde.com'),(13,'A St Seurin de Cursac - 5 km -  Hôtel Restaurant La Renaissance','hotelresto','http://www.larenaissance33.com'),(14,'A 1 km - Les Denias  tél. 05 57 64 32 93  - 06 28 27 46 00','chambrehote','http://lesdenias.com'),(15,'A 7km - Saint Martin Lacaussade ','chambrehote','http://www.chateau-fredignac.fr/'),(16,'A Blaye - 7 km - Villa Premayac  ','chambrehote','http://www.villa-premayac.com'),(17,'A St Seurin de Cursac - 5 km -  Hôtel Restaurant La Renaissance ','gastronomie','http://www.larenaissance33.com'),(18,'A  Blaye - 7 km Auberge du Porche ','gastronomie','http://www.auberge-du-porche.com'),(19,'Sur place - Château du Bois Lafont\r\nTél. 05 57 42 28 11\r\n','chateauviti',''),(22,'Traversée de la Gironde, BAC BLAYE/LAMARQUE \r\nTél.05 57 42 04 49\r\n','transport','');
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
) ENGINE=MyISAM AUTO_INCREMENT=98 DEFAULT CHARSET=latin1;
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
) ENGINE=MyISAM AUTO_INCREMENT=110 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_news`
--

LOCK TABLES `media_news` WRITE;
/*!40000 ALTER TABLE `media_news` DISABLE KEYS */;
INSERT INTO `media_news` VALUES (109,71,'http://www.fermelama.com/actu/ndjamena_00866497.jpg','http://www.fermelama.com/actu/vignette/ndjamena_00866497.jpg',0),(92,61,'http://www.fermelama.com/actu/jour_de_l_an_00643879.jpg','http://www.fermelama.com/actu/vignette/jour_de_l_an_00643879.jpg',0),(107,71,'http://www.fermelama.com/actu/mai_2014_04996040.jpg','http://www.fermelama.com/actu/vignette/mai_2014_04996040.jpg',0),(108,71,'http://www.fermelama.com/actu/othello_01063215.jpg','http://www.fermelama.com/actu/vignette/othello_01063215.jpg',0),(90,61,'http://www.fermelama.com/actu/3027163.jpg','http://www.fermelama.com/actu/vignette/3027163.jpg',0),(91,61,'http://www.fermelama.com/actu/nov10310.jpg','http://www.fermelama.com/actu/vignette/nov10310.jpg',0),(83,22,'http://www.fermelama.com/actu/img_346295036.jpg','http://www.fermelama.com/actu/vignette/img_346295036.jpg',0),(71,36,'http://www.fermelama.com/actu/kako_00574413.jpg','http://www.fermelama.com/actu/vignette/kako_00574413.jpg',0),(73,36,'http://www.fermelama.com/actu/25_sept_2011_01186625.jpg','http://www.fermelama.com/actu/vignette/25_sept_2011_01186625.jpg',0),(106,71,'http://www.fermelama.com/actu/mai_2014_02197480.jpg','http://www.fermelama.com/actu/vignette/mai_2014_02197480.jpg',0);
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
) ENGINE=MyISAM AUTO_INCREMENT=82 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (41,'2013-04-17 00:00:00','ATELIER SUPPLÉMENTAIRE POUR LES ÉCOLES PRIMAIRES.\r\nEn plus de nos ateliers existants, nous créons actuellement un atelier dont le thème est l\'AMERIQUE DU SUD. Dans quelques jours cet atelier figurera sur notre fiche pédagogique (téléchargeable) \r\nPour l\'instant, nous contacter. '),(22,'2011-06-29 00:00:00','LAMA GARDIEN DE TROUPEAU.\r\nDans le cadre de notre spécialité Lama Gardien de Troupeau, notre dernier lama sélectionné a été vendu.\r\nPour toute demande, nous contacter pour une nouvelle sélection.  '),(71,'2014-06-13 00:00:00','LES NAISSANCES\r\nQuatre naissances de crias (petits lamas) ont eu lieu au printemps. Deux autres sont attendus au cours de l\'été. Ils se nomment Melba, Nabucco, Carmen et N’Djamena.\r\nVenez les découvrir'),(81,'2015-04-28 00:00:00','DATES VISITES ÉLEVAGE\r\nPour les vacances scolaires nous organisons pour le \"grand public\" deux visites de découverte de notre élevage.\r\nIl s\'agit du jeudi 23 avril et du mardi 28 avril. Départ de la visite à 14h30, durée de la visite 1h30 à 02h00.\r\n\r\n'),(35,'2011-10-14 00:00:00','REPORTAGE SUR DIRECT 8\r\nDans le cadre de notre spécialisé de &quot;lama gardien de troupeau&quot; un tournage a été effectué sur notre élevage le 14 septembre dernier. La diffusion de ce reportage est prévue le dimanche 16 octobre prochain, 11h30, émission Les animaux de la 8 sur Direct 8.'),(36,'2011-09-19 00:00:00','KAKO, alpaga suri.\r\nKako de Garenne est un jeune alpaga Suri entier que nous venons d\'acquérir pour tenir compagnie à Khéops , l\'un de nos jeunes étalons lamas. Dans le cadre de notre ferme de découverte les visiteurs verront ainsi la différence entre lama et alpaga qui plus est suri, c\'est à dire pourvu d\'une toison rare et particulière (mèches longues). '),(61,'2014-01-27 00:00:00','NOUVEAUTÉS DANS L’ÉLEVAGE\r\nDeux nouvelles femelles lamas fortement lainée provenant d\'un troupeau extérieur ont pris rang dans notre élevage. Il s\'agit de OKARINA et de LILLY, cette dernière étant primée au salon européen 2012.');
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

-- Dump completed on 2015-05-27 11:20:03
