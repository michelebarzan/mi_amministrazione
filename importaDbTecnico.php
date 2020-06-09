
<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $databases=json_decode($_REQUEST["JSONdatabases"]);

    $start = microtime(true);

    $tables=[];

    $missingTables=[];
    $skipTables=["elenca_tabelle","miatab","Valori","dibdogx","schema_relazioni","Registro","TmpMI0300011+andrea.peresson","t_PANNELLIS","t_CABINE","t_CARRELLI","t_CESOIATI","t_CORRIDOI","t_DIBCAR","t_DIBCES","t_DIBCOR","t_DIBDOGX","t_DIBLAMS","t_DIBLCR","t_DIBLDR","t_DIBLDRS","t_DIBPAN","t_DIBPAS","t_DIBRIN","t_DIBRIND","t_DIBRINP","t_DIBSVI","t_DIBTRI","t_DIBTRS","t_DOGHELM","t_DOGHELR","t_DOGHERF","t_ELENCA_TABELLE","t_KIT","t_KITPAN","t_LANACER","t_MATER","t_MIATAB","t_PANNELLI","t_PANNELLIL","t_PESICAB","t_RINFPIEDE","t_SVILUPPI","t_TABCOLLI","t_TABRINF","t_TRAVINF","t_TRAVSUP","t_CABKIT"];

    $errorMessages=[];

    $righeInserite=0;
    $righeNonInserite=0;
    foreach($databases as $database)
    {
        include "connessioneDb.php";

        $q6="SELECT TABLE_NAME FROM $database.INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
        $r6=sqlsrv_query($conn,$q6);
        if($r6==FALSE)
        {
            die("error1: ".$q6);
        }
        else
        {
            while($row6=sqlsrv_fetch_array($r6))
            {
                array_push($tables,$row6["TABLE_NAME"]);
            }
        }

        foreach($tables as $table)
        {
            if (in_array($table, $skipTables))
            {
                //array_push($errorMessages,"TABELLA $table NON TROVATA<br>");
            }
            else
            {
                $columns=[];
                $data_types=[];
                $q7="SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'$table' AND COLUMN_NAME != 'UTENTE' AND COLUMN_NAME != 'tmp' AND COLUMN_NAME != 'id'";
                $r7=sqlsrv_query($conn,$q7);
                if($r7==FALSE)
                {
                    die("error1: ".$q7);
                }
                else
                {
                    while($row7=sqlsrv_fetch_array($r7))
                    {
                        array_push($columns,$row7["COLUMN_NAME"]);
                        array_push($data_types,$row7["DATA_TYPE"]);
                    }
                }
                $columns_string="[".implode("],[",$columns)."]";

                $fileName=$table.".txt";
        
                $rows=[];
        
                $rowN=0;               

                $codiciDaInserire=[];
                $queries=[];

                $columns0array=[];
                $columns0file=[];

                $column0=$columns[0];
                $q8="SELECT DISTINCT [$column0] FROM $table";
                $r8=sqlsrv_query($conn,$q8);
                if($r8==FALSE)
                {
                    die("error1: ".$q8);
                }
                else
                {
                    while($row8=sqlsrv_fetch_array($r8))
                    {
                        array_push($columns0array,$row8[$columns[0]]);
                    }
                }
                
                //$file = fopen("//DESKTOP-L5K6JOC/files/$database/regdef/$fileName", "r") or die("error");
                $file = fopen("//marineinteriors.it/groupspaces/mi/$database/regdef/$fileName", "r") or die("error");
                while(!feof($file))
                {
                    $rowString=fgets($file);
                    $rowString=substr($rowString,0,strlen($rowString)-2);
                    $rigaCheck=strtolower($rowString);
                    $colonnaCheck=strtolower($columns[0]);
                    if (strpos($rigaCheck, $colonnaCheck) === false) 
                    {
                        $rowString=str_replace(chr(34),"'",$rowString);
                        $rowArray=explode(chr(9),$rowString);
                        if(sizeof($columns)>sizeof($rowArray))
                        {
                            $columnsL=sizeof($columns);
                            $rowArrayL=sizeof($rowArray);

                            $diff=$columnsL-$rowArrayL;
                            for ($x=0; $x < $diff; $x++) 
                            { 
                                array_push($rowArray,"NULL");
                            }
                        }
                        if(sizeof($rowArray)<sizeof($columns))
                        {
                            $columnsL=sizeof($columns);
                            $rowArrayL=sizeof($rowArray);

                            $diff=$rowArrayL-$columnsL;
                            array_splice($array, count($array) - $diff, $diff);
                        }

                        if(sizeof($rowArray)===sizeof($columns))
                        {                           
                            for ($y=0; $y < sizeof($rowArray); $y++)
                            {
                                $item=$rowArray[$y];
                                if($item=="" || $item==" " || $item==null || strlen($item)==0 || ord($item)==13)
                                {
                                    if(($data_types[$y]=="decimal" || $data_types[$y]=="int" || $data_types[$y]=="real" || $data_types[$y]=="smallint"))
                                        $rowArray[$y]=0;
                                    else
                                        $rowArray[$y]="''";
                                }
                            }

                            $valoreColonna0=str_replace("'","",$rowArray[0]);
                            array_push($columns0file,$valoreColonna0);

                            $queries[$valoreColonna0]="INSERT INTO [$table] ($columns_string) VALUES (".implode(',',$rowArray).")";
                        }
                    }
                    $rowN++;
                }
                fclose($file);

                $codiciDaInserire=array_diff($columns0file,$columns0array);
                foreach($codiciDaInserire as $codice)
                {
                    $q2=$queries[$codice];

                    $r2=sqlsrv_query($conn,$q2);
                    if($r2==FALSE)
                    {
                        array_push($errorMessages,"<b>Tabella: </b>$database.$table<br><b>Query: </b>".$q2."<br>");
                        $righeNonInserite++;
                    }
                    else
                    {
                        $righeInserite++;
                    }
                }
            }
        }
    }
    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $arrayResponse["righeInserite"]=$righeInserite;
    $arrayResponse["righeNonInserite"]=$righeNonInserite;
    $arrayResponse["errorMessages"]=$errorMessages;
    $arrayResponse["time_elapsed_secs"]=$time_elapsed_secs;

    echo json_encode($arrayResponse);

?>