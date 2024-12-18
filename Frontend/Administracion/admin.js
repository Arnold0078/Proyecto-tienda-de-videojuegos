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




