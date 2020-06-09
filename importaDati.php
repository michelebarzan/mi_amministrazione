<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Importa dati";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/importaDati.css" />
		<script src="js/importaDati.js"></script>
	</head>
	<body onload="getElencoLogImportazioni()" onresize="fixTable()">
		<?php include('struttura.php'); ?>
		<div class="top-action-bar" id="importaDatiActionBar">
			<button class="action-bar-text-icon-button" id="bntImportaTutto" style="margin-right:5px" onclick="importaTutto(this)"><span>Importa tutti i database</span><i class="fad fa-upload"></i></button>
			<button class="action-bar-text-icon-button" id="bntImportaSingoloDatabase" style="margin-right:0px" onclick="getPopupScegliDatabase(this)"><span>Importa singoli database</span><i class="fad fa-file-upload"></i></button>
		</div>
		<div id="importaDatiContainer"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>