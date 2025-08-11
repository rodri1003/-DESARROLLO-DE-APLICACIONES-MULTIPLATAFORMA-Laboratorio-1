/**
 * Clase Calculadora - Maneja la lógica y operaciones de una calculadora básica
 */

// Constantes para definir el número máximo de dígitos significativos a mostrar
const MAX_SIG_DIGITS = 10; // cantidad de dígitos significativos para mostrar

class Calculadora {
    /**
     * Constructor de la clase Calculadora
     * @param {HTMLElement} valorPrevioTextElement - Elemento HTML que muestra el valor previo
     * @param {HTMLElement} valorActualTextElement - Elemento HTML que muestra el valor actual
     */
    constructor(valorPrevioTextElement, valorActualTextElement) {
        // Almacena referencias a los elementos del DOM para mostrar los valores
        this.valorPrevioTextElement = valorPrevioTextElement
        this.valorActualTextElement = valorActualTextElement
        // Inicializa la calculadora limpiando todos los valores
        this.igualPresionado = false; // <--- NUEVA BANDERA Ejercicio 3
        this.borrarTodo()
        
    }

    /**
     * Limpia todos los valores de la calculadora, resetea a estado inicial
     */
    borrarTodo() {
        this.valorActual = ''      // Valor que se está ingresando actualmente
        this.valorPrevio = ''      // Valor que se usará para la operación
        this.operacion = undefined // Tipo de operación seleccionada (+, -, x, ÷)
        this.historial = '';       // display superior completo

    }

    /**
     * Elimina el último dígito del valor actual
     */
    borrar() {
        // Convierte a string y remueve el último carácter usando slice
        this.valorActual = this.valorActual.toString().slice(0, -1)
    }

    /**
     * Agrega un número (dígito) al valor actual que se está ingresando
     * @param {string} numero - El dígito o punto decimal a agregar
     */
    agregarNumero(numero) {
    if (this.igualPresionado) {
        this.valorActual = '';   // solo borramos el resultado
        this.operacion = undefined; // y la operación previa
        this.valorPrevio = '';
        this.igualPresionado = false;
        this.historial = '';

    }
    if (numero === '.' && this.valorActual.includes('.')) return;
    this.valorActual = this.valorActual.toString() + numero.toString();
}

    /**
     * Selecciona la operación matemática a realizar
     * @param {string} operacion - El símbolo de la operación (+, -, x, ÷)
     */

    // Elección de operación
  // Si venimos de "=", empezamos una nueva operación desde el resultado
  //Ejercicio 3: Agregar bandera igualPresionado 
  //Ejercicio 4: Mostrar operación completa en display superior
   elejirOperacion(operacion) {
  // Si venimos de "=", seguimos desde el resultado
  if (this.igualPresionado) {
    this.igualPresionado = false;
    // empezamos una nueva operación usando el resultado como base
    this.valorPrevio = this.valorActual !== '' ? this.valorActual : this.valorPrevio;
    this.valorActual = '';
  }

  // Nada que operar si no hay base ni número actual
  if (this.valorActual === '' && this.valorPrevio === '') return;

  if (this.operacion && this.valorActual === '' && this.valorPrevio !== '') {
    // Cambiar de operador antes de tipear B (ej: "12 +" → cambias a "12 x")
    this.operacion = operacion;
    this.historial = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`;
    return;
  }

  // Encadenadas: si ya hay A op B, resuelve y usa el resultado como nueva base
  if (this.operacion && this.valorActual !== '') {
    this.calcular();               // deja resultado en valorActual y marca igualPresionado
    this.igualPresionado = false;  // seguimos operando
    this.valorPrevio = this.valorActual.toString();
    this.valorActual = '';
  } else if (this.valorPrevio === '' && this.valorActual !== '') {
    // Primera vez: mueve A a previo
    this.valorPrevio = this.valorActual;
    this.valorActual = '';
  }

  this.operacion = operacion;
  this.historial = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`;
}


    //Sección para calcular el porcentaje ejercicio 2
    /**
     * Calcula el porcentaje del valor actual respecto al valor previo
     * Si no hay valor previo, simplemente convierte el valor actual a porcentaje
     */
        porcentaje() {
    if (this.valorActual === '') return;

    let x = parseFloat(this.valorActual);
    if (isNaN(x)) return;

    if (this.valorPrevio !== '' && this.operacion) {
        const base = parseFloat(this.valorPrevio);
        const xOriginal = x;                 // para mostrar "10%"
        x = base * (x / 100);                // X% de base
        this.valorActual = x.toString();
        this.historial = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(xOriginal)}%`;
    } else {
        x = x / 100;
        this.valorActual = x.toString();
        // opcional: podrías dejar vacío o indicar que fue porcentaje directo
        this.historial = ''; // o `${this.obtenerNumero(this.valorActual)}%`
    }
    this.igualPresionado = false;
    }


    /**
     * Realiza el cálculo matemático según la operación seleccionada
     */
            calcular() {
    const a = parseFloat(this.valorPrevio);
    const b = parseFloat(this.valorActual);
    if (isNaN(a) || isNaN(b) || !this.operacion) return;

    let resultado;
    switch (this.operacion) {
        case '+': resultado = a + b; break;
        case '-': resultado = a - b; break;
        case 'x': resultado = a * b; break;
        case '÷': resultado = b === 0 ? Infinity : a / b; break;
        default: return;
    }

    this.historial = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)} =`;

    if (!Number.isFinite(resultado)) {
        this.valorActual = 'Error';
    } else {
        this.valorActual = resultado;
    }

    this.operacion = undefined;
    this.valorPrevio = '';
    this.igualPresionado = true;
    }


    /**
     * Formatea un número para mostrarlo en pantalla con separadores de miles
     * @param {number} numero - El número a formatear
     * @returns {string} - El número formateado como string
     */
    obtenerNumero(numero) {
    // Mensaje de error explícito
    if (numero === 'Error') return 'Error';

    // Vacíos
    if (numero === '' || numero === null || numero === undefined) return '';

    // Manejo de NaN / Infinity
    const nTest = Number(numero);
    if (Number.isNaN(nTest)) return '';
    if (!Number.isFinite(nTest)) return 'Error';

    const cadena = numero.toString();

    // Dígitos "reales" (sin signo ni punto ni comas)
    const digitos = cadena.replace(/[^0-9]/g, '').length;

    // Reglas para notación científica (muy grande o muy pequeño)
    const absN = Math.abs(nTest);
    const tooBig = absN >= Math.pow(10, MAX_SIG_DIGITS);
    const tooSmall = absN > 0 && absN < Math.pow(10, -(MAX_SIG_DIGITS - 2));

    if (digitos > MAX_SIG_DIGITS || tooBig || tooSmall) {
        return nTest.toExponential(MAX_SIG_DIGITS); // ej: 1.2345678901e+14
    }

    // --- Formato normal con separadores ---
    const [intPart, decPart] = cadena.split('.');
    const enteros = parseFloat(intPart);
    const mostrarEnteros = isNaN(enteros)
        ? ''
        : enteros.toLocaleString('en', { maximumFractionDigits: 0 });

    if (decPart != null) {
        return `${mostrarEnteros}.${decPart}`;
    } else {
        return mostrarEnteros;
    }
    }

    /**
     * Actualiza la pantalla de la calculadora con los valores actuales
     */
    actualizarPantalla() {
  this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual);
  // siempre pinta el historial completo aquí
  this.valorPrevioTextElement.innerText = this.historial || '';
}

}

/*
 * SECCIÓN DE INICIALIZACIÓN Y CONFIGURACIÓN DEL DOM
 * Esta sección maneja la captura de elementos DOM y la configuración inicial
 */

// Captura de elementos de botones numéricos (0-9 y punto decimal)
const numeroButtons = document.querySelectorAll('[data-numero]')
// Captura de elementos de botones de operaciones (+, -, x, ÷)
const operacionButtons = document.querySelectorAll('[data-operacion]')
// Captura del botón igual (=) para ejecutar cálculos
const igualButton = document.querySelector('[data-igual]')
// Captura del botón de porcentaje (%) - funcionalidad pendiente
const porcentajeButton = document.querySelector('[data-porcentaje]')
// Captura del botón para borrar último dígito (backspace)
const borrarButton = document.querySelector('[data-borrar]')
// Captura del botón para limpiar toda la calculadora (clear)
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
// Captura del elemento que muestra el valor previo/operación en pantalla
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
// Captura del elemento que muestra el valor actual en pantalla
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instancia principal de la calculadora con referencias a los elementos de display
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

/*
 * CONFIGURACIÓN DE EVENT LISTENERS
 * Esta sección asigna eventos de click a cada tipo de botón
 */

// Asigna evento click a cada botón numérico
// Cuando se presiona un botón numérico, agrega ese número al valor actual y actualiza la pantalla
numeroButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.agregarNumero(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Asigna evento click a cada botón de operación
// Cuando se presiona una operación (+, -, x, ÷), selecciona esa operación y actualiza la pantalla
operacionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.elejirOperacion(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Evento para el botón igual (=)
// Ejecuta el cálculo de la operación pendiente y muestra el resultado
igualButton.addEventListener('click', _button => {
    calculator.calcular()
    calculator.actualizarPantalla()
})

// Evento para el botón de borrar todo (AC/Clear)
// Limpia completamente la calculadora y vuelve al estado inicial
borrarTodoButton.addEventListener('click', _button => {
    calculator.borrarTodo()
    calculator.actualizarPantalla()
})

// Evento para el botón de borrar (DEL/Backspace)
// Elimina el último dígito ingresado del valor actual
borrarButton.addEventListener('click', _button => {
    calculator.borrar()
    calculator.actualizarPantalla()
})

porcentajeButton.addEventListener('click', _button => {
    calculator.porcentaje()
    calculator.actualizarPantalla()
})

/*Laboratorio:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/