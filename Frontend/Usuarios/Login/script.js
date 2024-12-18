const correo = document.getElementById("email");
const contraseña = document.getElementById("contraseña");

document.addEventListener("DOMContentLoaded", () => {

    //busca si ya hay una sesion activa
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
    .then(response => response.json())
    .then(data => {
        if (data.usuario != null){
            self.location = "https://tienda-de-juegos.alwaysdata.net/";
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById("boton").addEventListener("click", ()=>{

    if(correo.value != "" && contraseña.value != ""){
        const credenciales = {
            correo: correo.value,
            contraseña: contraseña.value
        }
        
        //busca el usuario en la base de datos
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Usuarios/buscar.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                funcion: "buscarCredenciales",
                datos: credenciales
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje != "Bienvenido ") {
                alert(data.mensaje);
            }else{
                alert(data.mensaje + data.usuario.nickname);
                self.location = "https://tienda-de-juegos.alwaysdata.net/";
            }
        })
        .catch(error => console.error('Error:', error));
    }
    else
    alert("Por favor rellene todos los espacios");

});