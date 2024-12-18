<?php
include('../../cors.php');
header('Content-Type: application/json');
include('../conexion.php');


function buscarCategorias($data) {
    $categorias = [];
    try {
        $con = conectar();
        
        //Se verifica si hay que buscar categorias especificas o quiere todas las categorias
        if ($data != null) {
            $placeholders = implode(",", array_fill(0, count($data), "?"));

            //verifica si la busqueda fue por id o por nombre
            if(!array_reduce($data, fn($arry, $item) => $arry && is_string($item), true)){
                $stmt = $con->prepare("SELECT * FROM categorias WHERE id_categoria IN ($placeholders)");
                $stmt->bind_param(str_repeat('i', count($data)), ...$data);
                $stmt->execute();
                $result = $stmt->get_result();
        
                if($result->num_rows > 0){
                    while ($row = $result->fetch_assoc()) {
                        $categorias[] = $row;
                    }
                    echo json_encode(['categorias' => $categorias]);
                }
            }else{
                $stmt = $con->prepare("SELECT id_categoria FROM categorias WHERE nombre IN ($placeholders)");
                $stmt->bind_param(str_repeat('s', count($data)), ...$data);
                $stmt->execute();
                $result = $stmt->get_result();
        
                if($result->num_rows > 0){
                    while ($row = $result->fetch_assoc()) {
                        $categorias[] = $row['id_categoria'];
                    }
                }
            }
        }else{
            //busca todas las categorias
            $stmt = $con->prepare("SELECT * FROM categorias");
            $stmt->execute();
            $result = $stmt->get_result();
    
            if($result->num_rows > 0){
                while ($row = $result->fetch_assoc()) {
                    $categorias[] = $row;
                }
                echo json_encode(['categorias' => $categorias]);
            }

        }

        $con->close();

        return $categorias;

    } catch (mysqli_sql_exception $e) {
        return null;
    }
}

//Verifica si la peticion enviada es correcta
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $datos = null;

    //verifica si existen datos en la peticion
    if (isset($data['datos'])) {
        $datos = $data['datos'];
    }

    buscarCategorias($datos);
}

?>