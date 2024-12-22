const generoJuego = document.getElementById('generoJuego');

var juego = null;
var listaCategorias = [];

///Pantalla de carga
const carga = document.getElementsByClassName("loader");
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";
    var isErrorOccurred = false;

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
                    });
                }
            }),
        /*
        //verifica si el usuario tiene permisos de admin
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_acceso.php")
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 403) {
                    throw new Error("Acceso denegado.");
                }
            })
            .then(data => {
                usuario(data.usuario);
                activa = true;
            })*/
    ])
    .catch(error => {
        isErrorOccurred = true;
        console.error('Error:', error);
    })
    .finally(() => {
        if (!isErrorOccurred) {
            carga[0].style.display = "none";
            document.body.style.overflow = "auto";
        } else {
            window.location.href = "https://tienda-de-juegos.alwaysdata.net/";
        }
    });
});

// Función para manejar el envío del formulario

document.getElementById("boton").addEventListener('click', async function (e) {
    e.preventDefault();  // Prevenir el comportamiento por defecto del formulario
    const datos = await verificarDatos();
    console.log(datos);
    

    if (datos != null) {
        // Guarda los datos del juego
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Juegos/guardar.php",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                datos: datos
            })
        })
        .then(response => {
            if (response === 200) {
                return response.json();
            }else if (response === 400) {
                throw new Error("Faltaron datos por enviar");
            }else if(response === 409){
                throw new Error("El juego a guardar ya existe");
            }else if(response === 500){
                throw new Error("Error de conexion por favor intentelo mas tarde");
            }else{
                throw new Error("Ocurrio un error inesperado");
            }
        })
        .then(data => {
            alert(data.mensaje);
        })
        .catch(error => alert('Error:', error));
    }

});

//* VERIFICA LOS DATOS INGRESADOS
async function verificarDatos(){
    // Recoger los datos del formulario
    const nombreJuego = document.getElementById('nombreJuego').value;
    const descripcionJuego = document.getElementById('descripcionJuego').value;
    const precioJuego = document.getElementById('precioJuego').value;
    const imagenJuego = document.getElementById('imagenJuego').files[0];
    const categorias = listaCategorias.filter(categoria => categoria.id_categoria == generoJuego.value);

    if (nombreJuego == "" || descripcionJuego == "" || precioJuego == "" || generoJuego.value == "") {
        alert("Por favor rellene todos los datos");
        return null;
    }

    if(imagenJuego){
    try {
            // Espera a que la imagen sea convertida a WebP
            const imagen = await conversionWebp(imagenJuego);

            const formData = {
                nombre: nombreJuego,
                descripcion: descripcionJuego,
                precio: precioJuego,
                categorias: categorias,
                imagen: imagen
            };

            console.log(formData);
            return formData; // Aquí se retorna el objeto con los datos completos

        } catch (error) {
            console.error(error);
            return null; // En caso de error en la conversión de imagen
        }
    }else{
        alert("Por favor ingrese una imagen");
        return null;
    }
}

//* CONVIERTE LA IMAGEN EN WEBP PARA MAYOR RENDIMIENTO
function conversionWebp(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();

        reader.onload = function(event) {
            img.src = event.target.result; // Cargar la imagen
        };

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convertir la imagen a WebP
            const webpImage = canvas.toDataURL('image/webp', 0.8);
            resolve(webpImage); // Retorna la imagen WebP como URL de datos
        };

        img.onerror = function() {
            reject(new Error('Error al cargar la imagen.'));
        };

        reader.readAsDataURL(file); // Leer la imagen
    });
}