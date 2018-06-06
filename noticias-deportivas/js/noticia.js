$( document ).ready(function() {
    //endpoint imagenes
    var ENDPOINTIMAGES="https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/img/noticias/";
    var ENDPOINT="https://bbddproject-bbddproject.a3c1.starter-us-west-1.openshiftapps.com";
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

        //tipos de noticias
        //n= normal
        //d=destacada
        //b=base de datos
        if(tipoNoticia == "d" || tipoNoticia == "n" || tipoNoticia == "b" ){
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
        } else if ($.parametro("idnoticia").slice(-1) == "n") {
            $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
                jsonNoticias = data;
                $("main").append(pintarNoticia(idNoticia.split("n")[0], jsonNoticias));
            });

        } else {
            $.post( ENDPOINT+"/cargarNoticia",idNoticia.split("b")[0], function(data) {
                if(data != "" || data != null) {
                    //Convertimos a objeto noticia porque el json muestra las keys distintas
                    var noticia = new Object();
                    noticia.idNoticia = data.idNoticia;
                    noticia.Titulo = data.titulo;
                    noticia.Categoria=data.categoria;
                    noticia.Fecha=data.fecha;
                    noticia.Entradilla=data.entradilla;
                    noticia.Texto=data.texto;
                    tags = []
                    $.each(data.tags, function( key, tag){
                        tags.push(tag.split('"')[1]);
                    });
                    noticia.Tags=tags;
                    noticia.Usuario=data.usuario;
                    $("#noticia").html(noticeBuilder(noticia));
                } else {
                    window.location="./index.html"
                }
            });
        }
    }


    function pintarNoticia(idNoticia, jsonNoticias){
        noticiaSeleccionada = _.find(jsonNoticias["noticias"],function(noticia){ return noticia.idNoticia == idNoticia});

        if(existeNoticia(noticiaSeleccionada)){
            $("#noticia").html(noticeBuilder(noticiaSeleccionada));
            if(noticiaSeleccionada.Video != undefined){
                $('.text-muted').append("<div class='embed-responsive embed-responsive-16by9 videoNoticia'><iframe class='embed-responsive-item' src='"+noticiaSeleccionada.Video+"'></iframe></div>")
            }
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

        noticia += "<p>" + noticiaSeleccionada.Texto + "</p>";

        //agregamos el titulo de la noticia en el breadcrumb
        $(".breadcrumb").append("<a class='breadcrumb-item' href='./index.html'> Inicio </a>")
        categoria = noticiaSeleccionada.Categoria
        $(".breadcrumb").append("<a class='breadcrumb-item' href='./categorias.html?categoria="+categoria+"'>"+categoria+"</a>")
        $(".breadcrumb").append(" <span id=\"breadcrumbNoticia\" class=\"breadcrumb-item active\"></span>");
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


    $("#share").jsSocials({
        shares: ["twitter", "facebook", "linkedin"]
    });

});