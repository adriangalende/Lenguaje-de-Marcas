$( document ).ready(function() {

  function obtenerNumeroRandom(n){
    return Math.floor((Math.random() * n) + 1);
  }


  function preguntasRandom(nPreguntas){
      var listaPreguntas = [];
        i = 0;
        while(i < nPreguntas){
          /* cantidad de preguntas que tenemos en el archivo json*/
        numeroRandom = obtenerNumeroRandom(10);
        if (!(listaPreguntas.includes(numeroRandom))){
          listaPreguntas.push(numeroRandom);
          i++;
        }
      }
      return listaPreguntas;
  }

  function todasRespondidas(){
    var data = $('form').serialize();
    return data.split('&').length == NUMERO_PREGUNTAS;
  }

  $('#formularioTest').change(function(){
    if (todasRespondidas()) {
      $('.enviarFormulario').prop('disabled', false);
    } else {
      $('.enviarFormulario').prop('disabled', true);
    }
  });

const NUMERO_PREGUNTAS = 10;
/* Si para 30 preguntas puedes fallar 3 */
const MAXIMO_ERRORES =  NUMERO_PREGUNTAS * 3 / 30;
preguntas = preguntasRandom(NUMERO_PREGUNTAS);

  /* subir json a la página para poder cargarlo  */
  $.getJSON('https://api.myjson.com/bins/1aonzx', function(data) {
      main = $('#formularioTest');
      $.each( preguntas, function( index, value ) {
        pregunta = data[value.toString()];
        main.append("<p><strong>[" + (index+1) + "] " + pregunta["p"]+"</strong></p>");
        main.append("<label><input type='radio' name='p"+index+"' value='a'> a) " + pregunta["a"] + "</label><br>");
        main.append("<label><input type='radio' name='p"+index+"' value='b'> b) " + pregunta["b"] + "</label><br>");
        main.append("<label><input type='radio' name='p"+index+"' value='c'> c) " + pregunta["c"] + "</label><br>");
        if (pregunta["i"] != null){
          main.append("<img src='http://www." + pregunta["i"] + "'></img>");
        }
        main.append("<hr/>");
      });
  }, 'text');


  /*envio formulario*/
  $('.enviarFormulario').click(function(){
    if (todasRespondidas()) {
      var respuestas = $('form').serialize();
      corregirPreguntas(respuestas);
    }
  });

  function corregirPreguntas(respuestas){
    respuestas = respuestas.split('&');
    var erroneas = 0;
    $('.enviarFormulario').prop('disabled', true);
    $.getJSON('https://api.myjson.com/bins/1aonzx', function(data) {
      $.each( preguntas, function( index, value ) {
        pregunta = data[value.toString()];
        respuestaCorrecta = pregunta["s"].toLowerCase();
        respuestaProporcionada = respuestas[index].split("=")[1].toLowerCase();
        if ( respuestaCorrecta == respuestaProporcionada ){
          $("input[name=p"+index+"][value=" + respuestaProporcionada + "]").closest("label").addClass('respuestaCorrecta');
        } else {       
          $("input[name=p"+index+"][value=" + respuestaProporcionada + "]").closest("label").addClass('respuestaIncorrecta');
          $("input[name='p"+index+"'][value='" + respuestaCorrecta + "']").closest("label").addClass("respuestaCorrecta");
          erroneas++;
        }
      }); 
      
      // Comprobamos errores con los máximos permitidos      
      if (erroneas > MAXIMO_ERRORES){
        alert("Has suspendido el test sosio");
      }

    }, 'text');

  }
});
