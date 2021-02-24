<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $id_materia_prima=$_REQUEST["id_materia_prima"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];
    $oldValue=$_REQUEST["oldValue"];

    switch ($colonna) 
    {
        case 'raggruppamento':
            $stmt = sqlsrv_query( $conn, "SELECT * FROM raggruppamenti_materie_prime WHERE nome='$valore'");

            if ($stmt)
            {
                $rows = sqlsrv_has_rows( $stmt );
                if ($rows === true)
                {
                    $q="UPDATE materie_prime SET [$colonna]=(SELECT MAX(id_raggruppamento) FROM raggruppamenti_materie_prime WHERE nome='$valore') WHERE id_materia_prima = $id_materia_prima";
                    $r=sqlsrv_query($conn,$q);
                    if($r==FALSE)
                    {
                        die("error".$q);
                    }
                }
            }
            else
                die("error");
        break;
        default:
            $q="UPDATE materie_prime SET [$colonna]='$valore' WHERE id_materia_prima = $id_materia_prima";
            $r=sqlsrv_query($conn,$q);
            if($r==FALSE)
            {
                die("error".$q);
            }
        break;
    }

    if($colonna=="peso")
    {
        $q="INSERT INTO [dbo].[log_modifiche_peso_materie_prime] ([id_materia_prima],[oldValue],[newValue],[id_utente],[username],[codice_materia_prima],[dataOra])
            SELECT $id_materia_prima AS id_materia_prima, '$oldValue' AS oldValue, '$valore' AS newValue, ".$_SESSION['id_utente']." AS id_utente, '".$_SESSION['username']."' AS username,(SELECT codice_materia_prima FROM dbo.materie_prime WHERE (id_materia_prima = $id_materia_prima)) AS codice_materia_prima, GETDATE() AS dataOra";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error".$q);
        }
    }

?>