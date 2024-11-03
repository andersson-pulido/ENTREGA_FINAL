const MAX_INTENTOS = 6;
const TIEMPO_MAXIMO = 300;
let palabraSecreta = "";
let intentosRestantes = MAX_INTENTOS;
let letrasIncorrectas = [];
let letrasCorrectas = [];
let tiempoRestante = TIEMPO_MAXIMO;
let intervaloTiempo;


const letrasAdivinadasDiv = document.getElementById("letras-adivinadas");
const letrasIncorrectasDiv = document.getElementById("letras-incorrectas");
const intentosDiv = document.getElementById("intentos");
const resultadoDiv = document.getElementById("resultado");
const letraInput = document.getElementById("letra-input");
const iniciarJuegoButton = document.getElementById("iniciar-juego");
const hacerIntentoButton = document.getElementById("hacer-intento");
const tiempoDiv = document.getElementById("tiempo");


iniciarJuegoButton.addEventListener("click", iniciarJuego);
hacerIntentoButton.addEventListener("click", hacerIntento);


function iniciarJuego() {
    const inputPalabraSecreta = document.getElementById("palabra-secreta").value.toLowerCase().trim();

    if (!inputPalabraSecreta) {
        alert("Por favor, ingresa una palabra para comenzar el juego.");
        return;
    }

    palabraSecreta = inputPalabraSecreta;
    letrasCorrectas = Array(palabraSecreta.length).fill("_");
    intentosRestantes = MAX_INTENTOS;
    letrasIncorrectas = [];
    tiempoRestante = TIEMPO_MAXIMO;

    document.getElementById("seccion-juego").classList.remove("oculto");
    document.getElementById("ingreso-palabra").classList.add("oculto");
    actualizarVista();
    iniciarTemporizador();
}


function iniciarTemporizador() {
    intervaloTiempo = setInterval(() => {
        tiempoRestante--;
        actualizarTiempo();

        if (tiempoRestante <= 0) {
            clearInterval(intervaloTiempo);
            resultadoDiv.textContent = `Se acabó el tiempo. La palabra era "${palabraSecreta}".`;
            resultadoDiv.className = "perdiste";
            desactivarJuego();
        }
    }, 1000);
}


function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    tiempoDiv.textContent = `Tiempo: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}


function hacerIntento() {
    const letra = letraInput.value.toLowerCase().trim();

    if (!validarEntrada(letra)) return;

    if (palabraSecreta.includes(letra)) {
        actualizarLetrasCorrectas(letra);
    } else {
        agregarLetraIncorrecta(letra);
    }

    verificarEstadoDelJuego();
    letraInput.value = "";
}


function validarEntrada(letra) {
    if (!letra.match(/[a-zñ]/i) || letra.length !== 1) {
        alert("Por favor, ingresa una letra válida.");
        return false;
    }

    if (letrasCorrectas.includes(letra) || letrasIncorrectas.includes(letra)) {
        alert("Ya intentaste esa letra.");
        return false;
    }

    return true;
}


function actualizarLetrasCorrectas(letra) {
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
            letrasCorrectas[i] = letra;
        }
    }
}


function agregarLetraIncorrecta(letra) {
    letrasIncorrectas.push(letra);
    intentosRestantes--;
}


function verificarEstadoDelJuego() {
    actualizarVista();

    if (letrasCorrectas.join("") === palabraSecreta) {
        resultadoDiv.textContent = "¡Felicidades, ganaste!";
        resultadoDiv.className = "ganaste";
        clearInterval(intervaloTiempo);
        desactivarJuego();
    } else if (intentosRestantes === 0) {
        resultadoDiv.textContent = `Perdiste. La palabra era "${palabraSecreta}".`;
        resultadoDiv.className = "perdiste";
        clearInterval(intervaloTiempo);
        desactivarJuego();
    }
}


function desactivarJuego() {
    letraInput.disabled = true;
    hacerIntentoButton.disabled = true;
}


function actualizarVista() {
    letrasAdivinadasDiv.textContent = letrasCorrectas.join(" ");
    letrasIncorrectasDiv.textContent = letrasIncorrectas.join(", ");
    intentosDiv.textContent = intentosRestantes;
    actualizarTiempo();
}
