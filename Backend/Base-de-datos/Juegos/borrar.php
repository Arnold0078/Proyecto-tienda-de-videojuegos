<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');

function borrarJuego($id_juego) {
    $con = conectar();

    try {
        // Validar que el ID no esté vacío
        if (empty($id_juego)) {
            echo json_encode(['mensaje' => 'El ID del juego es obligatorio']);
            exit;
        }

        // Consulta para borrar el videojuego
        $query = "DELETE FROM juegos WHERE id_juego = ?";
        $stmt = $con->prepare($query);

        if (!$stmt) {
            echo json_encode(['mensaje' => 'Error al preparar la consulta: ' . $con->error]);
            exit;
        }

        // Vincular el ID y ejecutar la consulta
        $stmt->bind_param("i", $id_juego);
        $stmt->execute();

        // Verificar si se eliminó algún registro
        if ($stmt->affected_rows > 0) {
            echo json_encode(['mensaje' => 'El videojuego ha sido eliminado exitosamente']);
        } else {
            echo json_encode(['mensaje' => 'No se encontró un videojuego con el ID proporcionado']);
        }

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexión: ' . $e->getMessage()]);
    } finally {
        $con->close();
    }
}

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar que se haya recibido el ID
    if (isset($data['idJuego'])) {
        $id_juego = $data['idJuego'];
        borrarJuego($id_juego);
    } else {
        echo json_encode(['mensaje' => 'Por favor proporcione el ID del juego a borrar']);
    }
}
?>
