<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');

function generar_factura($data){
    $usuario_id = $data['usuarioId'];
    $numero_tarjeta = $data['tarjeta']['numeroTarjeta'];
    $fecha_tarjeta = $data['tarjeta']['fechaTarjeta'];
    $codigo_tarjeta = $data['tarjeta']['codigo'];
    $propietario_tarjeta = $data['tarjeta']['nombrePropietario'];
    $total = $data['total'];
    $juegos = $data['juegosComprados'] ? $data['juegosComprados'] : [];
    $nombreEmpresa = "TIENDA DE JUEGOS";
    $nit = "12345678-9";

    $id_juegos = [];

    foreach ($juegos as $index => $juego) {
        $id_juegos[] = $juego['id'];
    }

    if (!empty($id_juegos)) {
        $con = conectar();

        try {
            $stmt = $con->prepare("INSERT INTO facturas(nombre_empresa, nit, usuario_id, numero_tarjeta, fecha_tarjeta, codigo_tarjeta, propietario_tarjeta) VALUES(?,?,?,?,?,?,?)");
            $stmt->bind_param("ssiisis", $nombreEmpresa, $nit, $usuario_id, $numero_tarjeta, $fecha_tarjeta, $codigo_tarjeta, $propietario_tarjeta);
            $stmt->execute();

            $id_factura = $con->insert_id;
            guardar_juegos($id_factura, $usuario_id, $id_juegos, $con);
            $factura = buscarFactura($id_factura, $con);

            echo json_encode(['facturaRecibida' => $factura]);
            
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
        }

    }else{
        echo json_encode(['mensaje' => 'No hay juegos para guardar']);
    }
}

function guardar_juegos($id_factura, $id_usuario, $juegos, $con){

    foreach ($juegos as $index => $juego) {
        try {
            $stmt = $con->prepare("INSERT INTO juegos_comprados(factura_id, juego_id) VALUES(?,?)");
            $stmt->bind_param("ii", $id_factura, $juego);
            $stmt->execute();
            
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde, juegos de la Factura']);
        }

        try {
            $stmt = $con->prepare("INSERT INTO juegos_usuario(usuario_id, juego_id) VALUES(?,?)");
            $stmt->bind_param("ii", $id_usuario, $juego);
            $stmt->execute();
            
        } catch (mysqli_sql_exception $e) {
            echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde, Juegos del Usuario']);
        }
    }
}

function buscarFactura($id, $con){
    try {
        $stmt = $con->prepare("SELECT * FROM facturas WHERE id_factura = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $factura = $result->fetch_assoc(); 
        return $factura;

    } catch (mysqli_sql_exception $e) {
        echo json_encode(['mensaje' => 'Error de conexion por favor intentelo mas tarde']);
        return null;
    }
}


//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    //verifica si existen datos en la peticion
    if (isset($data['factura'])) {
        $datos = $data['factura'];
        generar_factura($datos);
    }else{
        echo json_encode(['mensaje' => 'Factura no recibida']);
    }
}
?>