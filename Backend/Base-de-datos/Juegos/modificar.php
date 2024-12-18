<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');

function modificarJuego($data) {
    $con = conectar();

    try {
        $id_juego = $data['id_juego'];
        $nombre = $data['nombre'];
        $precio = $data['precio'];
        $descripcion = $data['descripcion'];

        // Validar campos obligatorios
        if (empty($id_juego) || empty($nombre) || empty($precio) || empty($descripcion)) {
            echo json_encode(['mensaje' => 'Todos los campos son obligatorios']);
            exit;
        }

        // Actualizar datos del juego en la base de datos
        $query = "
            UPDATE juegos
            SET nombre = ?, precio = ?, descripcion = ?
            WHERE id_juego = ?
        ";
        $stmt = $con->prepare($query);
        if (!$stmt) {
            echo json_encode(['mensaje' => 'Error al preparar la consulta: ' . $con->error]);
            exit;
        }

        $stmt->bind_param("sdsi", $nombre, $precio, $descripcion, $id_juego);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['mensaje' => 'El videojuego ha sido modificado exitosamente']);
        } else {
            echo json_encode(['mensaje' => 'No se encontró el juego con el ID proporcionado o no hubo cambios']);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexión: ' . $e->getMessage()]);
    } finally {
        $con->close();
    }
}

// Verificar si la petición es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar que se hayan recibido datos
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        modificarJuego($datos);
    } else {
        echo json_encode(['mensaje' => 'Por favor proporcione los datos del juego a modificar']);
    }
}
?>
