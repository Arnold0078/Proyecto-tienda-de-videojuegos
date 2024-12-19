const generoJuego = document.getElementById('generoJuego');
var listaCategorias = [];

// Función para manejar el envío del formulario

document.querySelector('.botonJuego').addEventListener('click', function (e) {
    e.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    // Recoger los datos del formulario
    const nombreJuego = document.getElementById('nombreJuego').value;
    const descripcionJuego = document.getElementById('descripcionJuego').value;
    const precioJuego = document.getElementById('precioJuego').value;
    const imagenJuego = document.getElementById('imagenJuego').files[0];

    console.log(imagenJuego);
    if (imagenJuego) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagenBase64 = e.target.result; // Aquí tienes la imagen en base64

            var categorias = listaCategorias.filter(categoria => categoria.id_categoria == generoJuego.value);


            // Crear un objeto FormData para enviar los datos
            const formData = {
                nombre: nombreJuego,
                descripcion: descripcionJuego,
                precio: precioJuego,
                categorias: categorias,
                imagen: imagenBase64
            };

            console.log(formData);


            // Enviar los datos al archivo PHP usando fetch()
            fetch('https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Juegos/guardar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    datos: formData
                })
            })
                .then(response => response.json())  // Aseguramos que la respuesta sea en formato JSON
                .then(data => {
                    if (data.mensaje == "juego guardado exitosamente") {
                        alert('Juego añadido exitosamente');

                    } else {
                        alert('Hubo un error al añadir el juego');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error de conexión, por favor intente nuevamente.');
                });
        };

        reader.readAsDataURL(imagenJuego); // Lee la imagen como base64
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

    Promise.all([

        //busca todas las categorias
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Categorias/buscar.php", {
            method: "POST",
        })
            .then(response => response.json())
            .then(data => {
                if (data.categorias != undefined) {
                    data.categorias.forEach(categoria => {
                        const option = document.createElement("option");
                        option.setAttribute('value', categoria.id_categoria);
                        option.textContent = categoria.nombre;
                        generoJuego.appendChild(option);
                        listaCategorias.push(categoria);
                        console.log(categoria);
                    });
                }
            })


    ])
    .catch(error => console.error('Error:', error))
    .finally(() => {
        carga[0].style.display = "none";
        document.body.style.overflow = "auto";
    });
});