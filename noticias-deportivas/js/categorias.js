$( document ).ready(function() {
    //endpoint imagenes
    var ENDPOINTIMAGES="https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/img/noticias/";
    var ENDPOINT_REDIRECCION="./index.html"
    //Indice noticias destacadas
    var NOTICIAS_POR_PAGINA = 3;
    //Indicador de cual es la proxima noticia a mostrar
    var proximaNoticia=0;
    //Contiene las noticias cargadas
    var noticias;
    var contadorNoticias = 0;



    $.parametro = function(keyParametro){
        var results = new RegExp('[\?&]' + keyParametro + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            var categorias = ["Fútbol","Motociclismo","Ciclismo"];
            if(decodeURI(results[1]) != null || decodeURI(results[1]) != 0 ){
                if($.inArray(decodeURI(results[1]),categorias) != -1){
                    return decodeURI(results[1]) || 0;
                } else {
                    window.location.href = ENDPOINT_REDIRECCION;
                }
            } else {
                window.location.href = ENDPOINT_REDIRECCION;
            }
            return decodeURI(results[1]) || 0;
        }
    }

    var categoria = $.parametro("categoria");

    $("#noticias").find("h5").text("Noticias de " + categoria)


    //Obteniendo noticias normales
    $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
        contadorNoticias = (Object.keys(data["noticias"]).length);
        //asignamos a la variable global noticias los objetos json
        noticias=data;
        //generamos las categorias disponibles en el menu
        var i=1
        proximaNoticia=contadorNoticias-1;
        while( i < contadorNoticias && i <= NOTICIAS_POR_PAGINA ){
            $(".rowNoticias").append(pintarNoticia(data["noticias"][proximaNoticia],(contadorNoticias-proximaNoticia)));
            i++;
            proximaNoticia--;
        }
    });


    //funcion al clicar el titulo de una noticia
    $('#noticias').on('click', 'h3.card-title', function() {
        var idNoticia = $(this).closest('article').attr('id').split("n")[0].trim();
        //Reenvio a pagina noticia con parametro idnoticia (numero + n=normal / d=destacada)
        window.location.href = "noticia.html?idnoticia="+idNoticia+"n";
    });




    function pintarNoticia(noticia, indice){
            if(noticia.Categoria == categoria){
                stringNoticia = "<article id='"+noticia.idNoticia+"' class='col-12'>";
                stringNoticia += "<div class=\"card mb-4\">"
                stringNoticia += "<div class=\"card-img-top\">"
                if(noticia.Video != undefined){
                    stringNoticia += "<i class=\"fab fa-youtube tieneVideo\"></i>";
                }
                stringNoticia += "<img class=\"img-fluid\" src='"+obtenerImagen(noticia.idNoticia)+"' alt=\"\">"
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
    }

    //funcion al clicarel titulo de una noticia
    $('#noticias').on('click', 'h3.card-title', function() {
        var idNoticia = $(this).closest('article').attr('id').split("n")[0].trim();
        //Reenvio a pagina noticia con parametro idnoticia (numero + n=normal / d=destacada)
        window.location.href = "noticia.html?idnoticia="+idNoticia+"n";
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
