$( document ).ready(function() {
    var noticiaObtenida;

    $.parametro = function(keyParametro){
        var results = new RegExp('[\?&]' + keyParametro + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return decodeURI(results[1]) || 0;
        }
    }


    $.post( "http://localhost:8080/cargarNoticia",$.parametro("idnoticia"), function(data) {
        if(data != ""){
            noticiaObtenida = data;
            $("#titulo").val(data.titulo);
            $("#entradilla").val(data.entradilla);
            $("#texto").val(data.texto);
            $("#categoria").val(data.categoria);
            tags = []
            $.each(data.tags, function( key, tag){
                tags.push(tag.split('"')[1]);
            });
            $("#tags").val(tags)
        } else {

        }

    }).fail(function(){
        console.log("error")
    });

    //Al cambiar los campos de nuestro formulario nos aseguramos de que esten todos los campos rellenados
    $('#formEditar').change(function(){
        if(isFilled($("#titulo").val()) && isFilled($("#entradilla").val()) && isFilled($("#texto").val()) && isFilled($("#tags").val())){
            $("#btn-editarNoticia").attr("disabled", false);
        } else {
            $("#btn-editarNoticia").attr("disabled", true);
        }

    });

    //al hacer click en editar noticia
    $('#formEditar').on('click','#btn-editarNoticia', function(){
        var noticia = new Object();
        noticia.Titulo=$("#titulo").val()

        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();

        noticia.Fecha=((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();
        noticia.id = noticiaObtenida.idNoticia;
        noticia.Entradilla=$("#entradilla").val();
        noticia.Texto= $("#texto").val();
        noticia.Tags= $("#tags").val().split(",");
        noticia.Categoria = $("#categoria").val();
        console.log(JSON.stringify(noticia))

        $.post( "http://localhost:8080/editarNoticia", JSON.stringify(noticia), function(data) {
            if(data){
                $("#labelNoticia").addClass("alert-success").removeClass("label-info").text("La noticia se ha actualizado con éxito!").fadeIn();
                setTimeout(function(){
                    $("#labelNoticia").fadeOut();
                }, 1200);
            } else {
                $("#labelNoticia").addClass("alert-danger").removeClass("label-info").text("Ha ocurrido un problema al intentar actualizar la noticia").fadeIn();
            }
        });
    });


    $("#formEditar").on("click", "#btn-borrarNoticia", function(){
        $('#modalCancelar').find(".modal-body").find("p").text("¿ Estás seguro de que quieres borrar la noticia ?")
        $('#modalCancelar').on('shown.bs.modal', function () {
            eliminado=false
            $(this).on("click",".btn-danger", function(){
                if(!eliminado){
                    eliminarNoticia(noticiaObtenida.idNoticia.toString())
                    eliminado=true;
                }
            });

            $(this).on("click",".btn-secondary", function(){
                $("#modalCancelar").hide();
            });
        })
    });

    function eliminarNoticia(idNoticia){
        $.post( "http://localhost:8080/eliminarNoticia",idNoticia, function(data) {
            window.location="./dashboard.html";
        })
    }

    function isFilled(item){
        if(item != null && item != ""){
            return true
        }
        return false;
    }



});