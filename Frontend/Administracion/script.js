const carga = document.getElementsByClassName("loader");

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    Promise.all([
        //verifica si el usuario inicio session
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
        .then(response => response.json())
        .then(data => {
            if (data.usuario != null) {
                usuario(data.usuario);
                activa = true;
            }
        })
    ])
    .catch(error => console.error('Error:', error))
    .finally(() => {
        carga[0].style.display = "none";
        document.body.style.overflow = "auto";
    });
});

window.addEventListener('resize', () => {
    if(window.innerWidth >= 767){
        document.getElementById("filtros-busqueda").style.right = "100%";
    }

    if(window.innerHeight <= 637 && window.innerWidth <= 767){
        document.getElementById("filtros-busqueda").style.overflowY = "scroll";
    }else{
        document.getElementById("filtros-busqueda").style.overflowY = "hidden";
    }
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

// Asignación de eventos a los botones
const insertarJuego = document.getElementById("insertvdj");
asignarEventoBoton(insertarJuego, "formularios/forminsert/finsert.html");

const buscarJuego = document.getElementById("buscarvdj");
asignarEventoBoton(buscarJuego, "formularios/formbuscar/fbuscar.html");

const modificarJuego = document.getElementById("modvdj");
asignarEventoBoton(modificarJuego, "formularios/formupdate/fmodificar.html");

const borrarJuego = document.getElementById("borrarbdj");
asignarEventoBoton(borrarJuego, "formularios/formdelete/fdelete.html");




