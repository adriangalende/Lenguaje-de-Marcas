$( document ).ready(function() {
    $("#urlNoticia").closest("div").hide();
    $('#label-url').hide()

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
            $.post( "http://localhost:8080/mapear", $(this).val().toString(), function(data) {
                console.log(data)
                $("#titulo").val(data.titulo);
                $("#entradilla").val(data.entradilla)
                $("#texto").html(data.texto)
                tags = ""
                $("#tags").val(data.tags)
                $('#label-url').hide()

            })
        } else {
            $('#label-url').show()
        }
    });

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

        $.post( "http://localhost:8080/insertaNoticia", JSON.stringify(noticia), function(data) {
            if(data){
                $("#labelNoticia").addClass("label-success").removeClass("label-info").fadeIn().text("La noticia se ha insertado con éxito!");
            } else {
                $("#labelNoticia").addClass("label-danger").removeClass("label-info").fadeIn().text("Ya existe una noticia con el mismo titulo");
            }
        });
    });





    function getHostname(url) {
        return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];;
    }


});