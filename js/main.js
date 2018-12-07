// Codigo de catraComputer
var puedeCargar=0;
//################################CODIGO PARA LEER DOCUMENTO###############################################################
document.getElementById('fInstrucciones').addEventListener('change', leerArchivo, false);

function leerArchivo(e) {
  $('#tInstrucciones').empty();
  $('#cmInstrucciones').empty();
  var archivo = e.target.files[0];
  if (!archivo) {
  }

  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido(contenido);
  };
  lector.readAsText(archivo);
  
}

function mostrarContenido(contenido) {
  var elemento = document.getElementById('tInstrucciones');
  var lineas = contenido.split('\n');
  var contador=0;
  var n=lineas.length-1;
  var error=[];
  for (var linea of lineas){
	  elemento. insertAdjacentHTML('beforeend','<tr><th scope="row">'+contador+'</th><td id="tdE'+contador+'">'+linea+'</td></tr>');
	  if(n==contador){
		  if(linea.length<5){
			  alert("Tiene un error en la instruccion numero "+contador+", por favor revise se encuentre completa y vuelva a intentar");
			  var lineaMala=document.getElementById('tdE'+contador);
			  lineaMala.style.background="rgba(122,0,0,0.2)";
			  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
			  error.push(1);
		  }else{
			  if(linea.length>5){
				  alert("Tiene un error en la instruccion numero "+contador+", por favor revise la instruccion y vuelva a intentar ");
				  var lineaMala=document.getElementById('tdE'+contador);
				  lineaMala.style.background="rgba(122,0,0,0.2)";
				  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
				  error.push(1);
			  }else{
				  if(linea.substr(0,2)==10 || linea.substr(0,2)==11 || linea.substr(0,2)==20 || linea.substr(0,2)==21 || linea.substr(0,2)==30 || linea.substr(0,2)==31 || linea.substr(0,2)==32 || linea.substr(0,2)==33 || linea.substr(0,2)==40 || linea.substr(0,2)==41 || linea.substr(0,2)==42 || linea.substr(0,2)==43){
				  }else{
					  alert("Tiene un error en la instruccion numero "+contador+", por favor revise el codigo de la instruccion y vuelva a intentar ");
					  var lineaMala=document.getElementById('tdE'+contador);
					  lineaMala.style.background="rgba(122,0,0,0.2)";
					  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
					  error.push(1);
				  }
			  }  
		  }
		  
	  }else{
		  if(linea.length<6){
			  alert("Tiene un error en la instruccion numero "+contador+", por favor revise se encuentre completa y vuelva a intentar");
			  var lineaMala=document.getElementById('tdE'+contador);
			  lineaMala.style.background="rgba(122,0,0,0.2)";
			  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
			  error.push(1);
		  }else{
			  if(linea.length>6){
				  alert("Tiene un error en la instruccion numero "+contador+", por favor revise la instruccion y vuelva a intentar ");
				  var lineaMala=document.getElementById('tdE'+contador);
				  lineaMala.style.background="rgba(122,0,0,0.2)";
				  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
				  error.push(1);
			  }else{
				  if(linea.substr(0,2)==10 || linea.substr(0,2)==11 || linea.substr(0,2)==20 || linea.substr(0,2)==21 || linea.substr(0,2)==30 || linea.substr(0,2)==31 || linea.substr(0,2)==32 || linea.substr(0,2)==33 || linea.substr(0,2)==40 || linea.substr(0,2)==41 || linea.substr(0,2)==42 || linea.substr(0,2)==43){
				  }else{
					  alert("Tiene un error en la instruccion numero "+contador+", por favor revise el codigo de la instruccion y vuelva a intentar ");
					  var lineaMala=document.getElementById('tdE'+contador);
					  lineaMala.style.background="rgba(122,0,0,0.2)";
					  lineaMala.previousSibling.style.background="rgba(122,0,0,0.2)";
					  error.push(1);
				  }
			  }
				  
		  }
	  }
      contador=contador+1;
  }  
  if(error.length==0){
	puedeCargar=1; 
  }else{
	  puedeCargar=0;
  }
  
}

//########################################CODIGO PARA LEER DATOS DE ENTRADA Y TRASLADARLO A MEMORIA###################################################################
$(document).ready(function(){
	$('#bCargarInst').click(function(){
	    if(puedeCargar==1){
            var n = document.querySelector('#tInstrucciones').querySelectorAll('tr').length;
			var elemento = document.getElementById('cmInstrucciones');
			for(i=0;i<n;i++){
				var entrada=$('#tdE'+i)[0].innerHTML;
				if(i<10){
					elemento.insertAdjacentHTML('beforeend','<tr><th scope="row">00'+i+'</th><td id="tdM00'+i+'">'+entrada+'</td></tr>');
				}else{
					if(i<100){
						elemento.insertAdjacentHTML('beforeend','<tr><th scope="row">0'+i+'</th><td id="tdM0'+i+'">'+entrada+'</td></tr>');
					}else{
						if(i<1000){
							elemento.insertAdjacentHTML('beforeend','<tr><th scope="row">'+i+'</th><td id="tdM'+i+'">'+entrada+'</td></tr>');
						}
					}
				}
			}	
		}else{
			alert("Revise el conjunto de instrucciones, puede que no tenga ninguna instruccion cargada o tenga error el conjunto de instrucciones cargadas (las casillas marcadas en rojo indica un posible error)");
		}
    });
});


