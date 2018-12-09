//Expresion regular para validacion de instrucciones
var regex = /^(\+|\-)(00|10|11|20|21|30|31|32|33|40|41|42|43)([0-9][0-9][0-9])$/gm;

//Expresion regular para obtener todas las direcciones de memoria utilizadas en el programa
var regexMemory = /^(\+|\-)((00|10|11|20|21|30|31|32|33|40|41|42|43))/gm;

//Leer Archivo 
$("#fInstrucciones").change(function (e){
    $('#tInstrucciones').empty();
    $('#cmInstrucciones').empty();
    var archivo = e.target.files[0]; // Guardad archivo subido en esta variable
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        validarInstrucicones(contenido);
    };
    lector.readAsText(archivo);
    $("#fInstrucciones").val('');
})

// Validar Instrucciones
//Variables globales de salida de la funcion validarInstrucciones
var errores = Array(); //Arreglo de instrucciones erroneas
var instrucciones = Array(); // Arreglo con las instrucciones ya validas

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
           title : "!ERROR!",
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
var ubicaciones = Array(); // copia de todas las instrucciones para matipulacion de datos 
function cargarInstruccionesMemoria() { 
    //Copiar arreglo instrucciones en ubicaciones
    for (var i = 0; i < instrucciones.length; i++) {
        ubicaciones[i] = instrucciones[i];
    }

    for (var i = 0; i < ubicaciones.length; i++){
        ubicaciones[i] = parseInt(ubicaciones[i].replace(regexMemory, ''));
    }
    var max = Math.max(...ubicaciones);//obtener la Ubicacion de memoria maxima para agregar al panel de memoria
    for (var i = 0; i <= max; i++) {
        var elemento = document.getElementById('cmInstrucciones');
        elemento.insertAdjacentHTML('beforeend',
        '<tr>' +
            '<th scope="row" id="ubicacion-' + i + '">'+
              i + 
            '</th>'+
            '<td id="contenido-'+ i + '">'+
               '000'+
            '</td>'+
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
    var getInstruccion = Array(); // copia de todas las instrucciones para matipulacion de datos  
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

console.log(instrucciones);