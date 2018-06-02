$( document ).ready(function() {

    $(".mega-menu").collapse();

    //Obteniendo noticias normales
    $.getJSON( "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/noticias-deportivas/resources/noticias.json", function( data ) {
        contadorNoticias = (Object.keys(data["noticias"]).length);
        //asignamos a la variable global noticias los objetos json
        noticias=data;
        //generamos las categorias disponibles en el menu
        generarCategoriasNav(data["noticias"])
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
            $(".col"+categoria).append("<a class='linkCat"+categoria+"' href=\"categorias.html?categoria="+categoria+"\">")
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

});