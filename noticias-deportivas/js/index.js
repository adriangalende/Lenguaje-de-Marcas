$( document ).ready(function() {
    //endpoint imagenes
    var ENDPOINTIMAGES="https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/img/noticias/";
    //Indice noticias destacadas
    var NOTICIAS_POR_PAGINA = 3;
    //Indicador de cual es la proxima noticia a mostrar
    var proximaNoticia=0;
    //Contiene las noticias cargadas
    var noticias;
    var contadorNoticias = 0;

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

    });

    //Obteniendo noticias normales
    $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
        contadorNoticias = (Object.keys(data["noticias"]).length);
        //asignamos a la variable global noticias los objetos json
        noticias=data;
        //generamos las categorias disponibles en el menu
        generarCategoriasNav(data["noticias"])
        var i=1
        proximaNoticia=contadorNoticias-1;
        while( i < contadorNoticias && i <= NOTICIAS_POR_PAGINA ){
            $(".rowNoticias").append(pintarNoticia(data["noticias"][proximaNoticia],(contadorNoticias-proximaNoticia)));
            i++;
            proximaNoticia--;
        }
    });

    //Obteniendo categorias para menu
    categorias = []
    function generarCategoriasNav(noticias){
        $( noticias ).each(function( index,noticia ) {
            if($.inArray(noticia.Categoria, categorias) == -1){
                categorias.push(noticia.Categoria)
            }
        });
        pintarCategoriasNav(categorias);
    }


    function pintarCategoriasNav(categorias){
        $('.mega-menu').append("<div class=\"row categoriasNav\">")
        $( categorias ).each(function( index,categoria ) {
            $('.categoriasNav').append("<div class=\"col col"+categoria+"\">")
            $(".col"+categoria).append("<a class='linkCat"+categoria+"' href=\"#\">")
            $(".linkCat"+categoria).append("<div class=\"card cardCategoria card"+categoria+"\">")
            $(".card"+categoria).append("<img class=\"img-fluid\" src=\"./img/"+categoria+".jpg\" alt=\"\">")
            $(".card"+categoria).append("<div class=\"card-img-overlay card-img-overlay"+categoria+"\">")
            $(".card-img-overlay"+categoria).append("<h2 class=\"title-small\">"+categoria+"</h2>")
            $(".card"+categoria).append("</div>")
            $(".linkCat"+categoria).append("</div>")
            $(".col"+categoria).append("</a>")
            $('.categoriasNav').append("</div>")

        });
        $('.mega-menu').append("</div>")
    }





    function pintarNoticiaDestacada(noticia, i){
        if(i==0){
            stringNoticia = "<article id='"+noticia.idNoticia+"d' class='carousel-item active'>";
        } else {
            stringNoticia = "<article id='"+noticia.idNoticia+"d' class='carousel-item'>";
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

    function pintarNoticia(noticia, indice){
        stringNoticia = "<article id='"+noticia.idNoticia+"n' class='col-md-4'>";
        stringNoticia += "<div class=\"card mb-4\">"
        stringNoticia += "<div class=\"card-img-top\">"
        if(noticia.Video != undefined){
            stringNoticia += "<i class=\"fab fa-youtube tieneVideo\"></i>";
        }
        stringNoticia += "<span class='badge badge-danger badge-fijo'>"+noticia.Categoria+"</span>"+"<img class=\"img-fluid\" src='"+obtenerImagen(noticia.idNoticia)+"' alt=\"\">"
        //$("#"+noticia.idNoticia+"normal").find(".card-img-top").css('background-image',obtenerImagen(noticia.idNoticia))
        stringNoticia += "</div>"
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

    //funcion al clicarel titulo de una noticia
    $('#noticias').on('click', 'h3.card-title', function() {
        var idNoticia = $(this).closest('article').attr('id').split("n")[0].trim();
        //Reenvio a pagina noticia con parametro idnoticia (numero + n=normal / d=destacada)
        window.location.href = "noticia.html?idnoticia="+idNoticia+"n";
    });

    $('#carouselDestacadas').on('click', '.carousel-caption h4', function() {
        var idNoticia = $(this).closest('article').attr('id').split("d")[0].trim();
        window.location.href = "noticia.html?idnoticia="+idNoticia+"d";
    });

    //funcion controlar scroll para cargar noticias
    $(window).scroll(function (e) {
        var posicionScroll = $(window).scrollTop();
        var alturavVentana = $(window).height();
        //al llegar al 80% de la altura de nuestra ventana
        setTimeout(function(){
            if(posicionScroll + alturavVentana == $(document).height() && proximaNoticia >=0 ) {
                cargarMasNoticias();
            }
        }, 400); //timeout para scroll general
    });

    $("main").on("click","#cargarMas",function(){
        cargarMasNoticias();
    });

    //funcion que carga más noticias ( scroll y botón )
    function cargarMasNoticias(){
        console.log(proximaNoticia)

        $('#loading').fadeIn();
        setTimeout(function(){
            var i=proximaNoticia;
            var noticiaPintada=0;

            if(proximaNoticia < 0){
                $('#loading').find("p").text("no hay más noticias para cargar");
            } else {
                $("#cargarMas").prop("disabled",false);
                while ( proximaNoticia >= 0 && noticiaPintada < NOTICIAS_POR_PAGINA){
                    $(".rowNoticias").append(pintarNoticia(noticias["noticias"][i]));
                    proximaNoticia--;
                    i=proximaNoticia;
                    noticiaPintada++;
                }
                //Si la próxima noticia es menor que  significa que ya ha mostrado la ultima noticia
                if(proximaNoticia < 0){
                    $("#cargarMas").fadeOut();
                }

            }
        }, 1000); // timeout para cargar noticias
        $('#loading').fadeOut();
        $("#cargarMas").prop("disabled",true);


    }

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
    //FUNCION TESTEO RESPONSIVE
    resized=false;
    $(window).resize(function(e){
       if($(this).width() <= 980 && resized==false){
           $('.destacadas-header').closest('.col-8').removeClass('col-8').addClass('col-12');
           resized=true;
       } else if ($(this).width() > 980 && resized==true) {
           $('.destacadas-header').closest('.col-12').removeClass('col-12').addClass('col-8');
           resized=false;
       }
    });



});
