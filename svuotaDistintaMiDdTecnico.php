<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $tabella=$_REQUEST["tabella"];

    $start = microtime(true);

    $result["tabella"]=$tabella;

    $q="DELETE FROM $tabella";
    $r=sqlsrv_query($conn,$q);
    $result["query"]=$q;
    if($r==FALSE)
    {
        $result["result"]="error";
        $result["rows"]=0;
    }
    else
    {
        $result["result"]="ok";
        $rows = sqlsrv_rows_affected( $r);
        if( $rows === false)
            $result["rows"]=false;
        elseif( $rows == -1)
            $result["rows"]=false;
        else
            $result["rows"]=$rows;
    }

    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $result["time_elapsed_secs"]=$time_elapsed_secs;
    echo json_encode($result);

?>