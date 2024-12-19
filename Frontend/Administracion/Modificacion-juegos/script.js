document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencias a elementos
    const form = document.getElementById("formModificar");
    const searchButton = document.getElementById("searchButton");
    const gameSearchInput = document.getElementById("gameSearch");
    const parameterSection = document.getElementById("parameterSection");
    const newValueSection = document.getElementById("newValueSection");
    const submitButtonSection = document.getElementById("submitButtonSection");
    const mensajeBusqueda = document.getElementById("mensajeBusqueda");

    // Evento para manejar el botón de búsqueda
    searchButton.addEventListener("click", async () => {
        const gameName = gameSearchInput.value.trim();

        if (!gameName) {
            mostrarMensajeBusqueda("Por favor, ingresa el nombre del juego.", "error");
            return;
        }

        try {
            // Enviar solicitud al backend para buscar el videojuego
            const response = await fetch("buscarVideojuego.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dato: gameName, busqueda: "nombre" }),
            });

            const data = await response.json();

            if (data.juego) {
                mostrarMensajeBusqueda("Juego encontrado: " + data.juego.nombre, "success");
                // Mostrar las secciones para modificar
                parameterSection.style.display = "block";
                newValueSection.style.display = "block";
                submitButtonSection.style.display = "block";
            } else {
                mostrarMensajeBusqueda(data.mensaje || "Juego no encontrado.", "error");
                // Ocultar las secciones en caso de error
                parameterSection.style.display = "none";
                newValueSection.style.display = "none";
                submitButtonSection.style.display = "none";
            }
        } catch (error) {
            console.error(error);
            mostrarMensajeBusqueda("Error al buscar el videojuego. Intenta nuevamente.", "error");
        }
    });

    // Evento para manejar el envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validar que todos los campos estén completos
        const parameter = document.getElementById("parameterSelect").value;
        const newValue = document.getElementById("newValue").value.trim();

        if (!parameter || !newValue) {
            mostrarMensajeBusqueda("Completa todos los campos para modificar.", "error");
            return;
        }

        // Crear objeto de datos
        const datos = {
            parameter: parameter,
            newValue: newValue,
            gameName: gameSearchInput.value.trim(), // Usar el nombre del juego buscado
        };

        try {
            // Enviar solicitud para modificar el videojuego
            const response = await fetch("modificar.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });

            const data = await response.json();

            if (data.success) {
                mostrarMensajeBusqueda("Videojuego modificado con éxito.", "success");
                form.reset();
                parameterSection.style.display = "none";
                newValueSection.style.display = "none";
                submitButtonSection.style.display = "none";
            } else {
                mostrarMensajeBusqueda(data.mensaje || "Error al modificar el videojuego.", "error");
            }
        } catch (error) {
            console.error(error);
            mostrarMensajeBusqueda("Error al conectar con el servidor.", "error");
        }
    });

    // Función para mostrar mensajes
    function mostrarMensajeBusqueda(texto, tipo) {
        mensajeBusqueda.textContent = texto;
        mensajeBusqueda.className = tipo === "success" ? "alert alert-success" : "alert alert-danger";
        mensajeBusqueda.style.display = "block";

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeBusqueda.style.display = "none";
        }, 5000);
    }
});






///Pantalla de carga
const carga = document.getElementsByClassName("loader");
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    if (window.innerHeight <= 637 && window.innerWidth <= 767) {
        document.getElementById("barra-lateral").style.overflowY = "scroll";
    } else {
        document.getElementById("barra-lateral").style.overflowY = "hidden";
        document.getElementById("barra-lateral").style.overflowX = "hidden";
    }

    setTimeout(function () {
        carga[0].style.display = "none";
        document.body.style.overflow = "auto";
    }, 2000);
});