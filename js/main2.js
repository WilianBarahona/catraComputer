/*
------------Proyecto CatraComputer---------------
*/

//------------VARIABLES GOLBALES----------------
//Expresion regular para validacion de instrucciones
var regex = /^(\+|\-)(00|10|11|20|21|30|31|32|33|40|41|42|43)([0-9][0-9][0-9])$/gm;

//Expresion regular para obtener todas las direcciones de memoria utilizadas en el programa
var regexMemory = /^(\+|\-)((00|10|11|20|21|30|31|32|33|40|41|42|43))/gm;

//Variables globales de salida de la funcion validarInstrucciones
var max = 0
var errores = Array(); //Arreglo de instrucciones erroneas
var instrucciones = Array(); // Arreglo con las instrucciones ya validas

var ubicaciones = Array(); // copia de todas las instrucciones para matipulacion de datos 

var getInstruccion = Array(); // copia de todas las instrucciones para matipulacion de datos  

var contenidoMemoria = Array(); //Guarda el contenido de la memoria

//Variables globales de control de programa
var pc = 0;

var irArray= Array();
irArray.push("+00000") //Inicializar ir con 0
var ir = 0

var ac = 0;

var stop = 0
//Leer Archivo 
$("#fInstrucciones").change(function (e){
    limpiarTodo();
    var archivo = e.target.files[0]; // Guardad archivo subido en esta variable
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        validarInstrucicones(contenido);
    };
    lector.readAsText(archivo);
    $("#fInstrucciones").val('');
    $("#btn-ejecutar").attr("disabled", false)
})

// Validar Instrucciones
function validarInstrucicones(contenido) {
    var instruccionesSinValidar= contenido.split('\n');
    for (var instruccion of instruccionesSinValidar){  // For Each para recorrer todas las instrucciones del archivo
        if (instruccion != ''){ // Omitir lineas vacias o nullas
            if (!instruccion.match(regex)) {  // Ejecutra expresion regular
                errores.push(instruccion);  // Instrucciones Invalidas
            }else{
                instrucciones.push(instruccion); //Instrucciones Validas
            } 
        }
    }

    if(errores.length){
       var contenidoError = '';
       for(var i=0; i<errores.length; i++){
          contenidoError = contenidoError + " " + (i+1) + ". "  + errores[i] + "<br/>";
       }
       $.confirm({
           title: "!ERROR!",
           content: contenidoError,
        //    icon: 'fa fa-exclamation-triangle',
           theme: 'black',
           closeIcon: true,
           animation: 'scale',
           type: 'orange',
           
       })
    }else{
        cargarInstruccionesEntrada();
    }
}

function printTest(){
    ///Test imprimir datos de instrucciones
    console.log(errores); //Imprimir lISTA de instrucciones invalidas
    console.log(instrucciones);//Imprimir LISTA de instrucciones correctas
    console.log(getInstruccion); // instrucciones opCode(suma,resta, mul, div)
    console.log(ubicaciones); // ubicaciones de memoria por instruccions
}

//Cargar registro en memoria, posiciones de la 000 - 999
function cargarInstruccionesMemoria() { 
    //Copiar arreglo instrucciones en ubicaciones
    for (var i = 0; i < instrucciones.length; i++) {
        ubicaciones[i] = instrucciones[i];
    }

    for (var i = 0; i < ubicaciones.length; i++){
        ubicaciones[i] = parseInt(ubicaciones[i].replace(regexMemory, ''));
    }
    max = Math.max(...ubicaciones);//obtener la Ubicacion de memoria maxima para agregar al panel de memoria
    for (var i = 0; i <= max; i++) {
       contenidoMemoria[i]=0;  
    }
    for(var i = 0; i<instrucciones.length;i++){
        var elemento = document.getElementById('cmInstrucciones');
        elemento.insertAdjacentHTML('beforeend',
            '<tr>' +
            '<th scope="row" id="ubicacion-' + i + '">' +
            i +
            '</th>' +
            '<td id="contenido-' + i + '">' +
            instrucciones[i] +
            '</td>' +
            '</tr>'
        );
        if (i<(instrucciones.length-1)) {
            irArray.push(instrucciones[i])
        }

    }
    for (var i= instrucciones.length; i <= max; i++) {
        var elemento = document.getElementById('cmInstrucciones');
        elemento.insertAdjacentHTML('beforeend',
            '<tr>' +
            '<th scope="row" id="ubicacion-' + i + '">' +
            i +
            '</th>' +
            '<td id="contenido-' + i + '">' +
            "0"+
            '</td>' +
            '</tr>'
        );
        
    }
    obtenerInstrucciones();
    
    /*
    La carga de instrucciones se hace en dos arrelgos uno con el OpCode y 
    el otro con el contenido de memoria.
    Llamar al metodo obtener instrucciones para cargar el array getInstruccion que 
    contiene el opCode.
     
    array de opCode(codigo de operacion +,-,*,/,....) se puede acceder 
    de manera global --> getInstruccion[]
    array de contenido de memoria se pude acceder de manera global --> ubicaciones[]

    */
}

//Cargar instrucciones en tabla html, Panel de entrada
function cargarInstruccionesEntrada() {
    var elemento = document.getElementById('tInstrucciones');
    for (var i = 0; i < instrucciones.length;i++){
        elemento.insertAdjacentHTML('beforeend', '<tr><th scope="row">' + (i+1) + '</th><td>' + instrucciones[i] + '</td></tr>');
    }

    cargarInstruccionesMemoria();
}

function obtenerInstrucciones(){
    //Copiar arreglo instrucciones en getInstrucciones
    for (var i = 0; i < instrucciones.length; i++) {
        getInstruccion[i] = instrucciones[i];
    }

    for (var i = 0; i < getInstruccion.length; i++) {
        var x = getInstruccion[i];
        var y = x.length - 3;
        x = x.substring(1,y);
        getInstruccion[i] = parseInt(x);
    }
         
    //Algoritmo para obtener el 10(Instruccion Read)
    /*var x = '+10999';
    var y = x.length - 3 ;
    x = x.substring(1, y);
    console.log(x);*/

    // Editar td para ac, pc, ir(registro de programa)  con jquery
    /*var x = 9;
    $("#ac").html(x); 
     */                                                     
}

function ejecutarInstruccion(instruccion, index) {
    /* 
    Funcion para ejecutar instruccion por instruccion.((Debug)
    datos necesarios estan en las variables globales.

    *array getInstruccion[]-->Guarda los operadores opCoder(suma,resta,multiplicacion ,...);
    *array ubicaciones[] --> Almacena todas las ubicaciones de las instrucciones en el la ejecucion actual.

    */
    switch (instruccion) {
        case 10:
            // Lee una palabra desde el teclado y la introduce en una
            // ubicación específica de memoria --> ubicacion[index]
            leerDato(ubicaciones[index],index);
            actualizarRegistros(index)
           
            break;
        case 11:
            // Escribe una palabra de una ubicación específica de
            // memoria y la imprime en la pantalla
            imprimirPantalla(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 20:
            // Carga una palabra de una ubicación específica de
            // memoria y la coloca en el acumulador.
            cargarAlAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 21:
            // Almacena una palabra del acumulador dentro de una
            // ubicación específica de memoria.
            cargarDelAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 30:
            // Suma una palabra de una ubicación específica de
            // memoria a la palabra en el acumulador 
            sumaAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 31:
            // Resta una palabra de una ubicación específica de
            // memoria a la palabra en el acumulador
            restaAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 32:
            // Divide una palabra de una ubicación específica de
            // memoria entre la palabra en el acumulador 
            divAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 33:
            // Multiplica una palabra de una ubicación específica de
            // memoria por la palabra en el acumulador 
            multcaAC(ubicaciones[index], index)
            actualizarRegistros(index)
            break;
        case 40:
            // Bifurca hacia una ubicación específica de memoria sin importar la condicion de ac
            stop = 40
            bifurcaValidar(ubicaciones[index], index)
            ejecutarInstruccionesBifurcacion(ubicaciones[index])
            actualizarRegistros()
            break;
        case 41:
            // Bifurca hacia una ubicación específica de memoria si el
            // acumulador es negativo.
            if (ac < 0){
                bifurcaValidar(ubicaciones[index], index)
                ejecutarInstruccionesBifurcacion(ubicaciones[index])
                // actualizarRegistros()
                stop = 41
            }
            break;
        case 42:
            // Bifurca hacia una ubicación específica de memoria si el
            // acumulador es cero.
            if (ac == 0){
                bifurcaValidar(ubicaciones[index], index)
                ejecutarInstruccionesBifurcacion(ubicaciones[index])
                actualizarRegistros()
                stop == 42
            }
            
            break;
        case 43:
            // Alto , el programa completo su tarea.
            actualizarRegistros(index)
            ejecutarInstruccion.finish();
            break;
    }

}

//Ejecutar todas las instrucciones en un solo paso
function ejecutarInstrucciones() {
    for (var i = 0; i < getInstruccion.length; i++) {
        if (stop == 40 || stop == 41 || stop == 42) {
            ejecutarInstruccion(getInstruccion[i], i);
            return
        } else {
            ejecutarInstruccion(getInstruccion[i], i);
        }

    }
}

function ejecutarInstruccionesBifurcacion(indexInicio) {
    for (var i = indexInicio; i < getInstruccion.length; i++) {
        if (getInstruccion[i] == 40 || getInstruccion[i] == 41 ||getInstruccion[i]==42) {
            ejecutarInstruccion(getInstruccion[i], i);
            return
        } else {
            ejecutarInstruccion(getInstruccion[i], i);
        }

    }
}
function bifurcaValidar(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        alert("Error posicion de memoria invalida, Area de Instrucciones: " + instrucciones[index])
        actualizarRegistros(index)
        bifurcaPositivo.finish();
    } 
}

function comprobarEntrada() {
    if (ac<0){
        return 41;
    }else if (ac==0) {
        return 42
    } else {
        return 40;
    }
}

function sumaAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        ac = ac + contenidoMemoria[posicion]
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        sumaAC.finish();
    }
}

function restaAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        ac = ac - contenidoMemoria[posicion]
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        restaAC.finish();
    }
}

function multcaAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        ac = ac * contenidoMemoria[posicion]
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        multcaAC.finish();
    }
}
function divAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        ac = parseInt(ac / contenidoMemoria[posicion])

    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        divAC.finish();
}

}

function cargarAlAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        ac= contenidoMemoria[posicion]
        $("#ac").html(ac)
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        cargarAlAC.finish();
    }
}

function cargarDelAC(posicion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        contenidoMemoria[posicion]=ac
        $("#contenido-"+ posicion).html(ac)
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        cargarDelAC.finish();
    }
}

$("#btn-ejecutar").click(function () {
    $("#btn-ejecutar").attr("disabled", true)
    $("#chk-debug").attr('disabled',true)
    $("#tEjecucion").empty()
    ejecutarInstrucciones()
  
    
})

function leerDato(posicion,index){
    var datoLeido = parseInt(prompt('Ingrese dato(0,1,2,...)'));
    if (isNaN(datoLeido)) {
      alert("ingrese un dato valido");
      leerDato(posicion, index);
    }else{
        if(ubicaciones[index]>=instrucciones.length){ //Validar que el dato leido se carge en el area de datos
            contenidoMemoria[posicion] = datoLeido;
            cargarHtmlMemoria(posicion, datoLeido);
        }else{
            alert("Error posicion invalida, instruccion: "+ instrucciones[index])
            actualizarRegistros(index)
            leerDato.finish();
        }
        
    }
}

function imprimirPantalla(ubicacion,index) {
    if (ubicaciones[index] >= instrucciones.length) { //Validar que el dato leido se carge en el area de datos
        $("#resultado").html(contenidoMemoria[ubicacion])
    } else {
        alert("Error posicion de memoria invalida, instruccion: " + instrucciones[index])
        actualizarRegistros(index)
        imprimirPantalla.finish();
    }
 
}

function actualizarRegistros(index) {
    pc = index
    ir = irArray[index]
    cargarHtmlRegistro(pc, ir, ac)
    cargarHtmlEjecucion(pc, ir, ac)
}

function cargarHtmlMemoria(ubicacion, contenido) {
    $("#contenido-"+ubicacion).html(contenido);
}

function cargarHtmlRegistro(pc, ir, ac) {
    $("#ac").html(ac)
    $("#pc").html(pc)
    $("#ir").html(ir)
}

function cargarHtmlEjecucion(pc, ir, ac) {
    var elemento = document.getElementById('tEjecucion');
    elemento.insertAdjacentHTML('beforeend',
        '<tr>' +
            '<td>' +
              pc +
            '</td>' +
            '<td>' +
             ir +
            '</td>' +
            '<td>' +
             ac +
            '</td>' +
        '</tr>'
    );  
}

function limpiaraArrays() {
    errores = Array();
    instrucciones = Array();
    ubicaciones = Array();
    getInstruccion = Array();
    contenidoMemoria = Array();
    //Variables globales de control de programa

}

function limpiarTodo() {
    limpiaraArrays();
    $('#tInstrucciones').empty();
    $('#cmInstrucciones').empty();
    $("#ac").html("0")
    $("#pc").html("+000")
    $("#ir").html("+00000")
    $("#resultado").html("0")
    $("#tEjecucion").empty()
}

$("#btn-limpiar").click(function () {
    limpiarTodo()
    $("#btn-ejecutar").attr("disabled", false)
    $("#chk-debug").attr("disabled", false)
    pc = -1;
    irArray = Array();
    irArray.push("+00000") //Inicializar ir con 0
    ir = 0
    ac = 0;
})