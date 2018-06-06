$( document ).ready(function() {
    var ENDPOINT="https://bbddproject-bbddproject.a3c1.starter-us-west-1.openshiftapps.com";

    $("#urlNoticia").closest("div").hide();
    $('#label-url').hide()
    $("#anadirNoticia").attr('disabled',true)
    $('#formUrl').on('click', '.form-check-input', function() {
        if($(this).attr('checked', true)){
          $('#urlNoticia').val("");
          $('#urlNoticia').prop("disabled", false );
        } else {
            $('#urlNoticia').prop("disabled", true );
        }
        $("#urlNoticia").closest("div").fadeToggle();
    });

    $('#formUrl').on('change', '#urlNoticia', function() {
        console.log(getHostname($(this).val()) == "as.com")
        if(getHostname($(this).val()) == "as.com"){
            $.post( ENDPOINT+"/mapear", $(this).val().toString(), function(data) {
                console.log(data)
                $("#titulo").val(data.titulo);
                $("#entradilla").val(data.entradilla)
                $("#texto").html(data.texto)
                $("#categoria").val(data.categoria)
                tags = ""
                $("#tags").val(data.tags)
                $('#label-url').hide()

            });
            $("#anadirNoticia").attr("disabled", false).fadeIn();
        } else {
            $('#label-url').show()
        }
    });

    $('#addNoticia').change(function(){
        if(isFilled($("#texto").val()) && isFilled($("#tags").val()) && isFilled($("#titulo").val())){
            $("#anadirNoticia").attr("disabled", false).fadeIn();
        }

    });



    function isFilled(input){
        if(input != null && input != ""){
            return true;
        }
        return false;
    }

    $('#addNoticia').on('click','#anadirNoticia', function(){
        var noticia = new Object();
        noticia.id=0
        noticia.Titulo=$("#titulo").val()

        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();

        noticia.Fecha=((''+day).length<2 ? '0' : '') + day + '/' + ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();

        noticia.Entradilla=$("#entradilla").val();
        noticia.Texto= $("#texto").val();
        noticia.Tags= $("#tags").val().split(",");
        console.log(JSON.stringify(noticia))

        $.post( ENDPOINT+"/insertaNoticia", JSON.stringify(noticia), function(data) {
            if(data == "ok"){
                $("#formUrl").trigger("reset");
                $("#addNoticia").trigger("reset");
                $("anadirNoticia").attr("disabled", true).fadeOut();
                $("#labelNoticia").addClass("alert-success").removeClass("label-info").text("La noticia se ha insertado con éxito!").fadeIn();
            } else {
                $("#labelNoticia").addClass("alert-danger").removeClass("label-info").text("Ya existe una noticia con el mismo titulo").fadeIn();
            }
        });
    });





    function getHostname(url) {
        return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];;
    }


});