const logo = document.getElementById("logo");
const loginRegistrarse = document.getElementsByClassName("sin-usuario");
const carga = document.getElementsByClassName("loader");
const precioMin = document.getElementById("precio-minimo");
const precioMax = document.getElementById("precio-maximo");
var activa = false;



if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Desactiva la restauración automática del scroll
}

document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    carga[0].style.display = "flex";
    document.body.style.overflow = "hidden";

    if(window.innerHeight <= 637 && window.innerWidth <= 767){
        document.getElementById("barra-lateral").style.overflowY = "scroll";
        document.getElementById("filtros-busqueda").style.overflowY = "scroll";
    }else{
        document.getElementById("barra-lateral").style.overflowY = "hidden";
        document.getElementById("filtros-busqueda").style.overflowY = "hidden";
        document.getElementById("barra-lateral").style.overflowX = "hidden";
        document.getElementById("filtros-busqueda").style.overflowX = "hidden";
    }

    Promise.all([
        //busca los juegos mas nuevos
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Juegos/recientes.php", {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje != "Juegos no encontrados") {
                juegos("nuevos-juegos", data.juegosRecientes);
            }
        }),

        //busca los juegos gratuitos
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Juegos/gratuitos.php", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                datos: 0
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje != "Juegos no encontrados") {
                    
                juegos("juegos-gratis", data.juegosGratis);
            }
        }),

        //busca todas las categorias
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Categorias/buscar.php", {
            method: "POST",
        })
        .then(response => response.json())
        .then(data => {
            if (data.categorias != undefined) {
                categorias(data.categorias);
            }
        }),

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
    if (window.innerWidth <= 991) 
        logo.style.background = "rgb(0, 3, 44)";
    else if(window.scrollY === 0)
        logo.style.background = "none";
    
    if(window.innerWidth >= 767){
        document.body.style.overflow = "auto";
        document.getElementById("filtros-busqueda").style.right = "100%";
        document.getElementById("barra-lateral").style.left = "100%"
    }

    if(window.innerHeight <= 637 && window.innerWidth <= 767){
        document.getElementById("barra-lateral").style.overflowY = "scroll";
        document.getElementById("filtros-busqueda").style.overflowY = "scroll";
    }else{
        document.getElementById("barra-lateral").style.overflowY = "hidden";
        document.getElementById("filtros-busqueda").style.overflowY = "hidden";
    }
});

window.onscroll = function() {
    if(window.scrollY != 0 && window.innerWidth > 991)
        logo.style.background = "rgb(0, 3, 44)";
    else if(window.innerWidth > 991)
        logo.style.background = "none";
    
};

//* añade las categorias
function categorias(data){
    data.forEach((categoria, index) => {
        const contenedor = document.getElementById("filtrar-categorias");
        var label = document.createElement("label");
        var checkbox = document.createElement("input");

        //añadiendo clases
        checkbox.classList.add("me-2");
        checkbox.classList.add("categorias");

        //añadiendo atributos
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', categoria.nombre);
        label.setAttribute('for', categoria.nombre);

        label.textContent = categoria.nombre;

        contenedor.appendChild(checkbox);
        contenedor.appendChild(label);

        if(index !== data.length - 1){
            var br = document.createElement("br");
            contenedor.appendChild(br);
        }
    });
}

//* genera el miniPerfil
function usuario(data){
    activa = true;
    const barra = document.getElementsByClassName("barra");
    const barraLateral = document.getElementById("barra-lateral");

    while(loginRegistrarse.length != 0){
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
    botonMirarPerfil.addEventListener("click", ()=>{
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/";
    });
    botonEditarPerfil.addEventListener("click", ()=>{
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/";
    });

    //* verifica si es un admin para colocarle sus respectivas herramientas
    if(data.rol != "cliente"){
        const botonAdministrar = document.createElement("button");
        botonAdministrar.classList.add("w-100", "btn", "text-white");
        botonAdministrar.textContent = "administracion"
        botonAdministrar.addEventListener("click", ()=>{
            window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Administracion/principal.html";
        });
        opcionesBody.appendChild(botonAdministrar);
    }

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

//* añadir juegos
function juegos(contenedor, arreglo) {
    const contenedorPrincipal = document.getElementById(contenedor).getElementsByClassName("carousel-inner")[0];
    const contenedorMovil = document.getElementById(contenedor+"-movil").getElementsByClassName("carousel-inner")[0];

    var cards = 0;

    var item = itemPrincipal(true); ;
    var cardGroup = cardGroupPrincipal();
    var itemMovil;

    arreglo.forEach((juego, index) => {
        if (itemMovil == undefined) {
            itemMovil = itemPrincipal(true);   
        }else{
            itemMovil = itemPrincipal(false);
        }
        

        if (cards === 3) {
            item.appendChild(cardGroup);
            contenedorPrincipal.appendChild(item);
            item = itemPrincipal();
            cardGroup = cardGroupPrincipal();
        }else if(index === arreglo.length - 1){
            cardGroup.appendChild(cardPrincipal(juego));
            item.appendChild(cardGroup);
            contenedorPrincipal.appendChild(item);
        }else{
            cards ++;
            cardGroup.appendChild(cardPrincipal(juego));
        }

        itemMovil.appendChild(cardPrincipal(juego));
        contenedorMovil.appendChild(itemMovil);
    });
}

//* items de carrousel
function itemPrincipal(verificador){
    var item = document.createElement("div");
    item.classList.add("carousel-item");

    if(verificador){
        item.classList.add("active");
    }

    return item;
}

//* cards 
function cardPrincipal(juego){
    var card = document.createElement("div");
    var img = document.createElement("img");
    var div = document.createElement("div");
    var nombre = document.createElement("h5");
    var precio = document.createElement("p");
    var small = document.createElement("small");

    //clases
    card.classList.add("card", "m-1", "rounded", "border", "bg-dark", "text-white");
    img.classList.add("card-img-top", "p-1", "pb-0");
    div.classList.add("card-body");
    nombre.classList.add("card-title");
    precio.classList.add("card-text");

    //contenido
    const imgURL = juego.imagen.replace(/^dataimage\/([a-zA-Z]+)base64\//, 'data:image/$1;base64,/');
    img.src = imgURL;
    nombre.textContent = juego.nombre;
    small.textContent = "precio $" + juego.precio;

    //evento
    card.addEventListener("click", ()=>{
        window.location.href = `/detalle-producto.html?id=${juego.id_juego}`;
    });

    //organizar
    precio.appendChild(small);
    div.appendChild(nombre);
    div.appendChild(precio);
    card.appendChild(img);
    card.appendChild(div);

    return card;
}

//* cardsgroups
function cardGroupPrincipal(){
    var cardGroup = document.createElement("div");
    cardGroup.classList.add("card-group");
    return cardGroup;
}

precioMax.addEventListener("change", alertaPrecios);
precioMin.addEventListener("change", alertaPrecios);

function alertaPrecios(){
    if (precioMax.value <= precioMin.value && precioMax.value != "") {
        document.getElementById("alerta-precio").style.display = "block";
        document.getElementById("buscar-filtros").disabled = true;
    }else if(precioMax.value === "" || precioMax.value > precioMin.value){
        document.getElementById("alerta-precio").style.display = "none";
        document.getElementById("buscar-filtros").disabled = false;
    }
}

document.getElementById("buscar-filtros").addEventListener("click", ()=>{
    const categorias = document.getElementsByClassName("categorias");
    const orden = document.getElementById("switch-orden").checked;
    const categoriasSeleccionadas =  Array.from(categorias)
    .filter(categoria => categoria.checked)
    .map(categoria => categoria.id);

    const filtros = {
        offset: 0,
        categorias: JSON.stringify(categoriasSeleccionadas),
        precioMinimo: (precioMin.value != "") ? precioMin.value : undefined,
        precioMaximo: (precioMax.value != "") ? precioMax.value : undefined,
        orden: orden
    }

    const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([key, value]) => value !== undefined)
    );

    const query = new URLSearchParams(filtrosLimpios).toString();
    window.location.href = `https://tienda-de-juegos.alwaysdata.net/?${query}`;
});

function cerrarSesion() {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/cerrar_sesion.php");
    location.reload(true);
}

document.getElementById("btn-libreria").addEventListener("click", ()=>{
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-comunidad").addEventListener("click", ()=>{
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-carrito").addEventListener("click", ()=>{
    console.log(activa);
    
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Carrito/carrito.html";
});

//*¨ocultar o mostrar filtros y busqueda
document.getElementById("mostrar-filtros").addEventListener("click", ()=>{
    document.body.style.overflow = "hidden";
    document.getElementById("filtros-busqueda").style.right = "0%";
});

document.getElementById("mostrar-filtros-movil").addEventListener("click", ()=>{
    document.body.style.overflow = "hidden";
    document.getElementById("filtros-busqueda").style.right = "0%";
});

document.getElementById("ocultar-filtros").addEventListener("click", ()=>{
    document.body.style.overflow = "auto";
    document.getElementById("filtros-busqueda").style.right = "100%";
});

//ocultar o mostrar barra lateral principal
document.getElementById("mostrar-barra-principal").addEventListener("click", ()=>{
    document.body.style.overflow = "hidden";
    document.getElementById("barra-lateral").style.left = "0%"
})

document.getElementById("cerrar-barra").addEventListener("click", ()=>{
    document.body.style.overflow = "auto";
    document.getElementById("barra-lateral").style.left = "100%"
})