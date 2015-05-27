<?php include_once("include/_connexion.php"); ?>
<?php
$sql = "SELECT * ";
$sql .= " FROM news ";
//$sql .= "WHERE DATE(date_news) >= Date(now()) ";
$sql .= " ORDER BY date_news DESC"; 
$result = mysql_query($sql);
$nb_enr = mysql_num_rows($result);
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Les lamas de Brandacot en Gironde - Les actualités</title>
<meta name="Content-Language" content="fr">
<meta name="Description" content="Les Lamas de Brandacot en Gironde, Ferme d'élevage de lamas, Ferme de découverte pédagogique des Lamas ">
<meta name="Keywords" content="lama, lamas, ferme de découverte, ferme pédagogique, visite guidée, crias, visites pour les enfants, débroussaillement, vente de lamas, debroussaillage, ferme élevage de lamas, lamas gardiens de troupeaux, laine de lama, ">
<meta name="publisher" content="iconeo.fr">
<meta name="author" content="iconeo.fr">
<meta name="Revisit-After" content="16 days">
<meta name="Robots" content="all">
<script type="text/javascript">
document.location.href="http://www.elevagelama.com/#page=actualite";
</script>
</head>
<body>
<noscript>
<h1>Actualités et Evènements</h1>
<h2>Retrouvez sur cette page les actus du Site</h2>

<? if (mysql_num_rows($result)>0){
	
	while($row=mysql_fetch_array($result)){ ?>

		<p>
		<b><? echo $row["titre"] ?></b>&nbsp;&nbsp;<? echo $row["date_news"] ?><br>
		<? echo $row["description"] ?><br>
		<? $sql = "SELECT * ";
				$sql .= " FROM media_news ";
				$sql .= "WHERE id_news = ". $row["id_news"] ." ";
				$sql .= " ORDER BY type_media"; 
				$result2 = mysql_query($sql);
				$nb_enr2 = mysql_num_rows($result2);
				if (mysql_num_rows($result2)>0){
					while($row2=mysql_fetch_array($result2)){ ?>
						<img src="<? echo $row2["url_apercu"] ?>" border=0> 
						<br><br>
<?   				}
				}
	}?>
	</p>
	<?
}
?>

<br>
<a href="index.html" >Retour à l'accueil</a>
</noscript>
</body>
</html>
<?php include_once("include/_connexion_fin.php"); ?>