
<?php

    include "Session.php";
    include "connessione.php";

    $pagine_preferite=[];
    $sezioni=[];

    $qPreferiti="SELECT mi_webapp.dbo.pagine_preferite_utenti.id_pagina_preferita_utente, mi_webapp.dbo.pagine_preferite_utenti.utente, mi_webapp.dbo.elenco_pagine.id_pagina, mi_webapp.dbo.elenco_pagine.pagina, mi_webapp.dbo.elenco_pagine.nomePagina, mi_webapp.dbo.elenco_pagine.applicazione, mi_webapp.dbo.elenco_pagine.icona
                FROM mi_webapp.dbo.pagine_preferite_utenti INNER JOIN mi_webapp.dbo.elenco_pagine ON mi_webapp.dbo.pagine_preferite_utenti.pagina = mi_webapp.dbo.elenco_pagine.id_pagina
                WHERE (mi_webapp.dbo.pagine_preferite_utenti.utente = ".$_SESSION['id_utente'].") AND (mi_webapp.dbo.elenco_pagine.applicazione = (SELECT id_applicazione FROM mi_webapp.dbo.applicazioni WHERE nomeApplicazione='mi_amministrazione'))";
    $rPreferiti=sqlsrv_query($conn,$qPreferiti);
    if($rPreferiti==FALSE)
    {
        echo "error";
    }
    else
    {
        while($rowPreferiti=sqlsrv_fetch_array($rPreferiti))
        {
            $id_pagina=$rowPreferiti['id_pagina'];
            $pagina=$rowPreferiti['pagina'];
            $nomePagina=$rowPreferiti['nomePagina'];
            $icona=$rowPreferiti['icona'];
            $id_pagina_preferita_utente=$rowPreferiti['id_pagina_preferita_utente'];

            $obj_pagina['id_pagina']=$id_pagina;
            $obj_pagina['pagina']=$pagina;
            $obj_pagina['nomePagina']=$nomePagina;
            $obj_pagina['icona']=$icona;
            $obj_pagina['id_pagina_preferita_utente']=$id_pagina_preferita_utente;

            array_push($pagine_preferite,$obj_pagina);
        }
    }

    $qSezioni="SELECT [id_sezione],[sezione],[descrizione] FROM [mi_webapp].[dbo].[elenco_sezioni] ORDER BY id_sezione";
    $rSezioni=sqlsrv_query($conn,$qSezioni);
    if($rSezioni==FALSE)
    {
        echo "error";
    }
    else
    {
        while($rowSezioni=sqlsrv_fetch_array($rSezioni))
        {
            $id_sezione=$rowSezioni['id_sezione'];
            $sezione=$rowSezioni['sezione'];
            $descrizione=$rowSezioni['descrizione'];
            $pagine_sezioni=[];
            $qPagine="SELECT dbo.elenco_pagine.id_pagina, dbo.elenco_pagine.pagina, dbo.elenco_pagine.nomePagina, dbo.elenco_pagine.applicazione, dbo.elenco_pagine.sezione, dbo.elenco_pagine.icona, dbo.elenco_pagine.descrizione, 
                        dbo.applicazioni.nomeApplicazione
                    FROM dbo.elenco_pagine INNER JOIN
                        dbo.applicazioni ON dbo.elenco_pagine.applicazione = dbo.applicazioni.id_applicazione
                    WHERE (dbo.elenco_pagine.sezione = $id_sezione) AND (dbo.elenco_pagine.id_pagina NOT IN
                            (SELECT elenco_pagine_1.id_pagina
                                FROM dbo.pagine_preferite_utenti INNER JOIN
                                                        dbo.elenco_pagine AS elenco_pagine_1 ON dbo.pagine_preferite_utenti.pagina = elenco_pagine_1.id_pagina
                                WHERE (dbo.pagine_preferite_utenti.utente = ".$_SESSION['id_utente'].") AND (elenco_pagine_1.applicazione = (SELECT id_applicazione FROM mi_webapp.dbo.applicazioni WHERE nomeApplicazione='mi_amministrazione')))) AND (dbo.applicazioni.id_applicazione = (SELECT id_applicazione FROM mi_webapp.dbo.applicazioni WHERE nomeApplicazione='mi_amministrazione'))";
            $rPagine=sqlsrv_query($conn,$qPagine);
            if($rPagine==FALSE)
            {
                echo "error";
            }
            else
            {
                $rowsPagine = sqlsrv_has_rows( $rPagine );
                if ($rowsPagine === true)
                {
                    $obj_sezione['id_sezione']=$id_sezione;
                    $obj_sezione['sezione']=$sezione;
                    $obj_sezione['descrizione']=$descrizione;
                    while($rowPagine=sqlsrv_fetch_array($rPagine))
                    {
                        $id_pagina=$rowPagine['id_pagina'];
                        $pagina=$rowPagine['pagina'];
                        $nomePagina=$rowPagine['nomePagina'];
                        $icona=$rowPagine['icona'];

                        $obj_pagina['id_pagina']=$id_pagina;
                        $obj_pagina['pagina']=$pagina;
                        $obj_pagina['nomePagina']=$nomePagina;
                        $obj_pagina['icona']=$icona;

                        array_push($pagine_sezioni,$obj_pagina);
                    }
                    $obj_sezione['pagine']=$pagine_sezioni;
                    array_push($sezioni,$obj_sezione);
                }
            }
        }
    }

    $response=[];
    array_push($response,json_encode($pagine_preferite));
    array_push($response,json_encode($sezioni));

    echo json_encode($response);

?>