//Expresion regular para validacion de instrucciones
var regex = /^(\+|\-)(00|10|11|20|21|30|31|32|33|40|41|43)([0-9][0-9][0-9])$/gm;

//Leer Archivo 
$("#fInstrucciones").change(function (e){
    $('#tInstrucciones').empty();
    $('#cmInstrucciones').empty();
    var archivo = e.target.files[0]; // Guardad archivo subido en esta variable
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        validadInstrucicones(contenido);
    };
    lector.readAsText(archivo);
    $("#fInstrucciones").val('');
})

// Validad Instrucciones
//Variables globales de salida de la funcion validadInstrucciones
var errores = Array(); //Arreglo de instrucciones erroneas
var instruciones = Array(); // Arreglo con las instrucciones ya validas

function validadInstrucicones(contenido) {
    var instruccionesSinValidar= contenido.split('\n');
    for (var instruccion of instruccionesSinValidar){  // For Each para recorrer todas las instrucciones del archivo
        if (instruccion != ''){ // Omitir lineas vacias o nullas
            if (!instruccion.match(regex)) {  // Ejecutra expresion regular
                errores.push(instruccion);  // Instrucciones Invalidas
            }else{
                instruciones.push(instruccion); //Instrucciones Validas
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
    }
   
}

function printTest(){
    ///Test imprimir datos de instrucciones
    console.log(errores); //Imprimir lISTA de instrucciones invalidas
    console.log(instruciones);//Imprimir LISTA de instrucciones correctas
}





