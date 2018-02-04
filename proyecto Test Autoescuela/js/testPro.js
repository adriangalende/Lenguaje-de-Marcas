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

          if ( index > 0){
            sectionPregunta.hide(); 
          }
  
        })
        challengeMode("2:01");
      }
    })

    function challengeMode(tiempo){
        if(tiempo != 0){
            interval = setInterval(function() {

                    var timer = tiempo.split(':');
                    var minutos = parseInt(timer[0], 10);
                    var segundos = parseInt(timer[1], 10);
                    --segundos;
                    minutos = (segundos < 0) ? --minutos : minutos;
                    if (minutos < 0) clearInterval(interval);
                    segundos = (segundos < 0) ? 59 : segundos;
                    segundos = (segundos < 10) ? '0' + segundos : segundos;
                    $('.countdown').html(minutos + ':' + segundos);
                    tiempo = minutos + ':' + segundos;
                        if (minutos == 0 && segundos == 00){
                            var respuestas = $('form').serialize();
                            sanitizeRespuestas(respuestas);
                        }            
            }, 1000);
        } else {
            clearInterval(interval);
            $('.countdown').html("TEST ACABADO");
        }    
    }
   
    /**
     * Como trabajamos con el tiempo, es probable que el usuario no pueda responder a todas las preguntas
     * por eso debemos "Sanear" la obtención de las respuestas del form
     */

    function sanitizeRespuestas(respuestas){
        i = parseInt($(this).serialize().split('&').length - 1);
        console.log(i);
        while (i < NUMERO_PREGUNTAS){
            if( i == 0){
                respuestas+="p"+i+"=nc";
            } else {
                respuestas+="&p"+i+"=nc";
            }
            i++;
        }
        corregirPreguntas(respuestas);
    }
  
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
        var respuestas = $('form').serialize()
        corregirPreguntas(respuestas);

      } else {
        index = parseInt($(this).serialize().split('&').length - 1);
        preguntaActual = $(this).find('#pregunta'+index).attr('id').split('pregunta')[1];
        if (preguntaActual < NUMERO_PREGUNTAS){
            preguntaSiguiente = parseInt(preguntaActual);
            preguntaSiguiente++;
        }
        $('#pregunta'+preguntaActual).hide();
        $('#pregunta'+preguntaSiguiente).show();
      }
    });

    
    // ir a pregunta con paginacion
    $("#paginacionPreguntas").click(function(e){
        if (e.target.tagName == "BUTTON"){
            $("section").hide();
            $("#pregunta"+ (e.target.innerText -1 )).show();
        }
    });

    // Crear paginacion
    /**
     *  Creamos los botones que ejercerán de paginación para poder revisar las preguntas
     *  entrada: 
     *      array que contiene si hemos acertado o fallado la pregunta 
     *      ( se rellena en la función de corregirPreguntas ), y se envía desde allí
     * 
     * 
     */

    var arrayPaginator = [];
    function crearPaginator(arrayPaginator){
        i=0;
        paginacion = $("#paginacionPreguntas");
        claseLabel = "";
        while(i < NUMERO_PREGUNTAS){
            if(arrayPaginator[i] == "c"){
                claseLabel = "correcto";
            } else {
                claseLabel = "incorrecto";
            }

            paginacion.append("<button class='botonPregunta " + claseLabel + "' type='button'>"+(i+1)+"</button>");
            i++;
        }
    }
  
    function corregirPreguntas (respuestas) {
      respuestas = respuestas.split('&');
      var erroneas = 0;
      $('.enviarFormulario').prop('disabled', true)
      $.getJSON(urlJSON, function (data) {
        $.each(preguntas, function (index, value) {
          pregunta = data[value.toString()]
          respuestaCorrecta = pregunta['s'].toLowerCase()
          respuestaProporcionada = respuestas[index].split('=')[1].toLowerCase()
          if (respuestaCorrecta == respuestaProporcionada) {
            $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('label').addClass('respuestaCorrecta');
            arrayPaginator.push("c");
          } else {
            $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('label').addClass('respuestaIncorrecta');
            $("input[name='p" + index + "'][value='" + respuestaCorrecta + "']").closest('label').addClass('respuestaCorrecta');
            $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('section').append("<p class='explicacion'> " + pregunta['e'] + "</p>")
            $('input[name=p' + index + '][value=' + respuestaProporcionada + ']').closest('section').find('.explicacion').show();     
            erroneas++
            arrayPaginator.push("i");
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
        }, 1000)
        $('input[type="radio"]').attr('disabled', 'disabled');
        crearPaginator(arrayPaginator);          
        challengeMode(0);
      }, 'text')
      // Creamos paginacion de las preguntas
    }
  
    //Cerrar Alertas
    $('.cerrarAlerta').click(function(){
      $(this).closest('span').hide('low')
    });
  
  })
  