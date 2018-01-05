
var elemento = document.getElementsByTagName('td');


// diccionario con datos de las asignaturas
var asignaturas = {
  "BBDD":{
      "nombre":"Base de Datos",
      "profesor":"Jaume Oliver",
  },
  "PROG":{
        "nombre":"Programación",
        "profesor":"David Gelpi",
  },
  "PROG+":{
        "nombre":"REF Programación",
        "profesor":"David Gelpi",
  },
  "ED":{
        "nombre":"Entornos Desarrollo",
        "profesor":"David Gelpi",
  },
  "LLMM":{
        "nombre":"Lenguaje de Marcas",
        "profesor":"Rafa Gión",
  } ,
  "LLMM+":{
        "nombre":"REF Lenguaje de Marcas",
        "profesor":"Rafa Gión",
  },
  "SI":{
        "nombre":"Sistemas Informáticos",
        "profesor":"Ramón Jaume",
  },
  "FOL":{
        "nombre":"",
        "profesor":"Unknown teacher",
  },
  "PATIO":{
      "nombre":"kit-kat time",
      "profesor":""
  },
  "x":{
    "nombre":"casa time",
    "profesor":"don't disturb"
  }
};

document.addEventListener("mouseover", function(e){
  var obj = e.target;
  if(obj.tagName == 'TD' && obj != obj.parentElement.childNodes[1]){
    obj.classList.toggle('hoverCeldas',true);
  }
});

document.addEventListener("mouseout", function(e){
  var obj = e.target;
  if(obj.tagName == 'TD' && obj != obj.parentElement.childNodes[1]){
    obj.classList.toggle('hoverCeldas',false);
  }
});

function limpiarP(obj){
  obj.childNodes[1].innerText = ""
  obj.childNodes[1].innerHTML = ""
  obj.childNodes[1].outerText = ""
  //obj.childNodes[1].outerHTML = ""
}

function generarNodo(tipo,obj){
  var node = document.createElement(tipo);
  var textnode = document.createTextNode("");
  node.appendChild(textnode);
  obj.appendChild(node);
}

function datosAsignaturas(asignatura){
  var td = document.getElementsByTagName("TD")
  for(i=0; i<=td.length; i++){
      if(td[i].innerText.split("\n")[0] == asignatura){
        if(td[i].childNodes.length > 1 && td[i].childNodes[1].innerText == ""){
            td[i].childNodes[1].innerText = ""+asignaturas[asignatura]["nombre"]+"\n"+asignaturas[asignatura]["profesor"];
        } else {
          limpiarP(td[i]);
          generarNodo("P",td[i]);
        }
        td[i].classList.toggle(asignatura);
      }else{
        if(td[i].className != ""){
          td[i].classList.toggle(td[i].className);
          limpiarP(td[i]);
          generarNodo("P",td[i]);
        }
      }
  }
}

document.addEventListener("click", function(e){
    var obj = e.target;
    if(obj.tagName == 'TD' && obj != obj.parentElement.childNodes[1]){
      var asignatura = obj.innerText.split("\n")[0];
      datosAsignaturas(asignatura);
    }

});
