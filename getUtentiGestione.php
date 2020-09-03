<?php

    include "connessione.php";

    $eliminato=$_REQUEST["eliminato"];
    $orderBy=$_REQUEST["orderBy"];

    $utenti=[];

    $query2="SELECT * FROM dbo.utenti WHERE eliminato LIKE '%$eliminato%' ORDER BY $orderBy";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $utente["id_utente"]=$row2['id_utente'];
            $utente["username"]=$row2['username'];
            $utente["nome"]=$row2['nome'];
            $utente["cognome"]=$row2['cognome'];
            $utente["eliminato"]=$row2['eliminato'];
            $utente["usernamePC"]=$row2['usernamePC'];
            $utente["mail"]=$row2['mail'];

            array_push($utenti,$utente);
        }
    }

    echo json_encode($utenti);

?>