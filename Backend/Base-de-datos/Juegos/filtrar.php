<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
include('../../conversion-imagenes/convertir_base64.php');

function buscarJuegosFiltros($data) {
    $con = conectar();

    try {
        //Tomamos los filtros que llegaron del JSON
        $offset = isset($data['offset']) ? $data['offset'] : 0;
        $categorias = isset($data['categorias']) ? $data['categorias'] : [];
        $precioMinimo = isset($data['precioMinimo']) ? $data['precioMinimo'] : '';
        $precioMaximo = isset($data['precioMaximo']) ? $data['precioMaximo'] : '';
        $orden = isset($data['orden']) ? $data['orden'] : false;

        //Crea la consulta SQL
        $query = "
                SELECT j.id_juego, j.nombre, j.precio, j.imagen, j.descripcion, j.ruta
                FROM juegos AS j
                INNER JOIN categorias_juego AS cj ON j.id_juego = cj.juego_id
                INNER JOIN categorias AS c ON cj.categoria_id = c.id_categoria
        ";

        $conditions = [];
        $bindings = [];

        // Agrega las condiciones dinamicas
        if (!empty($categorias)) {
            $placeholders = implode(",", array_fill(0, count($categorias), "?"));
            $conditions[] = "c.id_categoria IN ($placeholders)";
            $bindings = array_merge($bindings, $categorias);
        }

        if ($precioMinimo !== '') {
            $conditions[] = "j.precio >= ?";
            $bindings[] = $precioMinimo;
        }

        if ($precioMaximo !== '') {
            $conditions[] = "j.precio <= ?";
            $bindings[] = $precioMaximo;
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $query .= $orden ? " ORDER BY j.id_juego ASC" : " ORDER BY j.id_juego DESC";
        $query .= " LIMIT 30 OFFSET ?";

        //Agregamos el index donde deseamos traer los datos
        $bindings[] = $offset;

        // Preparar y ejecutar consulta
        $stmt = $con->prepare($query);
        if (!$stmt) {
            echo json_encode(['mensaje' => 'Error al preparar la consulta: ' . $con->error]);
            exit;
        }

        // Define los tipos de datos acorde a los parametros enviados
        $type = str_repeat('i', count($categorias)) . 
                (($precioMinimo !== '' && $precioMaximo !== '') ? 'ii' : 
                (($precioMinimo !== '' || $precioMaximo !== '') ? 'i' : '')) . 
                'i';

        $stmt->bind_param($type, ...$bindings);
        $stmt->execute();
        $result = $stmt->get_result();

        // Hace que los datos recibidos se guarden en un array leible para el JSON a enviar
        if ($result->num_rows > 0) {
            $juegos = [];

            while ($row = $result->fetch_assoc()) {
                $juegos[] = $row;
            }

            //pasamos las imagenes a un formato legible para el JSON
            //funcion del archivo convertir_base64
            $juegos = convertir_64($juegos);

            echo json_encode(['juegos' => $juegos]);
        } else {
            echo json_encode(['mensaje' => "No se encontraron juegos con los filtros proporcionados"]);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexión, por favor inténtelo más tarde']);
    }

    $con->close();
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        buscarJuegosFiltros($datos);
    }else{
        echo json_encode(['mensaje' => 'Por favor seleccione al menos un filtro']);
    }
}


?>