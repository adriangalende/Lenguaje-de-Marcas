$( document ).ready(function() {
    //endpoint imagenes
    var ENDPOINTIMAGES="https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/img/noticias/";
    //metodo que obtiene el parametro que le solicitas, lo obtiene de la url
   const ENDPOINT_REDIRECCION = "index.html";
   var jsonNoticias;
   var noticiaSeleccionada=""

    $.parametro = function(keyParametro){
        var results = new RegExp('[\?&]' + keyParametro + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }


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
            $("#noticia").html(noticeBuilder(noticiaSeleccionada));
        }
    }

    function pintarNoticiaDestacada(idNoticia, jsonNoticias){
        noticiaSeleccionada = _.find(jsonNoticias["destacadas"],function(noticia){ return noticia.idNoticia == idNoticia});
        if(existeNoticia(noticiaSeleccionada)){
            $("#noticia").html(noticeBuilder(noticiaSeleccionada));
        }
    }

    function noticeBuilder(noticiaSeleccionada){
        //GENERO METATAGS OPENGRAPH Y TITULO
        $(document).attr("title", noticiaSeleccionada.Titulo);
        $("meta[property='og\\:title']").attr("content", noticiaSeleccionada.Titulo);
        $("meta[property='og\\:type']").attr("content", "article:"+noticiaSeleccionada.Fecha);
        $("meta[property='og\\:url']").attr("content", window.location.href);
        $("meta[property='og\\:image']").attr("content", obtenerImagen(noticiaSeleccionada.idNoticia));
        noticia = "";
        noticia += "<img id=\"imagenNoticia\" class='img-responsive' src='"+obtenerImagen(noticiaSeleccionada.idNoticia)+"' alt=''/>";

        if (noticiaSeleccionada.Tags != undefined ){
            noticia +="<p id='tags'>Tags: ";
            $(noticiaSeleccionada.Tags).each(function(i,tag){
                noticia += "<span class='badge  badge-secondary'>"+tag+"</span>&nbsp;";
            });
            noticia +="</p>";
        }
        noticia += "<h2>" + noticiaSeleccionada.Titulo + "</h2>";
        noticia += "<h5 class='text-muted'>" + noticiaSeleccionada.Entradilla + "</h5>";

        alert(noticiaSeleccionada.Video);

        noticia += "<p>" + noticiaSeleccionada.Texto + "</p>";

        //agregamos el titulo de la noticia en el breadcrumb
        $("#breadcrumbNoticia").text(noticiaSeleccionada.Titulo);
        return noticia;
    }

    function existeNoticia(noticiaSeleccionada){
        if(noticiaSeleccionada == null) {
            window.location.href = ENDPOINT_REDIRECCION;
        }
        return true
    }

    function obtenerImagen(idNoticia) {
        var src=""
        $.ajax({
            url: ENDPOINTIMAGES+$.md5(idNoticia)+".jpg",
            type: 'GET',
            async:false,
            success: function(data) {
                src=ENDPOINTIMAGES+$.md5(idNoticia)+".jpg";
            },
            error: function(data) {
                src=ENDPOINTIMAGES+"default.jpg";
            }
        });

        return src;
    }


});