<?php
include('../cors.php');
session_start();
header('Content-Type: application/json');

$usuario = null;

if (isset($_SESSION['usuario'])) {
    $usuario = $_SESSION['usuario'];
    echo json_encode(['usuario' => $usuario]);
} else {
    echo json_encode(['usuario' => $usuario]);
}
?>
