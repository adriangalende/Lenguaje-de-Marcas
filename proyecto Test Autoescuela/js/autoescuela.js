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

  /*envio formulario*/
  $('.enviarFormulario').click(function(){
    var data = $('form').serialize();
    console.log(data);
  });

  const NUMERO_PREGUNTAS = 3;
  /* subir json a la página para poder cargarlo  */
  $.getJSON('https://api.myjson.com/bins/1aonzx', function(data) {
      preguntas = preguntasRandom(NUMERO_PREGUNTAS);
      main = $('#formularioTest');
      $.each( preguntas, function( index, value ) {
        pregunta = data[value.toString()];
        main.append("<p><strong>[" + (index+1) + "] " + pregunta["p"]+"</strong></p>");
        /*<input type="radio" name="gender" value="male"> Male<br>*/
        main.append("<input type='radio' name='p"+index+"' value='a'> a) " + pregunta["a"] + "<br>");
        main.append("<input type='radio' name='p"+index+"' value='b'> b) " + pregunta["b"] + "<br>");
        main.append("<input type='radio' name='p"+index+"' value='c'> c) " + pregunta["c"] + "<br>");
        if (pregunta["i"] != null){
          main.append("<img src='http://www." + pregunta["i"] + "'></img>");
        }
      });
  }, 'text');

});
