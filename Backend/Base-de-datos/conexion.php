<?php

function conectar(){
    $user = "384016";
    $pass = "jugar123";
    $server = "mysql-tienda-de-juegos.alwaysdata.net";
    $db = "tienda-de-juegos_database";
    $con = mysqli_connect($server,  $user, $pass, $db);

    if (!$con) {
        die("Error de conexión: " . mysqli_connect_error());
    }

    return $con;
}

?>