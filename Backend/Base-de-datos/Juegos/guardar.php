<?php

include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');

function guardarJuego($data){
    $nombre = $data['nombre'];
    $descripcion = $data['descripcion'];
    $precio = $data['precio'];
    $categorias = $data['categorias'] ? $data['categorias'] : [];
    $imagen = $data['imagen'];

    if (empty($nombre) || empty($descripcion)  || empty($precio) || empty($categorias)|| empty($imagen)) {
        http_response_code(400);
        echo json_encode(['mensaje' => 'Datos incompletos']);
    }else{
        $blob = base64_decode($imagen);

        $con = conectar();
        try{
            $stmt = $con->prepare("INSERT INTO juegos(nombre, imagen, descripcion, precio) VALUES(?,?,?,?)");
            $stmt->bind_param("sbss", $nombre, $blob, $descripcion, $precio);
            $stmt->send_long_data(1, $blob);

            if ($stmt->execute()) {
                $id_juego = $con->insert_id;
                añadirCategorias($con ,$categorias , $id_juego);
                echo json_encode(['mensaje' => 'juego guardado exitosamente']) ;
            } else {
                http_response_code(409);
                echo json_encode(['mensaje' => 'El juego a guardar ya existe..']) ;

            }

        } catch (mysqli_sql_exception $e) {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
        }
        $con->close();
    }
}

function añadirCategorias($con , $categorias , $id_juego) {
        
    try{

        foreach ($categorias as $index => $categoria) {
        echo json_encode(['mensaje' => $categoria['id_categoria']]);

        $stmt = $con->prepare("INSERT INTO categorias_juego(juego_id , categoria_id) VALUES(?,?)");
        $stmt->bind_param("ii", $id_juego, $categoria['id_categoria'] );
        $stmt->execute();
        }

    } catch (mysqli_sql_exception $e) {
        http_response_code(500);
        echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
    }

}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        GuardarJuego($datos);
    }else{
        http_response_code(400);
        echo json_encode(['mensaje' => 'Datos no recibidos']);
    }
}

?>