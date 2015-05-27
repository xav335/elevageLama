<?php include_once("include/_connexion.php"); ?>
<?php
$sql = "SELECT * ";
$sql .= " FROM lama ";
//$sql .= "WHERE DATE(date_lama) >= Date(now()) ";
$sql .= " ORDER BY date_lama DESC"; 
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
document.location.href="http://www.elevagelama.com/#page=vente";
</script>
</head>
<body>
<noscript>
<h1>Lamas en vente</h1>
<h2>Retrouvez sur cette page les lamas en vente sur notre Site</h2>

<? if (mysql_num_rows($result)>0){
	
	while($row=mysql_fetch_array($result)){ ?>

		<p>
		<b><? echo $row["titre"] ?></b>&nbsp;&nbsp;<? echo $row["date_lama"] ?><br>
		<? echo $row["description"] ?><br>
		<? $sql = "SELECT * ";
				$sql = "SELECT * ";
				$sql .= " FROM media_lama ";
				$sql .= "WHERE id_lama = ". $row["id_lama"] ." ";
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
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-11864990-12']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
</html>
<?php include_once("include/_connexion_fin.php"); ?>