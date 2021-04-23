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
		<script src="libs/js/handsontable/handsontable.full.min.js"></script>
		<link href="libs/js/handsontable/handsontable.full.min.css" rel="stylesheet" media="screen">
		<script type="text/javascript" src="libs/js/handsontable/languages/it-IT.js"></script>
		<link rel="stylesheet" href="css/inPageNavBar.css" />
	</head>
	<body onresize="fixTable()">
		<?php include('struttura.php'); ?>
		<div class="in-page-nav-bar">
			<div class="in-page-nav-bar-row"></div>
			<div class="in-page-nav-bar-row">
				<button class="in-page-nav-bar-button" id="btn_importazione_database" onclick="getMascheraImportazioneDatabase(this)">
					<span>Importazione database</span>
					<i class="fad fa-file-import"></i>
				</button>
				<button class="in-page-nav-bar-button" id="btn_gestione_anagrafiche" onclick="getMascheraGestioneAnagrafiche(this)">
					<span>Gestione anagrafiche</span>
					<i class="fad fa-database"></i>
				</button>
				<button class="in-page-nav-bar-button" id="btn_generale" onclick="getMascheraGenerale(this)">
					<span>Generale</span>
					<i class="fad fa-cog"></i>
				</button>
				<button class="in-page-nav-bar-button" id="btn_generale" onclick="getMascheraEsportazioneCavallottiSquadrette(this)">
					<span>Esportazione cavallotti e squadrette</span>
					<i class="fad fa-cog"></i>
				</button>
			</div>
		</div>
		<div class="reusable-control-bar" id="importaDatiActionBar" style="display: none;">
			<!--<button class="rcb-button-text-icon" id="bntImportaSingoloDatabase" onclick="getPopupScegliDatabase(this)"><span>Importa database txt</span><i style="margin-left:10px" class="fad fa-file-upload"></i></button>
			<button class="rcb-button-text-icon" id="bntImportaDatabaseSql" onclick="getPopupImportaDatabase(this)"><span>Importa database sql</span><i style="margin-left:10px" class="fad fa-database"></i></button>
			<button class="rcb-button-text-icon" id="bntImportaDatabaseSql" onclick="getPopupSvuotaDatabaseSql(this)"><span>Svuota database sql</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>
			<button class="rcb-button-text-icon" id="bntAggiornaAnagrafiche" onclick="getPopupAggiornaAnagrafiche(this)"><span>Aggiorna anagrafiche</span><i style="margin-left:10px" class="fad fa-edit"></i></button>
			<button class="rcb-button-text-icon" id="bntSvuotaDistinte" onclick="getPopupSvuotaDistinte(this)"><span>Svuota distinte</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>
			<button class="rcb-button-text-icon" id="bntMateriePrime" onclick="getTabellaMateriePrime(this)"><span>Materie prime</span><i style="margin-left:10px" class="fal fa-table"></i></button>
			<button class="rcb-button-text-icon" id="buttonImportaExcel" onclick="getPopupRaggruppamenti()"><span>Raggruppamenti materie prime</span><i class="fad fa-object-group" style="margin-left:10px"></i></button>
			<button class="rcb-button-text-icon" id="bntLogImportazioni" onclick="getElencoLogImportazioni()"><span>Log importazioni</span><i style="margin-left:10px" class="fad fa-history"></i></button>
			<button class="rcb-button-text-icon" id="buttonRunSPPesoQntCabine" onclick="getPopupSPPesoQntCabine()"><span>Ricalcola peso cabine</span><i class="fad fa-weight-hanging" style="margin-left:10px"></i></button>
			<div id="rowsNumEditableTable" style="display:none"></div>-->

			<!--<button class="rcb-button-text-icon" id="bntImportaSingoloDatabase" onclick="getPopupSvuotaDatabaseTxt(this)"><span>Svuota database txt</span><i style="margin-left:10px" class="fad fa-eraser"></i></button>-->
		</div>
		<div id="importaDatiContainer"></div>
		<div id="footer" style="z-index:9999">
			<b>Marine&nbspInteriors&nbspCabins&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>