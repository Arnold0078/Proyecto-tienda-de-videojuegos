<?php
include('../cors.php');
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($_SESSION['carrito'])) {
        $_SESSION['carrito'] = array();
    }

    if (isset($data['juego'])) {
        $juego = $data['juego'];
        array_push($_SESSION['archivos'], $juego);
        echo json_encode(['mensaje' => 'Juego añadido exitosamente al carrito']);

    }else{
        echo json_encode(['mensaje' => 'Por favor proporcione el id del juego a añadirlo al carrito']);
    }
}

?>