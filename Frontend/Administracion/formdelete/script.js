document.querySelector('.formulario form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evitar el envío del formulario tradicional

    // Capturar el ID del videojuego
    const idJuego = document.getElementById('idJuego').value;

    // Validar que el ID no esté vacío
    if (!idJuego) {
        alert('Por favor, ingresa un ID válido.');
        return;
    }

    // Enviar datos al servidor
    try {
        const response = await fetch('borrar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idJuego: idJuego })
        });

        const result = await response.json();

        if (result.success) {
            alert('Videojuego borrado exitosamente.');
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al intentar borrar el videojuego.');
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

window.addEventListener('resize', () => {
    if (window.innerWidth <= 991)
        logo.style.background = "rgb(0, 3, 44)";
    else if (window.scrollY === 0)
        logo.style.background = "none";

    if (window.innerWidth >= 767) {
        document.body.style.overflow = "auto";
        document.getElementById("barra-lateral").style.left = "100%"
    }

    if (window.innerHeight <= 637 && window.innerWidth <= 767) {
        document.getElementById("barra-lateral").style.overflowY = "scroll";
    } else {
        document.getElementById("barra-lateral").style.overflowY = "hidden";
    }
});

window.onscroll = function () {
    if (window.scrollY != 0 && window.innerWidth > 991)
        logo.style.background = "rgb(0, 3, 44)";
    else if (window.innerWidth > 991)
        logo.style.background = "none";

};

function cerrarSesion() {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/cerrar_sesion.php");
    window.location.href = "https://tienda-de-juegos.alwaysdata.net/";
}

document.getElementById("btn-libreria").addEventListener("click", () => {
    if (!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-comunidad").addEventListener("click", () => {
    if (!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-carrito").addEventListener("click", () => {
    if (!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("mostrar-barra-principal").addEventListener("click", () => {
    document.body.style.overflow = "hidden";
    document.getElementById("barra-lateral").style.left = "0%"
})

document.getElementById("cerrar-barra").addEventListener("click", () => {
    document.body.style.overflow = "auto";
    document.getElementById("barra-lateral").style.left = "100%"
})