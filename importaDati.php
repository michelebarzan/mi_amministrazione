<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione Database";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/importaDati.css" />
		<script src="js/importaDati.js"></script>
		<link rel="stylesheet" href="libs/js/spinners/spinner.css" />
		<script src="libs/js/spinners/spinner.js"></script>
		<script src="editableTable/editableTable.js"></script>
		<link rel="stylesheet" href="editableTable/editableTable.css" />
	</head>
	<body onresize="fixTable()">
		<?php include('struttura.php'); ?>
		<!--<div class="top-action-bar" id="importaDatiActionBar">
			<button class="action-bar-text-icon-button" id="bntImportaTutto" style="margin-right:5px" onclick="importaTutto(this)"><span>Importa tutti i database</span><i class="fad fa-upload"></i></button>
			<button class="action-bar-text-icon-button" id="bntImportaSingoloDatabase" style="margin-right:5px" onclick="getPopupScegliDatabase(this)"><span>Importa singoli database</span><i class="fad fa-file-upload"></i></button>
			<button class="action-bar-text-icon-button" id="bntImportaDatabaseSql" style="margin-right:0px" onclick="importaDatabase(this)"><span>Importa database sql</span><i class="fad fa-database"></i></button>
		</div>-->
		<div class="reusable-control-bar" id="importaDatiActionBar">
			<!--<button class="rcb-button-text-icon" id="bntImportaTutto" onclick="importaTutto(this)"><span>Importa tutti i database</span><i style="margin-left:10px" class="fad fa-upload"></i></button>-->
			<button class="rcb-button-text-icon" id="bntImportaSingoloDatabase" onclick="getPopupScegliDatabase(this)"><span>Importa database txt</span><i style="margin-left:10px" class="fad fa-file-upload"></i></button>
			<button class="rcb-button-text-icon" id="bntImportaDatabaseSql" onclick="getPopupImportaDatabase(this)"><span>Importa database sql</span><i style="margin-left:10px" class="fad fa-database"></i></button>
			<button class="rcb-button-text-icon" id="bntImportaSingoloDatabase" onclick="getPopupSvuotaDatabaseTxt(this)"><span>Svuota database txt</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>
			<button class="rcb-button-text-icon" id="bntImportaDatabaseSql" onclick="getPopupSvuotaDatabaseSql(this)"><span>Svuota database sql</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>
			<button class="rcb-button-text-icon" id="bntAggiornaAnagrafiche" onclick="getPopupAggiornaAnagrafiche(this)"><span>Aggiorna anagrafiche</span><i style="margin-left:10px" class="fad fa-edit"></i></button>
			<button class="rcb-button-text-icon" id="bntSvuotaDistinte" onclick="getPopupSvuotaDistinte(this)"><span>Svuota distinte</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>
			<button class="rcb-button-text-icon" id="bntMateriePrime" onclick="getTabellaMateriePrime(this)"><span>Materie prime</span><i style="margin-left:10px" class="fal fa-table"></i></button>
			<button class="rcb-button-text-icon" id="bntLogImportazioni" onclick="getElencoLogImportazioni()"><span>Log importazioni</span><i style="margin-left:10px" class="fad fa-history"></i></button>
			<div id="rowsNumEditableTable" style="display:none"></div>
		</div>
		<div id="importaDatiContainer"></div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>