$(document).ready(function () {
  // subir json a la página para poder cargarlo (GETJSON)
  urlJSON = 'https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/desarrollo/proyecto%20Test%20Autoescuela/resources/json/test.json'
  const NUMERO_PREGUNTAS = 10;
  // Cantidad de preguntas en nuestro archivo JSON 
  pilaPreguntas = 0;

  // Si para 30 preguntas puedes fallar 3 
  const MAXIMO_ERRORES = NUMERO_PREGUNTAS * 3 / 30

  // Cargamos el archivo json y mostramos las perguntas
  $.ajax({
    url: urlJSON,
    dataType: 'text',
    success: function (data) {

      var json = $.parseJSON(data);
      pilaPreguntas = Object.keys(json).length;
      preguntas = preguntasRandom(NUMERO_PREGUNTAS);

      // Donde vamos a agregar los radio button
      main = $('#formularioTest');

      //Mensaje que te avisa de las preguntas que puedes fallar para aprobar
      main.append('<span id="badge" class="mensajeWarning"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> &nbsp; Recuerda que puedes fallar ( ' + Math.round(MAXIMO_ERRORES) + ' ) pregunta/as para aprobar !</span>');
      
      $.each(preguntas, function (index, value) {
        pregunta = json[value.toString()]
        main.append("<section id='pregunta" + index + "'>")

        //Cada pregunta tendrá su contenedor section
        sectionPregunta = $("#pregunta"+ index);
        sectionPregunta.append('<h3><strong> ' + (index + 1) + '</strong> ' + pregunta['p'] + '</h3>');
        sectionPregunta.append("<article class='preguntas'>");
        articlePreguntas = sectionPregunta.find(".preguntas");
          articlePreguntas.append("<label><input type='radio' name='p" + index + "' value='a'> a) " + pregunta['a'] + '</label><br>');
          articlePreguntas.append("<label><input type='radio' name='p" + index + "' value='b'> b) " + pregunta['b'] + '</label><br>');
          articlePreguntas.append("<label><input type='radio' name='p" + index + "' value='c'> c) " + pregunta['c'] + '</label><br>');
        sectionPregunta.append("</article>");

        // Si el fichero json tiene imagenes, la añadimos al section de la pregunta
        if (pregunta['i'] != null) {
          sectionPregunta.css('background-image', 'url(http://www.' + pregunta['i'] + ')').css('background-repeat', 'no-repeat').
          css('background-size', '25%').css('background-position','right center');
        }
        main.append("</section>")
        main.append('<hr/>')
      })
    }
  })

  /*
    Generamos un número aleatorio
    entrada: n - Recibe la cantidad de preguntas que tenemos en el fichero json
    salida: Número Random Entre 1 y n
  */
  function obtenerNumeroRandom (n) {
    return Math.floor((Math.random() * n) + 1)
  }


  /*
    Tenemos un array con las preguntas de longitud n
    a la que vamos añadiendo números aleatorios ( sin repetir )

    entrada: Número de preguntas que vamos a mostrar en el formulario ( NUMERO_PREGUNTAS )
      iniciamos lista de preguntas []
      mientras i sea menor que NUMERO_PREGUNTAS
        obtenemos un número aleatorio
        si el número no está en nuestra lista: lo añadimos a la lista e incrementamos i
        si no está, generamos otro número aleatorio
    salida: lista con N numeros aleatorios que servirán para elegir las preguntas de nuestro JSON de forma aleatoria
  */
  function preguntasRandom (nPreguntas) {
    var listaPreguntas = []
    i = 0
    while(i < nPreguntas){
      /* cantidad de preguntas que tenemos en el archivo json*/
      numeroRandom = obtenerNumeroRandom(pilaPreguntas)
      if (!(listaPreguntas.includes(numeroRandom))) {
        listaPreguntas.push(numeroRandom)
        i++
      }
    }
    return listaPreguntas
  }

  /*
    Comprueba que haya un radio button elegido de cada pregunta
    salida: booleano 
  */

  function todasRespondidas () {
    var data = $('form').serialize()
    return data.split('&').length == NUMERO_PREGUNTAS
  }

  /*
    Cada vez que haya un cambio en nuestro formulario ( Se selecciona un radio button )
    comprueba si hemos respondido a todas las preguntas
    si no hemos respondido a todas: Sale mensaje arriba de nuestro botón para enviar el formulario
    si hemos respondido a todas las preguntas: Habilita el botón para enviar el formulario

  */

  $('#formularioTest').change(function () {
    if (todasRespondidas()) {
      $('#faltanPreguntas').hide();
      $('.enviarFormulario').prop('disabled', false);
      $('.enviarFormulario').css("cursor","pointer");
    } else {
      $('#faltanPreguntas').show().text("Debes responder a todas las preguntas para corregir el test");
      $('.enviarFormulario').prop('disabled', true);
      $('.enviarFormulario').css("cursor","no-drop");
    }
  })

  /*envio formulario*/
  $('.enviarFormulario').click(function () {
    if (todasRespondidas()) {
      var respuestas = $('form').serialize()
      corregirPreguntas(respuestas)
    }
  })

/**
 * Método que nos moverá el scroll hasta la primera pregunta que encuentre sin responder
 * recorremos todas las section de las preguntas y buscamos un radio buton seleccionado
 * si no se ha seleccionado el radio button en la pregunta n, mueve scroll a ese section
 *  
 */

  $("#faltanPreguntas").mouseover(function(){
    for(i=0; i < NUMERO_PREGUNTAS; i++){
      if ( $("section").find('input[name=p'+i+']:checked').length == 0){
        $('html, body').animate({
          scrollTop: $("#pregunta"+i).offset().top
        }, 1000);
        break;
      }
    }
  });

  function corregirPreguntas (respuestas) {
    respuestas = respuestas.split('&')
    var erroneas = 0
    $('.enviarFormulario').prop('disabled', true)
    $.getJSON(urlJSON, function (data) {
      $.each(preguntas, function (index, value) {
        pregunta = data[value.toString()]
        respuestaCorrecta = pregunta['s'].toLowerCase()
        respuestaProporcionada = respuestas[index].split('=')[1].toLowerCase()
        if (respuestaCorrecta == respuestaProporcionada) {
          $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('label').addClass('respuestaCorrecta')
        } else {
          $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('label').addClass('respuestaIncorrecta');
          $("input[name='p" + index + "'][value='" + respuestaCorrecta + "']").closest('label').addClass('respuestaCorrecta');
          $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('section').append("<p class='explicacion'> " + pregunta['e'] + "</p>")
          $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('section').find('.explicacion').show();
         
          erroneas++
        }
      })
      // Comprobamos errores con los máximos permitidos      
      if (erroneas > MAXIMO_ERRORES) {
        $("#badge").removeClass('mensajeWarning').addClass('mensajeAdvertencia').html('<i class="fa fa-times-circle" aria-hidden="true"></i> &nbsp;Has fallado ' + erroneas + ' pregunta/as, mira las explicaciones para aprobar a la próxima');
      } else {
        $('#badge').removeClass('mensajeWarning').addClass('mensajeAprobado').html('<i class="fa fa-check" aria-hidden="true"></i> &nbsp;Enhorabuena! has aprobado el test');
      }
      $("#creditos").hide();
      $('html, body').animate({
        scrollTop: $("#badge").offset().top
      }, 1000);
      $('input[type="radio"]').attr('disabled', 'disabled');
      $('.enviarFormulario').attr('disabled', 'disabled');

    }, 'text')

  }

  //Cerrar Alertas
  $('.cerrarAlerta').click(function(){
    $(this).closest('span').hide('low')
  });

})
