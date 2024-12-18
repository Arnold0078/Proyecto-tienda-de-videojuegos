const ALERTAS = {
    nicknameInsuficiente: "El nickname debe tener una longitud minima de 6",
    nicknameRepetido: "El nickname ya existe",
    fechaInvalida: "Por favor ingrese una fecha valida",
    correoInvalido: "Por favor ingrese un correo valido",
    correoRepetido: "Este correo ya existe",
    contraseñaInsuficiente: "La contraseña debe tener una longitud minima de 8",
    contraseñaCaracteres: "La contraseña debe tener al menos un caracter especial (@, $, & ...) y un numero"
};

const numeros = /\d/;
const caracteresEspeciales = /[^a-zA-Z0-9]/;
const pruebaCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const nickname = document.getElementById("nickname");
const fechaNacimiento = document.getElementById("fecha-nacimiento");
const correo = document.getElementById("correo");
const contraseña = document.getElementById("contraseña");
const mitades = document.getElementsByClassName("mitades");
const botonEnvio = document.getElementById("boton");

var verificarCampos = [false, false, false, false];

//buscar usuario y adaptar dependiendo el alto de la pantalla
document.addEventListener("DOMContentLoaded", () => {
    
    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Session/verificar_sesion.php")
    .then(response => response.json())
    .then(data => {
        if (data.usuario != null){
            self.location = "https://tienda-de-juegos.alwaysdata.net/";
        }else if(screen.height <= 720){
            mitades[0].classList.add("col");
            mitades[1].classList.add("col");
        }
    })
    .catch(error => console.error('Error:', error));
});

window.addEventListener('orientationchange', function() {
    if(screen.height <= 720){
        mitades[0].classList.add("col");
        mitades[1].classList.add("col");
    }
});

nickname.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
    }
})

//verificar nickname
nickname.addEventListener("change", ()=>{
    verificarCampos[0] = false; 
    eliminarAlerta(nickname);

    if (nickname.value.length <= 5)
        crearAlerta(nickname, ALERTAS.nicknameInsuficiente);
    else {
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Usuarios/buscar.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                funcion: "buscarNickname",
                datos: nickname.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.nickname != null) {
                crearAlerta(nickname, ALERTAS.nicknameRepetido);
            }else{
                verificarCampos[0] = true;
            }
            habilitarEnvio();
        })
        .catch(error => {
            console.error('Error:', error)
            habilitarEnvio();
        });
    }
})

//verificar correo
correo.addEventListener("keyup", ()=>{
    verificarCampos[1] = false; 
    eliminarAlerta(correo);

    if (pruebaCorreo.test(correo.value)) {
        fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Usuarios/buscar.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                funcion: "buscarCorreo",
                datos: correo.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.correo != null) {
                crearAlerta(correo, ALERTAS.correoRepetido);
            }else{
                verificarCampos[1] = true; 
            }
            habilitarEnvio();
        })
        .catch(error => {
            console.error('Error:', error)
            habilitarEnvio();
        });
    }else
        crearAlerta(correo, ALERTAS.correoInvalido);
    
    habilitarEnvio();
})

contraseña.addEventListener("keyup", ()=>{
    verificarCampos[2] = false;
    eliminarAlerta(contraseña);

    if(contraseña.value.length < 8)
        crearAlerta(contraseña, ALERTAS.contraseñaInsuficiente);
    else if(numeros.test(contraseña.value) === false || caracteresEspeciales.test(contraseña.value) === false)
        crearAlerta(contraseña, ALERTAS.contraseñaCaracteres);
    else
        verificarCampos[2] = true;

    habilitarEnvio();

})

fechaNacimiento.addEventListener("change", ()=>{
    verificarCampos[3] = false;
    eliminarAlerta(fechaNacimiento);

    if(fechaNacimiento.value == "")
        crearAlerta(fechaNacimiento, ALERTAS.fechaInvalida);
    else
        verificarCampos[3] = true;
    
    habilitarEnvio();
})

//crear y eliminar alertas
function eliminarAlerta(input) {
    const siguienteElemento = input.nextElementSibling;
    input.classList.add("mb-3");
    input.classList.remove("input-alerta");
    if(siguienteElemento != null)
        if(siguienteElemento.tagName === "P")
            siguienteElemento.remove();
     
}

function crearAlerta(input, mensaje){
    var alerta = document.createElement("p");
    alerta.textContent = mensaje;
    alerta.classList.add("mensaje-alerta");
    input.classList.add("input-alerta");
    input.classList.remove("mb-3");
    input.parentNode.insertBefore(alerta, input.nextElementSibling);
}

function habilitarEnvio() {
    if(verificarCampos.filter(T => T === true).length == 4)
        botonEnvio.disabled = false;
    else if (botonEnvio.disabled == false)
        botonEnvio.disabled = true;
}

botonEnvio.addEventListener("click", ()=>{

    const usuario = {
        nickname: nickname.value,
        correo: correo.value,
        contraseña: contraseña.value,
        fechaNacimiento: fechaNacimiento.value
    }

    fetch("https://tienda-de-juegos.alwaysdata.net/Backend/Base-de-datos/Usuarios/crear.php", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            datos: usuario
        })
    })
    .then(response => response.json())
    .then(data =>{
        if(data.mensaje != "Cuenta creada"){
            alert(data.mensaje);
        }else{
            alert(data.mensaje);
            self.location = "https://tienda-de-juegos.alwaysdata.net/";
        }
    })
})