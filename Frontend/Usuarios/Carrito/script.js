const ALERTAS = {
    numeroTarjetaInvalido: "El numero de la tarjeta no es valido",
    CVV_CVC_Invalido: "El CVV o CVC es invalido",
    fechaInvalida: "Por favor ingrese una fecha valida",
    fechaInvalidaTiempo: "La fecha es mas antigua que la fecha actual",
    nombreVacio: "Por favor ingrese el nombre",
};

const loginRegistrarse = document.getElementsByClassName("sin-usuario");
const fondo = document.getElementsByClassName("fondo")[0];
const formulario = document.getElementById("formulario");
const alertajuegos = document.getElementById("alerta-sin-juegos");
const contenedorJuegos = document.getElementById("contenedor-juegos-seleccionados");
const listaJuegos = document.getElementById("juegos");
const seccionCompra = document.getElementById("seccion-compra");
const carga = document.getElementsByClassName("loader");
const contenedorTarjeta = document.getElementById("contenedor-input");
const numeroTarjeta = document.getElementById("numero-tarjeta");
const fecha = document.getElementById("fecha");
const codigo = document.getElementById("codigo");
const nombre = document.getElementById("nombre");
const botonPago = document.getElementById("pagar");

var longitudfecha;
var verificar = [false, false, false, false];
var usuarioActual;
var juegosCarrito = [];
var precioTotal = 0;


if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

//Muestra la pantalla de carga y deja el scroll en el punto inicial
document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    botonPago.disabled = true;
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    if (window.innerHeight <= 637 && window.innerWidth <= 767) {
        document.getElementById("barra-lateral").style.overflowY = "scroll";
    } else {
        document.getElementById("barra-lateral").style.overflowY = "hidden";
        document.getElementById("barra-lateral").style.overflowX = "hidden";
    }

    Promise.all([
        
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
        .then(response => response.json())
        .then(data => {
            if (data.usuario == null){
                self.location = "https://tienda-de-juegos.alwaysdata.net/";
            }else{
                usuarioActual = data.usuario;
                usuario(data.usuario);
            }
        }),
        
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Carrito/obtener_juegos_carrito.php")
            .then(response => response.json())
            .then(data => {
                if (data.carrito != null) {
                    alertajuegos.style.display = "none";
                    contenedorJuegos.style.display = "block";
                    mostrarJuegos(data.carrito);
                } else {
                    contenedorJuegos.style.display = "none";
                    fondo.style.height = "44em";
                    document.getElementById("seccion-juegos").style.borderRight = "none";
                    alertajuegos.style.display = "block";
                    seccionCompra.style.display = "none";
                }
            })
    ])
        .catch(error => console.error('Error:', error))
        .finally(() => {
            carga[0].style.display = "none";
            document.body.style.overflow = "auto";
        });

});

//hace cambios acorde a la altura y anchura del dispositivo
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

//le cambia los estilos a la barra grande de navegador
window.onscroll = function () {
    if (window.scrollY != 0 && window.innerWidth > 991)
        logo.style.background = "rgb(0, 3, 44)";
    else if (window.innerWidth > 991)
        logo.style.background = "none";

};

//genera el miniPerfil
function usuario(data) {
    const barra = document.getElementsByClassName("barra");
    const barraLateral = document.getElementById("barra-lateral");

    while (loginRegistrarse.length != 0) {
        loginRegistrarse[0].remove();
    }

    const perfil = document.createElement("div");
    const perfilitem = document.createElement("div");
    const perfilHeader = document.createElement("div");
    const botonPerfil = document.createElement("button");
    const foto = document.createElement("img");
    const nickname = document.createElement("p");
    const opciones = document.createElement("div");
    const opcionesBody = document.createElement("div");
    const botonMirarPerfil = document.createElement("button");
    const botonEditarPerfil = document.createElement("button");
    const botonCerrarSesion = document.createElement("button");

    //id
    opciones.id = "opciones-perfil";
    perfil.id = "accordion-perfil";

    //class
    perfil.classList.add("accordion", "cabesera-mini-perfil");
    perfilitem.classList.add("accordion-item", "mini-perfil");
    perfilHeader.classList.add("accordion-header", "perfilHeader");
    botonPerfil.classList.add("accordion-button", "btn", "d-flex", "justify-content-end", "align-items-center", "text-white");
    opciones.classList.add("accordion-collapse", "collapse");
    opcionesBody.classList.add("accordion-body");
    botonMirarPerfil.classList.add("w-100", "btn", "text-white");
    botonEditarPerfil.classList.add("w-100", "btn", "text-white");
    botonCerrarSesion.classList.add("w-100", "btn", "text-white");
    foto.classList.add("me-2", "foto-perfil-mini", "rounded-circle");
    nickname.classList.add("m-0");

    //attribute
    botonPerfil.setAttribute('type', 'button');
    botonPerfil.setAttribute('data-bs-toggle', 'collapse');
    botonPerfil.setAttribute('data-bs-target', '#opciones-perfil');
    botonPerfil.setAttribute('aria-expanded', 'false');
    botonPerfil.setAttribute('aria-controls', 'opciones-perfil');
    opciones.setAttribute('data-bs-parent', '#accordion-perfil');
    foto.setAttribute('src', 'https://tienda-de-juegos.alwaysdata.net/Frontend/Imagenes/default.webp');

    //Añadir textos
    nickname.textContent = data.nickname;
    botonMirarPerfil.textContent = "Perfil";
    botonEditarPerfil.textContent = "Editar perfil";
    botonCerrarSesion.textContent = "cerrar Sesión";

    //añadir eventos
    botonCerrarSesion.addEventListener("click", cerrarSesion);
    botonMirarPerfil.addEventListener("click", () => {
        window.location.href = "https://example.com/perfil";
    });
    botonEditarPerfil.addEventListener("click", () => {
        window.location.href = "https://example.com/perfil";
    });

    //ensamblaje
    botonPerfil.appendChild(foto);
    botonPerfil.appendChild(nickname);
    opcionesBody.appendChild(botonMirarPerfil);
    opcionesBody.appendChild(botonEditarPerfil);
    opcionesBody.appendChild(botonCerrarSesion);
    perfilHeader.appendChild(botonPerfil);
    opciones.appendChild(opcionesBody);
    perfilitem.appendChild(opciones);
    perfil.appendChild(perfilHeader);
    perfil.appendChild(perfilitem);
    barra[0].appendChild(perfil);
    barraLateral.appendChild(perfil.cloneNode(true));
}

//Muestra los juegos a comprar
function mostrarJuegos(data) {

    const li = document.createElement("li");
    const divDetalles = document.createElement("div");
    const nombre = document.createElement("h3");
    const precio = document.createElement("p");
    const botonBorrar = document.createElement("button");

    data.forEach(juego => {
        //asignacion de id
        li.id = juego.id;

        //asignacion de clases
        li.classList.add("list-group-item", "d-flex", "justify-content-center",
            "align-items-center", "juego", "text-white");
        divDetalles.classList.add("me-5", "text-start", "w-100");
        botonBorrar.classList.add("btn");

        //Asignacion de contenido
        nombre.textContent = juego.nombre;
        precio.textContent = "precio: $" + juego.precio;
        botonBorrar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" color="white"
                fill="currentColor" class="bi bi-bag-x-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M6.854 8.146a.5.5 0 1 0-.708.708L7.293 10l-1.147 1.146a.5.5 0 0 0 .708.708L8 10.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 10l1.147-1.146a.5.5 0 0 0-.708-.708L8 9.293z" />
            </svg>`;

        //asignacion de evento
        botonBorrar.addEventListener("click", () => eliminarJuego(juego.id, juego.precio));

        //Organizacion
        divDetalles.appendChild(nombre);
        divDetalles.appendChild(precio);

        li.appendChild(divDetalles);
        li.appendChild(botonBorrar);

        listaJuegos.appendChild(li);

        //se añade el precio del juego al precio total
        precioTotal = juego.precio
    });

    juegosCarrito = data;
}

function eliminarJuego(id, precio) {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Carrito/eliminar_juego_carrito.php", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje == "Juego eliminado del carrito") {
                juegosCarrito.splice(juegosCarrito.indexOf(id));
                precioTotal -= precio;
            } else {
                alert("Error al eliminar el juego del carrito, Intentelo mas tarde");
            }
        })
        .catch(error => console.error('Error:', error))
}

//Solo acepta caracteres numericos del numero de la tarjeta
numeroTarjeta.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

//verifica si el numero de la tarjeta ingresada es valida
numeroTarjeta.addEventListener("change", () => {
    eliminarAlerta(contenedorTarjeta);
    var numero = numeroTarjeta.value.trim();
    numero = numero.replace(/\s/g, '');

    if (numero.length === 13 || numero.length === 15 || numero.length === 16) {
        var arreglo = [...String(numero)].map(Number).reverse();
        var suma = 0;

        arreglo.forEach((numero, index) => {
            if (index % 2 !== 0) {
                var nuevo = numero * 2;
                nuevo = (nuevo > 9) ? (nuevo - 9) : nuevo;
                suma += nuevo;
            } else {
                suma += numero;
            }
        });

        // Si la suma total no es divisible por 10, el número no es válido
        if (suma % 10 !== 0) {
            crearAlerta(contenedorTarjeta, ALERTAS.numeroTarjetaInvalido);
            verificar[0] = false;
        } else {
            verificar[0] = true;
        }

    } else {
        // Si la longitud no es 13, 15 o 16, la tarjeta no es válida
        crearAlerta(contenedorTarjeta, ALERTAS.numeroTarjetaInvalido);
        verificar[0] = false;
    }
    habilitarBoton();
});

//Evita que se coloquen caracteres diferentes a la fecha
fecha.addEventListener("input", (e) => {
    const valor = e.target.value;
    if (valor.length < 3 && valor.length != 0 && longitudfecha != 4) {
        e.target.value = valor.slice(0, valor.length).replace(/[^0-9]/g, '');
        longitudfecha = valor.length;
    } else if (valor.length > 3) {
        console.log(valor.length);
        e.target.value = valor.slice(0, 2).replace(/[^0-9]/g, '') + "/" + valor.slice(2, valor.length).replace(/[^0-9]/g, '');
        longitudfecha = valor.length;
    }

    if (valor.length == 2) {
        if (longitudfecha > 2) {
            console.log("entro");
            e.target.value = valor.slice(0, 1);
            longitudfecha = 1
        } else {
            e.target.value = valor + "/";
            longitudfecha = 3
        }
    }

});

//Verifica si la fecha es valida
fecha.addEventListener("change", () => {
    eliminarAlerta(fecha);
    if (fecha.value.length === 5) {
        const [mes, año] = fecha.value.split('/').map(Number);
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth() + 1; // Enero es 0
        const añoActual = fechaActual.getFullYear() % 100;

        if (mes < 1 || mes > 12) {
            crearAlerta(fecha, ALERTAS.fechaInvalida);
            verificar[1] = false;
            habilitarBoton();
            return;
        }

        if (año < añoActual || (año === añoActual && mes < mesActual)) {
            crearAlerta(fecha, ALERTAS.fechaInvalidaTiempo);
            verificar[1] = false;
        } else {
            verificar[1] = true;
        }

    } else {
        crearAlerta(fecha, ALERTAS.fechaInvalida);
        verificar[1] = false;
    }
    habilitarBoton();
})

//Limita el numero de numeros en el codigo
codigo.addEventListener("input", (e) => {
    if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 4);
    }
});

//verifica si el codigo tiene la longitud necesaria
codigo.addEventListener("change", () => {
    eliminarAlerta(codigo);
    if (codigo.value.length < 3) {
        crearAlerta(codigo, ALERTAS.CVV_CVC_Invalido);
        verificar[2] = false;
    } else {
        verificar[2] = true;
    }
    habilitarBoton();
});

//Solo permite letras normales y las vocales asentuadas
nombre.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜ]/g, '');
});

//verifica si el nombre no esta vacio
nombre.addEventListener("change", () => {
    eliminarAlerta(nombre);
    if (nombre.value.length === 0) {
        crearAlerta(nombre, ALERTAS.nombreVacio);
        verificar[3] = false;
    } else {
        verificar[3] = true;
    }
    habilitarBoton();
});

//crear y eliminar alertas
function eliminarAlerta(input) {
    const siguienteElemento = input.nextElementSibling;
    input.classList.add("mb-3");
    input.classList.remove("input-alerta");
    if (siguienteElemento != null)
        if (siguienteElemento.tagName === "P")
            siguienteElemento.remove();

}

function crearAlerta(input, mensaje) {
    var alerta = document.createElement("p");
    alerta.textContent = mensaje;
    alerta.classList.add("mensaje-alerta");
    input.classList.add("input-alerta");
    input.classList.remove("mb-3");
    input.parentNode.insertBefore(alerta, input.nextElementSibling);
}

//habilita o desabilita el boton de compra si los espacios requeridos estan validos
function habilitarBoton() {
    if (verificar.filter(valor => valor != false).length == 4) botonPago.disabled = false;
    else botonPago.disabled = true;
}

//genera la factura de compra y la manda a guardar
botonPago.addEventListener("click", () => {
    const tarjeta = {
        numeroTarjeta: numeroTarjeta.value,
        codigo: codigo.value,
        fechaTarjeta: fecha.value,
        nombrePropietario: nombre.value
    }

    const factura = {
        usuarioId: usuarioActual.id_usuario,
        total: precioTotal,
        juegosComprados: juegosCarrito,
        tarjeta: tarjeta
    }

    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Facturas/nueva_factura.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            factura: factura
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.facturaRecibida != null) {
                generarPDF(data.facturaRecibida, factura);
                vaciarCarrito();
            } else {
                alert("Error al realizar el pago, Por favor intentelo mas tarde");
            }
        })
        .catch(error => console.error('Error:', error))

})

function generarPDF(factura, factura2) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [6, 6]
    })
    
    var informacion = "                       " + factura.nombre_empresa
        + "\n                            nit: " + factura.nit + "\n\n"
        + "\n                            Factura N° " + factura.id_factura
        + "\n                            Fecha " + factura.fecha 
        + "\n\nDETALLES DE PAGO\n"
        + "\nNumero de tarjeta: " + factura.numero_tarjeta
        + "\nfecha de tarjeta: " + factura.fecha_tarjeta + "\ncodigo de tarjeta: "
        + factura.codigo_tarjeta + "\npropietario de la tarjeta: " + factura.propietario_tarjeta
        + "\nJuegos comprados: " + factura2.juegosComprados + "\nTotal: " + factura2.total;
    
    doc.text(informacion, 1, 1)
    doc.save("Factura.pdf");
}

function vaciarCarrito() {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Carrito/vaciar_carrito.php")
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
}

//cierra la sesion del usuario y se devuelve al menu principal
function cerrarSesion() {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/cerrar_sesion.php");
    location.reload(true);
}

document.getElementById("btn-libreria").addEventListener("click", () => {
    window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/";
});

document.getElementById("btn-comunidad").addEventListener("click", () => {
    window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/";
});

document.getElementById("btn-carrito").addEventListener("click", () => {
    window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Carrito/carrito.html";
});

//botones para mostrar o ocultar la barra lateral
document.getElementById("mostrar-barra-principal").addEventListener("click", () => {
    document.body.style.overflow = "hidden";
    document.getElementById("barra-lateral").style.left = "0%"
})

document.getElementById("cerrar-barra").addEventListener("click", () => {
    document.body.style.overflow = "auto";
    document.getElementById("barra-lateral").style.left = "100%"
})