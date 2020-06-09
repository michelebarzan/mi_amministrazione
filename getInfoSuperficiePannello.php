<?php

    include "Session.php";
    $database="viste_db_tecnico";
    include "connessioneDb.php";

    set_time_limit(3000);

    $codici=json_decode($_REQUEST["JSONcodici"]);
    $mostraCodiciCabina=$_REQUEST["mostraCodiciCabina"];

    $subquery="";
    foreach ($codici as $codice)
    {
        $subquery.="SELECT '$codice' AS codcab UNION ALL ";
    }
    $subquery=substr($subquery, 0, -11);

    $pannelli=[];
    $arrayResponse["totaliPannelli"]["qnt"]=0;
    $arrayResponse["totaliPannelli"]["mq"]=0;
    $arrayResponse["totaliPannelli"]["mq_totali"]=0;
    $arrayResponse["totaliPannelli"]["forati"]=0;
    
    if($mostraCodiciCabina=="true")
    {
        $qPannelli="SELECT [database],CODCAB AS codcab, codele, lung1, lung2, halt, qnt, ang, mq, mq * qnt AS mq_totali, FORI AS forati
        FROM (SELECT db AS [database],CODCAB, CODELE AS codele, LUNG1 AS lung1, LUNG2 AS lung2, HALT AS halt, FORI, SUM(QNT * Expr1) AS qnt, ANG AS ang, (LUNG1 + LUNG2) * HALT / 1000000 AS mq
            FROM (SELECT dbo.cabine.CODCAB, dbo.cabine.db, dbo.cabkit.QNT, dbo.cabkit.CODKIT, dbo.kitpan.CODELE, dbo.kitpan.QNT AS Expr1, dbo.pannellil.LUNG1, dbo.pannellil.LUNG2, dbo.pannellil.HALT, dbo.pannellil.ANG, 
                                                                dbo.kit.LUNG AS kit_lung, dbo.kit.HALT AS kit_halt, dbo.pannelli.FORI
                                                                FROM ($subquery) AS elenco_cabine INNER JOIN
                                                                dbo.cabine ON elenco_cabine.codcab = dbo.cabine.CODCAB LEFT OUTER JOIN
                                                                dbo.cabkit INNER JOIN
                                                                dbo.kit ON dbo.cabkit.CODKIT = dbo.kit.CODKIT INNER JOIN
                                                                dbo.kitpan ON dbo.kit.CODKIT = dbo.kitpan.CODKIT INNER JOIN
                                                                dbo.pannelli ON dbo.kitpan.CODELE = dbo.pannelli.CODPAS INNER JOIN
                                                                dbo.pannellil ON dbo.pannelli.CODLAM = dbo.pannellil.CODPAN ON dbo.cabine.CODCAB = dbo.cabkit.CODCAB) AS derivedtbl_1
            GROUP BY db, CODCAB,CODELE, LUNG1, LUNG2, HALT, FORI, ANG, (LUNG1 + LUNG2) * HALT / 1000000) AS derivedtbl_2 OPTION ( QUERYTRACEON 9481 )";
    }
    else
    {
        $qPannelli="SELECT [database], codele, lung1, lung2, halt, qnt, ang, mq, mq * qnt AS mq_totali, FORI AS forati
        FROM (SELECT db AS [database], CODELE AS codele, LUNG1 AS lung1, LUNG2 AS lung2, HALT AS halt, FORI, SUM(QNT * Expr1) AS qnt, ANG AS ang, (LUNG1 + LUNG2) * HALT / 1000000 AS mq
            FROM (SELECT dbo.cabine.CODCAB, dbo.cabine.db, dbo.cabkit.QNT, dbo.cabkit.CODKIT, dbo.kitpan.CODELE, dbo.kitpan.QNT AS Expr1, dbo.pannellil.LUNG1, dbo.pannellil.LUNG2, dbo.pannellil.HALT, dbo.pannellil.ANG, 
                                                                dbo.kit.LUNG AS kit_lung, dbo.kit.HALT AS kit_halt, dbo.pannelli.FORI
                                                                FROM ($subquery) AS elenco_cabine INNER JOIN
                                                                dbo.cabine ON elenco_cabine.codcab = dbo.cabine.CODCAB LEFT OUTER JOIN
                                                                dbo.cabkit INNER JOIN
                                                                dbo.kit ON dbo.cabkit.CODKIT = dbo.kit.CODKIT INNER JOIN
                                                                dbo.kitpan ON dbo.kit.CODKIT = dbo.kitpan.CODKIT INNER JOIN
                                                                dbo.pannelli ON dbo.kitpan.CODELE = dbo.pannelli.CODPAS INNER JOIN
                                                                dbo.pannellil ON dbo.pannelli.CODLAM = dbo.pannellil.CODPAN ON dbo.cabine.CODCAB = dbo.cabkit.CODCAB) AS derivedtbl_1
            GROUP BY db, CODELE, LUNG1, LUNG2, HALT, FORI, ANG, (LUNG1 + LUNG2) * HALT / 1000000) AS derivedtbl_2 OPTION ( QUERYTRACEON 9481 )";
    }
    
    $rPannelli=sqlsrv_query($conn,$qPannelli);
    if($rPannelli==FALSE)
    {
        die("error");
    }
    else
    {
        while($rowPannelli=sqlsrv_fetch_array($rPannelli))
        {
            $pannello["database"]=$rowPannelli["database"];
            if($mostraCodiciCabina=="true")
                $pannello["codcab"]=$rowPannelli["codcab"];
            $pannello["codele"]=$rowPannelli["codele"];
            $pannello["lung1"]=number_format($rowPannelli['lung1'],2,",",".");
            $pannello["lung2"]=number_format($rowPannelli["lung2"],2,",",".");
            $pannello["halt"]=number_format($rowPannelli["halt"],2,",",".");
            $pannello["qnt"]=number_format($rowPannelli["qnt"],2,",",".");
            $pannello["ang"]=number_format($rowPannelli["ang"],2,",",".");
            $pannello["mq"]=number_format($rowPannelli["mq"],2,",",".");
            $pannello["mq_totali"]=number_format($rowPannelli["mq_totali"],2,",",".");
            $pannello["forati"]=$rowPannelli["forati"];

            $arrayResponse["totaliPannelli"]["qnt"]+=floatval($rowPannelli["qnt"]);
            $arrayResponse["totaliPannelli"]["mq"]+=floatval($rowPannelli["mq"]);
            $arrayResponse["totaliPannelli"]["mq_totali"]+=floatval($rowPannelli["mq_totali"]);
            if($pannello["forati"]=="Si")
                $arrayResponse["totaliPannelli"]["forati"]++;
            
            array_push($pannelli,$pannello);
        }
    }

    $kit=[];
    $arrayResponse["totaliKit"]["qnt"]=0;
    $arrayResponse["totaliKit"]["mq"]=0;
    $arrayResponse["totaliKit"]["mq_totali"]=0;
    
    if($mostraCodiciCabina=="true")
    {
        $qKit="SELECT db AS [database],CODCAB as codcab, CODKIT AS codkit, kit_halt AS halt, kit_lung AS lung, SUM(QNT) AS qnt, kit_halt * kit_lung / 1000000 AS mq, SUM(kit_halt * kit_lung * QNT / 1000000) AS mq_totali
            FROM (SELECT cabine_1.CODCAB, cabine_1.db, dbo.cabkit.QNT, dbo.cabkit.CODKIT, dbo.kit.LUNG AS kit_lung, dbo.kit.HALT AS kit_halt
                FROM dbo.cabkit INNER JOIN
                                        dbo.kit ON dbo.cabkit.CODKIT = dbo.kit.CODKIT RIGHT OUTER JOIN
                                            ($subquery) AS elenco_cabine INNER JOIN
                                        dbo.cabine AS cabine_1 ON elenco_cabine.CODCAB = cabine_1.CODCAB ON dbo.cabkit.CODCAB = cabine_1.CODCAB) AS derivedtbl_1
            GROUP BY db,CODCAB, CODKIT, kit_halt, kit_lung, kit_halt * kit_lung / 1000000 OPTION ( QUERYTRACEON 9481 )";
    }
    else
    {
        $qKit="SELECT db AS [database], CODKIT AS codkit, kit_halt AS halt, kit_lung AS lung, SUM(QNT) AS qnt, kit_halt * kit_lung / 1000000 AS mq, SUM(kit_halt * kit_lung * QNT / 1000000) AS mq_totali
            FROM (SELECT cabine_1.CODCAB, cabine_1.db, dbo.cabkit.QNT, dbo.cabkit.CODKIT, dbo.kit.LUNG AS kit_lung, dbo.kit.HALT AS kit_halt
                FROM dbo.cabkit INNER JOIN
                                        dbo.kit ON dbo.cabkit.CODKIT = dbo.kit.CODKIT RIGHT OUTER JOIN
                                            ($subquery) AS elenco_cabine INNER JOIN
                                        dbo.cabine AS cabine_1 ON elenco_cabine.CODCAB = cabine_1.CODCAB ON dbo.cabkit.CODCAB = cabine_1.CODCAB) AS derivedtbl_1
            GROUP BY db, CODKIT, kit_halt, kit_lung, kit_halt * kit_lung / 1000000 OPTION ( QUERYTRACEON 9481 )";
    }
    
    $rKit=sqlsrv_query($conn,$qKit);
    if($rKit==FALSE)
    {
        die("error");
    }
    else
    {
        while($rowKit=sqlsrv_fetch_array($rKit))
        {
            $kitItem["database"]=$rowKit["database"];
            if($mostraCodiciCabina=="true")
                $kitItem["codcab"]=$rowKit["codcab"];
            $kitItem["codkit"]=$rowKit["codkit"];
            $kitItem["halt"]=number_format($rowKit["halt"],2,",",".");
            $kitItem["lung"]=number_format($rowKit["lung"],2,",",".");
            $kitItem["qnt"]=number_format($rowKit["qnt"],2,",",".");
            $kitItem["mq"]=number_format($rowKit["mq"],2,",",".");
            $kitItem["mq_totali"]=number_format($rowKit["mq_totali"],2,",",".");

            $arrayResponse["totaliKit"]["qnt"]+=floatval($rowKit["qnt"]);
            $arrayResponse["totaliKit"]["mq"]+=floatval($rowKit["mq"]);
            $arrayResponse["totaliKit"]["mq_totali"]+=floatval($rowKit["mq_totali"]);
            
            array_push($kit,$kitItem);
        }
    }

    $cabineTrovate=[];
    $qCabine="SELECT CODCAB as codcab
                FROM (SELECT DISTINCT CODCAB
                    FROM (SELECT cabine_1.CODCAB, cabine_1.db, dbo.cabkit.QNT, dbo.cabkit.CODKIT, dbo.kit.LUNG AS kit_lung, dbo.kit.HALT AS kit_halt
                                            FROM dbo.cabkit INNER JOIN
                                                                        dbo.kit ON dbo.cabkit.CODKIT = dbo.kit.CODKIT RIGHT OUTER JOIN
                                                                            ($subquery) AS elenco_cabine INNER JOIN
                                                                        dbo.cabine AS cabine_1 ON elenco_cabine.codcab = cabine_1.CODCAB ON dbo.cabkit.CODCAB = cabine_1.CODCAB) AS derivedtbl_1
                    GROUP BY db, CODKIT, kit_halt, kit_lung, kit_halt * kit_lung / 1000000, CODCAB
                    UNION
                    SELECT DISTINCT CODCAB
                    FROM (SELECT CODCAB, db AS [database], CODELE AS codele, LUNG1 AS lung1, LUNG2 AS lung2, HALT AS halt, FORI, SUM(QNT * Expr1) AS qnt, ANG AS ang, (LUNG1 + LUNG2) * HALT / 1000000 AS mq
                                            FROM (SELECT dbo.cabine.CODCAB, dbo.cabine.db, cabkit_1.QNT, cabkit_1.CODKIT, dbo.kitpan.CODELE, dbo.kitpan.QNT AS Expr1, dbo.pannellil.LUNG1, dbo.pannellil.LUNG2, dbo.pannellil.HALT, 
                                                                                                dbo.pannellil.ANG, kit_1.LUNG AS kit_lung, kit_1.HALT AS kit_halt, dbo.pannelli.FORI
                                                                        FROM ($subquery) AS elenco_cabine_1 INNER JOIN
                                                                                                dbo.cabine ON elenco_cabine_1.codcab = dbo.cabine.CODCAB LEFT OUTER JOIN
                                                                                                dbo.cabkit AS cabkit_1 INNER JOIN
                                                                                                dbo.kit AS kit_1 ON cabkit_1.CODKIT = kit_1.CODKIT INNER JOIN
                                                                                                dbo.kitpan ON kit_1.CODKIT = dbo.kitpan.CODKIT INNER JOIN
                                                                                                dbo.pannelli ON dbo.kitpan.CODELE = dbo.pannelli.CODPAS INNER JOIN
                                                                                                dbo.pannellil ON dbo.pannelli.CODLAM = dbo.pannellil.CODPAN ON dbo.cabine.CODCAB = cabkit_1.CODCAB) AS derivedtbl_1_1
                                            GROUP BY db, CODCAB, CODELE, LUNG1, LUNG2, HALT, FORI, ANG, (LUNG1 + LUNG2) * HALT / 1000000) AS derivedtbl_2) AS derivedtbl_3 OPTION ( QUERYTRACEON 9481 )";
    $rCabine=sqlsrv_query($conn,$qCabine);
    if($rCabine==FALSE)
    {
        die("error");
    }
    else
    {
        while($rowCabine=sqlsrv_fetch_array($rCabine))
        {
            array_push($cabineTrovate,$rowCabine["codcab"]);
        }
    }

    $arrayResponse["qPannelli"]=$qPannelli;
    $arrayResponse["qKit"]=$qKit;
    $arrayResponse["qCabine"]=$qCabine;

    $arrayResponse["pannelli"]=$pannelli;
    $arrayResponse["kit"]=$kit;
    $arrayResponse["cabineTrovate"]=$cabineTrovate;

    $arrayResponse["totaliPannelli"]["qnt"]=number_format($arrayResponse["totaliPannelli"]["qnt"],2,",",".");
    $arrayResponse["totaliPannelli"]["mq"]=number_format($arrayResponse["totaliPannelli"]["mq"],2,",",".");
    $arrayResponse["totaliPannelli"]["mq_totali"]=number_format($arrayResponse["totaliPannelli"]["mq_totali"],2,",",".");

    $arrayResponse["totaliKit"]["qnt"]=number_format($arrayResponse["totaliKit"]["qnt"],2,",",".");
    $arrayResponse["totaliKit"]["mq"]=number_format($arrayResponse["totaliKit"]["mq"],2,",",".");
    $arrayResponse["totaliKit"]["mq_totali"]=number_format($arrayResponse["totaliKit"]["mq_totali"],2,",",".");

    echo json_encode($arrayResponse);

?>