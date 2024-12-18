<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');
session_start();


function buscarCredenciales($data){
    $con = conectar();

    if ($data) {
        $correo = $data['correo'];
        $contraseña = $data['contraseña'];

        $stmt = $con->prepare("SELECT * FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        $usuario = $result->fetch_assoc();
        
        if ($usuario != null) {
            $lista = [array("id" => 14, "nombre" => "sunrider", "precio" => 2000), array("id" => 16, "nombre" => "hollow", "precio" => 2000)];

            if (password_verify($contraseña, $usuario['contraseña'])) {
                $_SESSION['usuario'] = $usuario;
                $_SESSION['carrito'] = $lista;
                echo json_encode(['mensaje' => "Bienvenido ", "usuario" => $usuario]);
            }else 
                echo json_encode(['mensaje' => "Correo o contraseña incorrectos"]);
        } else {
            echo json_encode(['mensaje' => "Correo o contraseña incorrectos"]);
        }
    } else {
        echo json_encode(['mensaje' => 'Error al recibir datos']);
    }

    $con->close();
}

function buscarNickname($data){
    $con = conectar();

    if ($data) {

        $stmt = $con->prepare("SELECT nickname FROM usuarios WHERE nickname = ?");
        $stmt->bind_param("s", $data);
        $stmt->execute();
        $result = $stmt->get_result();
        $nickname = $result->fetch_assoc();

        echo json_encode(["nickname" => $nickname]);
    } else {
        echo json_encode(['mensaje' => 'Error al recibir datos']);
    }

    $con->close();
}

function buscarCorreo($data){
    $con = conectar();

    if ($data) {

        $stmt = $con->prepare("SELECT correo FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $data);
        $stmt->execute();
        $result = $stmt->get_result();
        $correo = $result->fetch_assoc();

        echo json_encode(["correo" => $correo]);
    } else {
        echo json_encode(['mensaje' => 'Error al recibir datos']);
    }

    $con->close();
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    header('Content-Type: application/json');

    $funcion = $data['funcion'];

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
        //Encuentra el tipo de busqueda que se necesita
        switch ($funcion) {
            case "buscarCredenciales":
                buscarCredenciales($datos);
                break;
            
            case "buscarNickname":
                buscarNickname($datos);
                break;
            
            case "buscarCorreo":
                buscarCorreo($datos);
                break;
            default:
                echo json_encode(['mensaje' => 'función no encontrada']);
                break;
        }
    }else{
        echo json_encode(['mensaje' => 'No se proporcionaron datos']);
    }
}


?>