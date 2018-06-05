$( document ).ready(function() {

    var ENDPOINT="http://bbddproject-bbddproject.a3c1.starter-us-west-1.openshiftapps.com"
    $.post( ENDPOINT+"/cargarNoticias","all", function(data) {
        console.log(data)
        $.each(data, function( key, noticia){
            $("tbody").append("<tr>");
            $("tbody").append("<th scope=\"row\">"+noticia.idNoticia+"</th>");
            $("tbody").append("<td>"+noticia.titulo+"</td>");
            $("tbody").append("<td>"+noticia.fecha+"</td>");
            $("tbody").append("<td>" +
                "<button id='ver-"+noticia.idNoticia+"' class='btn btn-default'><i class='fa fa-eye'></i>  Ver</button> " +
                "<button id='editar-"+noticia.idNoticia+"' class='btn btn-info'><i class='fa fa-edit'></i>   Editar</button> " +
                "<button id='del-"+noticia.idNoticia+"' class='btn btn-danger' data-toggle=\"modal\" data-target=\"#modalCancelar\"><i class='fa fa-trash'></i>   Eliminar</button> "+
                "</td>");
            $("tbody").append("</tr>");
        });

    });

    $("main").on("click","button", function(){
       accion = $(this).attr("id").split("-")[0]
        idNoticia = $(this).attr("id").split("-")[1]
        if(accion == "ver"){
           verNoticia(idNoticia)
        } else if (accion == "del"){
            $('#modalCancelar').find(".modal-body").find("p").text("¿ Estás seguro de que quieres borrar la noticia "+ idNoticia+" ?")
            $('#modalCancelar').on('shown.bs.modal', function () {
                eliminado=false
                $(this).on("click",".btn-danger", function(){
                    if(!eliminado){
                        eliminarNoticia(idNoticia)
                        eliminado=true;
                    }
                });

                $(this).on("click",".btn-secondary", function(){
                    $("#modalCancelar").hide();
                });
            })
        } else if (accion == "editar"){
           editarNoticia(idNoticia)
        } else if (accion == "btn") {
            window.location="./nuevaNoticia.html";
        } else {
            alert("no conozco esta accion");
        }


    });

    function verNoticia(idNoticia){
        window.location.href = "noticia.html?idnoticia="+idNoticia+"b";
    }

    function eliminarNoticia(idNoticia){
        $.post( ENDPOINT+"/eliminarNoticia",idNoticia, function(data) {
            window.location="./dashboard.html";
        })
    }

    function editarNoticia(idNoticia){
        window.location.href = "editarNoticia.html?idnoticia="+idNoticia;
    }






});