$( document ).ready(function() {
    //Indice noticias destacadas
    i = 0;
    $.getJSON( "https://api.myjson.com/bins/11q3cy", function( data ) {
        $.each(data["noticias"], function( key, noticia){
            contadorDestacadas=0;
            contadorNoticias=0;

            if(noticia.Destacada){
                $(".carousel-inner").append(pintarNoticiaDestacada(noticia, i));
                $(".carousel-indicators").append("<li data-target='#carouselDestacadas' data-slide-to=''"+i+"'></li>")
                contadorDestacadas++;
                i++;
            } else {
                $(".row").append(pintarNoticia(noticia));
            }
        });
        $("#carouselDestacadas").before()

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



    function pintarTags(tags){
        tagsHTML = ""
        $.each(tags, function( index, value ) {
            tagsHTML += " <span class=\"badge badge-light\">#"+value+"</span>"
        });
        return tagsHTML
    }

    //Funcion que comprueba si la imagen de la noticia esta en la carpeta que toca, si no pone una imagen por defecto
    function obtenerImagen(idNoticia) {
        String src="img/noticias/"+$.md5(idNoticia)+".jpg"
        $.get(src)
            .done(function() {
                // exists code
            }).fail(function() {
            src= "img/noticias/default.jpg";
        })

        return src
    }


});
