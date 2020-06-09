<?php
    /*$serverName = '10.128.26.1';
	$connectionInfo=array("Database"=>$database, "UID"=>"mi_prg_web", "PWD"=>"Serglo123");*/
	$serverName = '192.168.6.196';
	$connectionInfo=array("Database"=>$database, "UID"=>"sa", "PWD"=>"Serglo123");
    $conn = sqlsrv_connect($serverName,$connectionInfo);
	if(!$conn)
		die("error".$database);
?>