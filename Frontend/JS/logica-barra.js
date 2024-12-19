const logo = document.getElementById("logo");
const loginRegistrarse = document.getElementsByClassName("sin-usuario");
var activa = false;

//* activa y desactiva el scroll de la barra lateral acorde al alto de la pantalla
document.addEventListener("DOMContentLoaded", () => {

    if(window.innerHeight <= 637 && window.innerWidth <= 767){
        document.getElementById("barra-lateral").style.overflowY = "scroll";
    }else{
        document.getElementById("barra-lateral").style.overflowY = "hidden";
        document.getElementById("barra-lateral").style.overflowX = "hidden";
    }
});

//* Intercala entre barras dependiendo el tamaño de la pantalla
window.addEventListener('resize', () => {
    if (window.innerWidth <= 991) 
        logo.style.background = "rgb(0, 3, 44)";
    else if(window.scrollY === 0)
        logo.style.background = "none";
    
    if(window.innerWidth >= 767){
        document.body.style.overflow = "auto";
        document.getElementById("barra-lateral").style.left = "100%"
    }

    if(window.innerHeight <= 637 && window.innerWidth <= 767){
        document.getElementById("barra-lateral").style.overflowY = "scroll";
    }else{
        document.getElementById("barra-lateral").style.overflowY = "hidden";
    }
});

//* Rellena la barra grande
window.onscroll = function() {
    if(window.scrollY != 0 && window.innerWidth > 991)
        logo.style.background = "rgb(0, 3, 44)";
    else if(window.innerWidth > 991)
        logo.style.background = "none";
    
};

//* Genera el miniPerfil
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

function cerrarSesion() {
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/cerrar_sesion.php");
    location.reload(true);
}

//* REDIRECCIONES
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

document.getElementById("btn-libreria-movil").addEventListener("click", ()=>{
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-comunidad-movil").addEventListener("click", ()=>{
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "";
});

document.getElementById("btn-carrito-movil").addEventListener("click", ()=>{
    console.log(activa);
    
    if(!activa)
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Login/login.html";
    else
        window.location.href = "https://tienda-de-juegos.alwaysdata.net/Frontend/Usuarios/Carrito/carrito.html";
});

//* oculta o muestra la barra lateral
document.getElementById("mostrar-barra-principal").addEventListener("click", ()=>{
    document.body.style.overflow = "hidden";
    document.getElementById("barra-lateral").style.left = "0%"
})

document.getElementById("cerrar-barra").addEventListener("click", ()=>{
    document.body.style.overflow = "auto";
    document.getElementById("barra-lateral").style.left = "100%"
})