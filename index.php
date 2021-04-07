<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Homepage";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div id="container">
			<div id="content">
				<div id="immagineLogo" class="immagineLogo" ></div>
				<div class="homepageLinkContainer">
					<div class="homepageLink" data-tooltip="Homepage" onclick="gotopath('index.php')">
						<i class="fad fa-home"></i>
						<div>Homepage</div>
					</div>
					<div class="homepageLink" data-tooltip="Gestione Database" onclick="gotopath('importaDati.php')">
						<i class="fad fa-database"></i>
						<div>Gestione Database</div>
					</div>
					<div class="homepageLink" data-tooltip="Gestione Utenti" onclick="gotopath('gestioneUtenti.php')">
						<i class="fad fa-users-cog"></i>
						<div>Gestione Utenti</div>
					</div>
				</div>
				<div id="statisticheSwContainer"></div>
			</div>
		</div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>
