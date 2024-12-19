const carga = document.getElementsByClassName("loader");
const correo = document.getElementById("email");
const contraseña = document.getElementById("contraseña");

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    //busca si ya hay una sesion activa
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
    .then(response => response.json())
    .then(data => {
        if (data.usuario != null){
            self.location = "https://tienda-de-juegos.alwaysdata.net/";
        }
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        carga[0].style.display = "none";
        document.body.style.overflow = "auto";
    });
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