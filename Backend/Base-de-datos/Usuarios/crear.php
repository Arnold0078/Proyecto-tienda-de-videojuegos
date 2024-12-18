<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
session_start();

function crearUsuario($data){
    $con = conectar();

    if ($data) {

        $nickname = $data['nickname'];
        $correo = $data['correo'];
        $fechaNacimiento = $data['fechaNacimiento'];
        $contraseña = password_hash($data['contraseña'], PASSWORD_DEFAULT);

        try {
            $stmt = $con->prepare("INSERT INTO usuarios (nickname, correo, fecha_nacimiento, contraseña) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $nickname, $correo, $fechaNacimiento, $contraseña);
            $stmt->execute();
            
            $stmt = $con->prepare("SELECT * FROM usuarios WHERE nickname = ?");
            $stmt->bind_param("s", $nickname);
            $stmt->execute();
            $result = $stmt->get_result();
            $usuario = $result->fetch_assoc();

            $_SESSION['usuario'] = $usuario;

            echo json_encode(['mensaje' => 'Cuenta creada']);
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
        }
    } else {
        echo json_encode(['mensaje' => 'Error al recibir datos']);
    }

    $con->close();
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        crearUsuario($datos);
    }else{
        echo json_encode(['mensaje' => 'Por favor proporcione todos los datos del cliente a crear']);
    }
}

?>