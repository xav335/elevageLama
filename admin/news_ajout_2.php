<? include_once("../include/_session.php");?>
<? include_once("../include/_securite.php");?>
<? include_once("../include/_connexion.php"); ?>
<? include_once("_fonctions.php")?>
<?	
	$maintenant = date("Y-m-d H\:i\:s\ ");
	$date_debut=mktime ("00","00","00",$_POST["mois_debut"],$_POST["jour_debut"],$_POST["an_debut"]);
	$date_debut=date("Y/m/d H:i:s", $date_debut);

	$query  = "INSERT INTO news (date_news, description) VALUES (";
	$query .= "'  ".$date_debut ."' " ;
	$query .= ", '".mysql_real_escape_string($_POST["description"]) ."' " ;
	$query .= ")";
	//echo $query ."<br>";
	$rstemp = mysql_query($query);
	$id_news = mysql_insert_id();
	
	header("Location: news_modif.php?id_news=". $id_news);

?>
<? include_once("../include/_connexion_fin.php"); ?>