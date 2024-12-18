<?php

function convertir_64($arreglo){
    
    if (is_array($arreglo)) {
        for ($i=0; $i < count($arreglo); $i++) { 
            $arreglo[$i]['imagen'] = base64_encode($arreglo[$i]['imagen']);
        }
    }else{
        $arreglo['imagen'] = base64_encode($arreglo['imagen']);
    }

    return $arreglo;
}

?>