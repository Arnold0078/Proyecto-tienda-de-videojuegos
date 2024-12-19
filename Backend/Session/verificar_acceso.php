<?php
include('../cors.php');
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario']) && $_SESSION['usuario']['rol'] == "admin") {
    $usuario = $_SESSION['usuario'];
    echo json_encode(['usuario' => $usuario]);
} else {
    http_response_code(403);
    echo json_encode(['usuario' => 'null']);
}

?>