$( document ).ready(function() {
    //metodo que obtiene el parametro que le solicitas, lo obtiene de la url
   const ENDPOINT_REDIRECCION = "index.html";
   var jsonNoticias;

    $.parametro = function(keyParametro){
        var results = new RegExp('[\?&]' + keyParametro + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }

    //Enviar noticia por ajax a spring
    $.ajax({
        url:"http://localhost/mapear",
        type:"POST",
        contentType: "application/json; charset=utf-8",
        data: {"url":"https://as.com/motor/2018/05/27/formula_1/1527421587_847056.html"},
        async: false,    //Cross-domain requests and dataType: "jsonp" requests do not support synchronous operation
        cache: false,    //This will force requested pages not to be cached by the browser
        processData:false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader('Access-Control-Allow-Origin: *');
            xhr.setRequestHeader('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
            xhr.setRequestHeader('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
        },
        success: function(resposeJsonObject){
            console.log(resposeJsonObject);
            console.log("ok")
        }
    });


    if($.parametro("idnoticia") != null && $.parametro("idnoticia") != 0){
        tipoNoticia = $.parametro("idnoticia").slice(-1);
        if(tipoNoticia == "d" || tipoNoticia == "n" ){
            tratarNoticia($.parametro("idnoticia"))
        } else {
            window.location.href = ENDPOINT_REDIRECCION;
        }
    } else {
        window.location.href = ENDPOINT_REDIRECCION;
    }




    function tratarNoticia(idNoticia){
        if($.parametro("idnoticia").slice(-1) == "d"){
            $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/destacadas.json", function( data ) {
                jsonNoticias=data;
                $("main").append(pintarNoticiaDestacada(idNoticia.split("d")[0], jsonNoticias));
            });
        } else {
            $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
                jsonNoticias = data;
                $("main").append(pintarNoticia(idNoticia.split("n")[0], jsonNoticias));
            });

        }
    }


    function pintarNoticia(idNoticia, jsonNoticias){
        noticiaSeleccionada = _.find(jsonNoticias["noticias"],function(noticia){ return noticia.idNoticia == idNoticia});
        if(existeNoticia(noticiaSeleccionada)){
            return JSON.stringify(noticiaSeleccionada)
        }
    }

    function pintarNoticiaDestacada(idNoticia, jsonNoticias){
        noticiaSeleccionada = _.find(jsonNoticias["destacadas"],function(noticia){ return noticia.idNoticia == idNoticia});
        if(existeNoticia(noticiaSeleccionada)){
            return JSON.stringify(noticiaSeleccionada)
        }
    }

    function existeNoticia(noticiaSeleccionada){
        if(noticiaSeleccionada == null) {
            window.location.href = ENDPOINT_REDIRECCION;
        }
        return true
    }


});