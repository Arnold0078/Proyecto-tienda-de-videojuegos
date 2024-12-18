<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
include('../../conversion-imagenes/convertir_base64.php');

function buscarJuego($data){
    $con = conectar();
    try {
        $dato = $data['dato'];
        $busqueda = $data['busqueda'];
        $tipo;

        $query = "
                SELECT j.id_juego, j.nombre, j.precio, j.imagen, j.descripcion, j.ruta, GROUP_CONCAT(c.id_categoria) AS categorias
                FROM juegos AS j
                INNER JOIN categorias_juego AS cj ON j.id_juego = cj.juego_id
                INNER JOIN categorias AS c ON cj.categoria_id = c.id_categoria
        ";

        if($busqueda == 'nombre'){
            $query .= "WHERE nombre = ?";
            $tipo = "s";
        }else{
            $query .= "WHERE id_juego = ?";
            $tipo = "i";
        }

        $stmt = $con->prepare($query);
        if (!$stmt) {
            echo json_encode(['mensaje' => 'Error al preparar la consulta: ' . $con->error]);
            exit;
        }

        $stmt->bind_param($tipo, $dato);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        //Pasa los datos a un formato legible para el JSON
        if ($row != null) {
            echo json_encode(['mensaje' => $row]);
            $juego = [
                'id_juego' => $row['id_juego'],
                'nombre' => $row['nombre'],
                'precio' => $row['precio'],
                'imagen' => $row['imagen'],
                'descripcion' => $row['descripcion'],
                'ruta' => $row['ruta'],
                'categorias' => explode(',', $row['categorias'])
            ];

            //Convierte la imagen en base 64 para el JSON
            $juego = convertir_64($juego);
            echo json_encode(['juego' => $juego]);
        }else{
            echo json_encode(['mensaje' => 'Juego no encontrado']);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
    }
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        buscarJuego($datos);
    }else{
        echo json_encode(['mensaje' => 'Por favor proporcione el nombre o id del juego a buscar']);
    }
}

?>