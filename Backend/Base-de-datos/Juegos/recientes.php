<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
include('../../conversion-imagenes/convertir_base64.php');

function juegosRecientes(){
    $con = conectar();
    try {
        $stmt = $con->prepare("SELECT * FROM juegos ORDER BY id_juego DESC LIMIT 30");
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0){   
            $recientes = [];
            while ($row = $result->fetch_assoc()) {
                $recientes[] = $row;
            }

            //pasamos las imagenes a un formato legible para el JSON
            //funcion del archivo convertir_base64
            $recientes = convertir_64($recientes);

            echo json_encode(['juegosRecientes' => $recientes]);
        }else{
            echo json_encode(['mensaje' => 'Juegos no encontrados']);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
    }
    $con->close();
}

//verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    juegosRecientes();
}else{
    echo json_encode(['mensaje' => 'Tipo de peticion incorrecta']);
}

?>