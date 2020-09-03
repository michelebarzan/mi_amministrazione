<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $permessi_pagine=[];

    $query2="SELECT DISTINCT TOP (100) PERCENT derivedtbl_1.id_pagina, derivedtbl_1.pagina, derivedtbl_1.nomePagina, derivedtbl_1.applicazione, derivedtbl_1.checked, dbo.applicazioni.descrizione
    FROM            (SELECT        TOP (100) PERCENT dbo.elenco_pagine.id_pagina, dbo.elenco_pagine.pagina, dbo.elenco_pagine.nomePagina, dbo.elenco_pagine.applicazione, 'checked' AS checked
                              FROM            dbo.elenco_pagine LEFT OUTER JOIN
                                                        dbo.permessi_pagine ON dbo.elenco_pagine.id_pagina = dbo.permessi_pagine.pagina
                              WHERE        (dbo.permessi_pagine.utente = $id_utente)
                              UNION ALL
                              SELECT        TOP (100) PERCENT id_pagina, pagina, nomePagina, applicazione, '' AS checked
                              FROM            dbo.elenco_pagine AS elenco_pagine_2
                              WHERE        (id_pagina NOT IN
                                                           (SELECT        TOP (100) PERCENT elenco_pagine_1.id_pagina
                                                             FROM            dbo.elenco_pagine AS elenco_pagine_1 LEFT OUTER JOIN
                                                                                       dbo.permessi_pagine AS permessi_pagine_1 ON elenco_pagine_1.id_pagina = permessi_pagine_1.pagina
                                                             WHERE        (permessi_pagine_1.utente = $id_utente)))) AS derivedtbl_1 INNER JOIN
                             dbo.applicazioni ON derivedtbl_1.applicazione = dbo.applicazioni.id_applicazione
    ORDER BY derivedtbl_1.applicazione";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $permesso_pagina["id_pagina"]=$row2['id_pagina'];
            $permesso_pagina["nomePagina"]=$row2['nomePagina'];
            $permesso_pagina["applicazione"]=$row2['descrizione'];
            $permesso_pagina["checked"]=$row2['checked'];

            array_push($permessi_pagine,$permesso_pagina);
        }
    }

    echo json_encode($permessi_pagine);

?>