const carga = document.getElementsByClassName("loader");

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    //verifica si el usuario tiene permisos de admin
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
        .then(response => {
            if (response.status === 200) {
                return response.text();
            } else if (response.status === 403) {
                window.location.href ="https://tienda-de-juegos.alwaysdata.net/";
                return;
            }
        })
        .then(data => {
            if (data.usuario != null) {
                usuario(data.usuario);
                activa = true;
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            carga[0].style.display = "none";
            document.body.style.overflow = "auto";
        });

});

function asignarEventoBoton(boton, url) {
    if (boton) {
        boton.addEventListener("click", function () {
            window.location.href = url; // Redirige a la URL especificada
        });
    } else {
        console.error(`El botón no existe: ${url}`);
    }
}





