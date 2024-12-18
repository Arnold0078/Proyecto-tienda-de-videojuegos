<?php
include('../cors.php');
header('Content-Type: application/json');
session_start();

//verifica el tipo de peticion
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    $carrito = null;

    if (isset($_SESSION['carrito'])) {
        $carrito = $_SESSION['carrito'];
    }

    if ($carrito != null && count($carrito) != 0) {
        echo json_encode(['mensaje' => 'Carrito vacio']);

    } else if (isset($data['id'])) {
        $id = $data['id'];

        //En caso de encontrar el juego lo elimina y reemplaza el arreglo de juegos del carro y sale de la consulta
        foreach ($carrito as $index => $juego) {
            if ($juego['id'] == $id) {
                unset($carrito[$index]);
                $_SESSION['carrito'] = array_values($carrito);
                echo json_encode(['mensaje' => 'Juego eliminado del carrito']);
                die();
            }
        }

        echo json_encode(['mensaje' => 'Juego a eliminar del carrito no encontrado']);

    } else {
        echo json_encode(['mensaje' => 'Por favor proporcione el id del juego a eliminar del carrito']);
    }
}

?>