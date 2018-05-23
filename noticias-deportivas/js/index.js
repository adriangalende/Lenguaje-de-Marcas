$( document ).ready(function() {
    //endpoint imagenes
    ENDPOINTIMAGES="https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/img/noticias/";
    //Indice noticias destacadas
    NOTICIAS_POR_PAGINA = 3;
    //Indicador de cual es la proxima noticia a mostrar
    proximaNoticia=0;
    //Contiene las noticias cargadas
    noticias;

    //obteniendo noticias destacadas
    $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/destacadas.json", function( data ) {
        var i=0;
        $.each(data["destacadas"], function( key, noticia){
            contadorDestacadas=0;
            $(".carousel-inner").append(pintarNoticiaDestacada(noticia, i));
            $(".carousel-indicators").append("<li data-target='#carouselDestacadas' data-slide-to=''"+i+"'></li>")
            contadorDestacadas++;
            i++;

        });
        $("#carouselDestacadas").before()

    });

    //Obteniendo noticias normales
    $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
        contadorNoticias = (Object.keys(data["noticias"]).length);
        //asignamos a la variable global noticias los objetos json
        noticias=data;
        var i=1
        proximaNoticia=contadorNoticias-1;
        while( i < contadorNoticias && i <= NOTICIAS_POR_PAGINA ){
            $(".row").append(pintarNoticia(data["noticias"][proximaNoticia]));
            i++;
            proximaNoticia--;
        }
    });

    function pintarNoticiaDestacada(noticia, i){
        if(i==0){
            stringNoticia = "<article id='"+noticia.idNoticia+"' class='carousel-item active'>";
        } else {
            stringNoticia = "<article id='"+noticia.idNoticia+"' class='carousel-item'>";
        }
        stringNoticia += "<h3><span class=\"badge badge-categoria\">"+noticia.Categoria+"</span></h3>"
        stringNoticia += "<img class='img-responsive' src='"+obtenerImagen(noticia.idNoticia)+"' alt=''/>";
        stringNoticia += "<div class='carousel-caption'>";
        stringNoticia +=   pintarTags(noticia.Tags);
        stringNoticia += "<h4>" + noticia.Titulo + "</h4>";
        stringNoticia += "</div>"
        stringNoticia += "</article>"
        return stringNoticia;
    }

    function pintarNoticia(noticia){
        stringNoticia = "<article id='"+noticia.idNoticia+"' class='col-md-4'>";
        stringNoticia += "<div class=\"card mb-4\">"
        stringNoticia += "<img class=\"img-fluid\" src='"+obtenerImagen(noticia.idNoticia)+"' alt=\"\">"
        stringNoticia += "<div class=\"card-body p-2\">"
        stringNoticia += "<p class=\"card-text center\">"+pintarTags(noticia.Tags)+"</p>"
        stringNoticia += "<h3 class='card-title'>" + noticia.Titulo + "</h3>";
        stringNoticia += "<p>" + noticia.Entradilla + "</p>";
        stringNoticia += "<small class=\\\"text-muted\\\">   <i class='fa fa-user'></i>  "+noticia.Usuario+", "+noticia.Fecha+"</small></p>"
        stringNoticia += "</div>"

        stringNoticia += "</div>"
        stringNoticia += "</article>"
        return stringNoticia;
    }

    //funcion controlar scroll para cargar noticias
    $(window).scroll(function (e) {
        var posicionScroll = $(window).scrollTop();
        var alturavVentana = $(window).height();
        //al llegar al 80% de la altura de nuestra ventana

        //$(window).scrollTop() + $(window).height() == $(document).height()
        if(posicionScroll + alturavVentana == $(document).height() && proximaNoticia >=0 ) {
            $('#loading').fadeIn();
            var i=proximaNoticia;
            var noticiaPintada=0;
            setTimeout(function(){
                while ( proximaNoticia >= 0 && noticiaPintada < NOTICIAS_POR_PAGINA){
                    $(".row").append(pintarNoticia(noticias["noticias"][i]));
                    proximaNoticia--;
                    i=proximaNoticia;
                    noticiaPintada++;
                }
            }, 1000);

            $('#loading').fadeOut();
        }
    });

    function pintarTags(tags){
        tagsHTML = ""
        $.each(tags, function( index, value ) {
            tagsHTML += " <span class=\"badge badge-light\">#"+value+"</span>"
        });
        return tagsHTML
    }

    //Funcion que comprueba si la imagen de la noticia esta en la carpeta que toca, si no pone una imagen por defecto
    function obtenerImagen(idNoticia) {
        var src=""
        $.ajax({
            url: ENDPOINTIMAGES+$.md5(idNoticia)+".jpg",
            type: 'GET',
            success: function(data) {
                src = ENDPOINTIMAGES+$.md5(idNoticia)+".jpg";
            },
            error: function(data) {
                    src= ENDPOINTIMAGES+"default.jpg";

            },
            complete: function(data){
                return src;
            }
        });
    }


});
