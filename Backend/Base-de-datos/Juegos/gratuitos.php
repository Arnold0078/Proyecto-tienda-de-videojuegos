<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
include('../../conversion-imagenes/convertir_base64.php');

function JuegosGratuitos($data){
    $con = conectar();

    $offset = $data;

    try {
        $stmt = $con->prepare("SELECT * FROM juegos WHERE precio = 0 ORDER BY id_juego DESC LIMIT 30 OFFSET ?");
        $stmt->bind_param("i", $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        //En caso de tener resultados, estos pasan a un arreglo legible para el JSON a enviar
        if($result->num_rows > 0){   
            $gratis = [];
            while ($row = $result->fetch_assoc()) {
                $gratis[] = $row;
            }

            //pasamos las imagenes a un formato legible para el JSON
            //funcion del archivo convertir_base64
            $gratis = convertir_64($gratis);

            echo json_encode(['juegosGratis' => $gratis]);
        }else{
            echo json_encode(['mensaje' => 'Juegos no encontrados']);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
    }
    $con->close();
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        JuegosGratuitos($datos);
    }else{
        echo json_encode(['mensaje' => 'Offset no recibido']);
    }
}

?>