<?php
include('../cors.php');
header('Content-Type: application/json');
session_start();

$carrito = null;

if (isset($_SESSION['carrito'])) {
    $carrito = $_SESSION['carrito'];
}

if ($carrito != null && count($carrito) != 0) {
    $carrito = $_SESSION['carrito'];
    echo json_encode(['carrito' => $carrito]);
} else {
    echo json_encode(['carrito' => null]);
}
?>