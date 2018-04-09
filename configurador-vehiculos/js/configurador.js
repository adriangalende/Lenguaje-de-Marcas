$('document').ready(function() { //Sustituye a window.onload 

        /* Setup */

                
        var coches;
        var cochesSeleccionados;
        var combustiblesSeleccionados;
        var numeroDePuertasSeleccionadas;
        var preciosSeleccionados;
        var cochesSeleccionadosFiltro = [];
        var firstTime = true;


        $('body').on("mouseover", function(){
            if(firstTime){
                firstTime=false;
                mostrarPasoActual("paso1");
                bloquearElementos(true);
                bloquearStepWizard(1, true);
            }
        });



        /* mostrar solo el paso actual  */

        function mostrarPasoActual(pasoActual) {
            $('form').find('section').each(function(){
                if (this.id != pasoActual){$(this).css('display', 'none');}
                if (!($(this).is(':visible'))){ $('#'+pasoActual).fadeIn(); }
                $.each($('nav').find('span'), function(){
                    if ("paso"+$(this).text() == pasoActual){
                        $(this).closest('li').addClass('pasoActual');
                    } else {
                        $(this).closest('li').removeClass('pasoActual');
                    }
                });
            });
        }

        
        /* Clicamos sobre el toggle button de los fabricantes para seleccionar todos */

        $('form').on('click', '.toggle-button', function() {
            $(this).toggleClass('toggle-button-selected');
            var checkbox = $(this).find('input[type="checkbox"]');
            
            if (checkbox.is(":checked")) {
                checkbox.prop('checked', false);
                seleccionarTodos("marcas", false);
            } else {
                checkbox.prop('checked', true);
                seleccionarTodos("marcas", true);
            }
        });

        $('form').on('click', '.toggle-button-precios', function() {
            $(this).toggleClass('toggle-button-precios-selected');
            var checkbox = $(this).find('input[type="checkbox"]');
            
            if (checkbox.is(":checked")) {
                checkbox.prop('checked', false);
                seleccionarTodos("precios", false);
            } else {
                checkbox.prop('checked', true);
                seleccionarTodos("precios", true);
            }
        });



        /* Clicamos sobre cualquiera de los botones con la clase .siguientePaso */

        var diccionarioPasos = { // Como no quiero poner 1000 if, prefiero trabajar con un diccionario y hacer eval
            2: ["generarCochesSeleccionados()", "pintarPasocombustible()"],
            3: ["generarCombustiblesSeleccionados()", "pintarNumeroPuertas()"],
            4: ["generarNumeroPuertasSeleccionadas()", "pintarRangoPrecios()"],
            5: ["generarPreciosSeleccionados()", "pintarCoches()"],
        }

        $('form').on('click', '.siguientePaso', function() {
            //formato nombre id toN donde N es el proximo paso.
            var idBoton = $(this).attr('id').substring(2);
            eval(diccionarioPasos[idBoton][0])
            eval(diccionarioPasos[idBoton][1])
            mostrarPasoActual("paso"+idBoton);
            bloquearElementos(true);
            bloquearStepWizard(idBoton, true);
        });


        /* click en span wizardstep */
        $('.pasoWizard').on("click", function(){
            if (!($(this).attr('disabled'))){
                if($(this).text() == 1){pintarFabricantes();} else {eval(diccionarioPasos[$(this).text()][1])}
                mostrarPasoActual("paso"+$(this).text());
                bloquearStepWizard($(this).text());
                bloquearElementos(false);
            } 
        });

        /* Seleccionar o deseleccionar todos las marcas */
        
        function seleccionarTodos(elemento, estado) {
            if(estado) {
                $('form').find('[name="'+elemento+'"]').prop('checked', true);
                bloquearElementos(false);
            } else {
                $('form').find('[name="'+elemento+'"]').prop('checked', false);
                bloquearElementos(true);
            }
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                xmlLoader(xhttp);
            }
        };
        xhttp.open("GET", "https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/master/configurador-vehiculos/resources/carPool.xml");
        xhttp.send();


        function xmlLoader(xml){
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml.responseText,"text/xml");
            coches = xmlDoc.childNodes;
            pintarFabricantes();
        }

        /* Bloqueo de elementos para no poder acceder hasta que se cumplan ciertas condiciones */

        function bloquearElementos(estado, pasoActual) {
            $('form').find('input[type="button"]').each(function(){
                $(this).prop('disabled', estado);
                if(estado){
                    $(this).addClass('elementoBloqueado');
                } else {
                    $(this).removeClass('elementoBloqueado');
                }
                
            });
        }

        function bloquearStepWizard(pasoActual, estado){
            $.each($('nav').find('span'), function(indice, span){ 
                if( parseInt($(span).text()) > pasoActual ){
                    $(span).attr('disabled','disabled');
                    $(span).addClass('elementoBloqueado');
                    $(span).addClass('wizardStepBloqueado');
                } else {
                    $(span).removeAttr('disabled');
                    $(span).removeClass('elementoBloqueado');
                    $(span).removeClass('wizardStepBloqueado');
                }
            });
        }

        /* desbloquear elemento si ha seleccionado algún elemento en el paso actual */

        $('form').on('change', function(e){
            var arrayElementos = $(this).serializeArray();

            if( arrayElementos.length > 0) {
                $(this).find('input[type="button"]').prop('disabled', false);
                $(this).find('input[type="button"]').removeClass('elementoBloqueado');
            } else {
                $(this).find('input[type="button"]').addClass('elementoBloqueado');
            }

        });

        /* Mostrar coches disponibles */ 
        function cochesDisponibles(coches, marca){
            var disponibles = 0;
            $(coches).each(function(){
                $(this).find("maker").each(function(){
                    if($(this).text() == marca){
                        disponibles++;
                    }
                })
            });
            return disponibles;
        }

        /* Coches Seleccionados */
        function generarCochesSeleccionados() {
            cochesSeleccionados = [];
            var arrayElementos = $('form').serializeArray();
            $.each(arrayElementos, function(indice, valor){  
                if (valor.name == "marcas") {
                    cochesSeleccionados.push(valor.value);
                }
            });
        }

        /* Mostrar coches con combustible disponible segun fabricante elegido */
        function combustibleDisponible(coches, cochesSeleccionados, combustible){
            var disponibles = 0;
            $(coches).each(function(){
                $.each(cochesSeleccionados, function(indice, valor){  
                    $(coches).find("maker").each(function(){
                        if($(this).text() == valor){
                            if ($(this).parent().find("combustible").text() == combustible){
                                disponibles ++;
                            } 
                        }
                    });                    
                });
            });
            return disponibles;
        }

        /* Combustibles Seleccionados */
        function generarCombustiblesSeleccionados() {
            combustiblesSeleccionados = [];
            var arrayElementos = $('form').serializeArray();
            $.each(arrayElementos, function(indice, valor){  
                if (valor.name == "combustible") {
                    combustiblesSeleccionados.push(valor.value);
                }
            });
        } 
        
        /* Mostrar coches con numero de puerta disponible segun el fabricante y el combustible elegido */

        function puertasDisponibles(coches, cochesSeleccionados,combustiblesSeleccionados, numeroPuertas){
            var disponibles = 0;
            $(coches).each(function(){
                $.each(cochesSeleccionados, function(indice, coche){  
                    $(coches).find("maker").each(function(eCocheIndice, eCoche){
                        if($(eCoche).text() == coche){
                            $.each(combustiblesSeleccionados, function(indice, combustibleSeleccionado){ 
                                if($(eCoche).parent().find("combustible").text() == combustibleSeleccionado){
                                        if($(eCoche).parent().find("doors").text()+" puertas" == numeroPuertas){
                                            addCochesSeleccionadosFiltro($(eCoche).parent()[0]);
                                            disponibles++;
                                        }

                                }
                            });
                        }
                    });                    
                });
            });
            return disponibles;
        }

         /* Número de puertas Seleccionadas */
         function generarNumeroPuertasSeleccionadas() {
            numeroDePuertasSeleccionadas = [];
            var arrayElementos = $('form').serializeArray();
            $.each(arrayElementos, function(indice, valor){ 
                if (valor.name == "puertas") {
                    numeroDePuertasSeleccionadas.push(valor.value);
                }
            });
            addCochesSeleccionadosFiltroPuertas(numeroDePuertasSeleccionadas);
        } 

        /* Precios que hemos seleccionado para mostrar los coches */

        function generarPreciosSeleccionados() {
            preciosSeleccionados = [];
            var arrayElementos = $('form').serializeArray();
            $.each(arrayElementos, function(indice, valor){ 
                if (valor.name == "precios") {
                    preciosSeleccionados.push(valor.value);
                }
            });
        }

        /* FUNCIONES PARA PINTAR */

        var fabricantesPintados=false;
        function pintarFabricantes() {
            var marcas = obtenerMarcas($(coches));
            if(!fabricantesPintados) {
                console.log("pintamos")
                var form = $('form');
    
                // Paso1 : elegir marcas
                form.append('<section id="paso1" class="contenedor-configurador">');
                $('#paso1').append('<h3> Selecciona los fabricantes </h3>');
                $('#paso1').append('<label class="label-toggle fabricantes">Seleccionar todos los fabricantes</label> <div class="toggle-button"><span></span><input type="checkbox"/></div><br>');    
                // Pintamos todos los fabricantes que están en nuestro xml
                $.each(marcas, function(indice, valor){  
                    $('#paso1').append( '<input id="'+valor+'" name="marcas" type="checkbox" value="'+valor+'"/><label for="'+valor+'"></label>');
                    form.find('label[for="'+valor+'"]').css('background-image','url(\'images/makers/'+valor+'.png\')');
                    form.find('label[for="'+valor+'"]').append("<span class='coincidenciasFab'>"+cochesDisponibles(coches, valor)+"</span>");
                });
                $('#paso1').append('<br/><input id="to2" class="siguientePaso" type="button" value="siguiente paso">');
                form.append('</section>');
                fabricantesPintados = true;
            } else {
                $('#paso1').replaceWith("");
                fabricantesPintados = false;
                pintarFabricantes();       
            }
        }

        // Mostrar seccion donde podremos elegir el tipo de combustible
        var combustiblespintados = false;
        function pintarPasocombustible(){
            var combustibles = obtenerCombustibles($(coches));
            if (!combustiblespintados){            
            var form = $('form');
            // Paso2 : elegir combustible
            form.append('<section id="paso2" class="contenedor-configurador">');
            $('#paso2').append('<h3> ¿ Qué tipo de combustible buscas ? </h3>');
            // Pintamos todos los combustibles que están en nuestro xml
            $.each(combustibles, function(indice, valor){  
                if(combustibleDisponible(coches, cochesSeleccionados, valor) > 0){
                    $('#paso2').append( '<input id="'+valor+'" name="combustible" type="checkbox" value="'+valor+'"/><label for="'+valor+'">'+valor+'</label>');
                    form.find('label[for="'+valor+'"]').append("<br/><span class='coincidencias'>"+combustibleDisponible(coches, cochesSeleccionados, valor)+"</span>");
                }
            });
            $('#paso2').append('<br/><input id="to3" class="siguientePaso" type="button" value="siguiente paso">');
            form.append('</section>');
            combustiblespintados = true;
            } else {
                $('#paso2').replaceWith("");
                combustiblespintados = false;
                pintarPasocombustible();
            }
        }

        var numeroPuertasPintado = false;
        function pintarNumeroPuertas() { 
            var puertas = obtenerPuertas($(coches));
            if(!numeroPuertasPintado){
                var form = $('form');
                // Paso3 : elegir número de puertas
                form.append('<section id="paso3" class="contenedor-configurador">');
                $('#paso3').append('<h3> ¿ Cuántas puertas ? </h3>');
                
                $.each(puertas, function(indice, valor){  
                    if(puertasDisponibles(coches, cochesSeleccionados, combustiblesSeleccionados,valor) > 0){
                        $('#paso3').append( '<input id="'+valor+'" name="puertas" type="checkbox" value="'+valor+'"/><label for="'+valor+'">'+valor+'</label>');
                        form.find('label[for="'+valor+'"]').append("<span class='coincidencias'>"+puertasDisponibles(coches, cochesSeleccionados, combustiblesSeleccionados, valor)+"</span>");
                    }
                });
                $('#paso3').append('<br/><input id="to4" class="siguientePaso" type="button" value="siguiente paso">');
                form.append('</section>');
                numeroPuertasPintado = true;
            } else {
                $('#paso3').replaceWith("");
                numeroPuertasPintado = false;
                pintarNumeroPuertas();
            }
        }

        // Pintamos los precios encontrados segun las opciones que ha ido eligiendo el usuario
        rangoPreciosPintado = false;
        function pintarRangoPrecios() {
            var precios = obtenerPreciosOrdenados();
            if (!rangoPreciosPintado){
                var form = $('form');
                // Paso4 : elegir rango de precios
                form.append('<section id="paso4" class="contenedor-configurador">');
                $('#paso4').append('<h3> Estos son los precios que hemos encontrado </h3>');
                $('#paso4').append('<label class="label-toggle precios">Seleccionar todos los precios</label> <div class="toggle-button-precios"><span></span><input type="checkbox"/></div><br>');  
                precioAnterior = 0;
                $.each(precios, function(indice, valor){ 
                        precioActual = valor;        
                        if (preciosRepetidos(precios, valor) == 1) {
                            $('#paso4').append( '<input id="'+valor+'" name="precios" type="checkbox" value="'+valor+'"/><label for="'+valor+'">'+valor+' €</label>');
                        } else if (preciosRepetidos(precios, valor) > 1 && precioActual != precioAnterior) {
                            form.find('label[for="'+valor+'"]').append("<span class='coincidencias'>"+preciosRepetidos(precios, valor)+"</span>");
                        } else if (preciosRepetidos(precios, valor) > 1) {
                            $('#paso4').append( '<input id="'+valor+'" name="precios" type="checkbox" value="'+valor+'"/><label for="'+valor+'">'+valor+' €</label>');
                            form.find('label[for="'+valor+'"]').append("<span class='coincidencias'>"+preciosRepetidos(precios, valor)+"</span>");
                        }
                        precioAnterior = precioActual;
                });

                $('#paso4').append('<br/><input id="to5" class="siguientePaso" type="button" value="ver coches">');
                form.append('</section>');
                rangoPreciosPintado = true;
            } else {
                $('#paso4').replaceWith("");
                rangoPreciosPintado = false;
                pintarRangoPrecios();
            }
        }

        // Pintamos los coches, aqui se viene lo guapooo
        cochesPintados = false;
        function pintarCoches() {
            if (!cochesPintados) {
            var form = $('form');
            // Paso5 : Elige tu coche
            form.append('<section id="paso5" class="contenedor-configurador">');
                $('#paso5').append('<h3> Voilá, pues estos son los coches que tenemos para ti! </h3>');
                $.each(cochesSeleccionadosFiltro, function(indice, coche){
                    var cochePintado = false;
                    var precioCoche = $(coche).find("price").text();
                    var familiaCoche = $(coche).find("model").text();
                    var modeloCoche = $(coche).find("version").text();
                    var puertasCoche = $(coche).find("doors").text();
                    var emisionesCO2 = $(coche).find("co2Emission").text();
                    var marchasCoche = $(coche).find("Gearbox").text();
                    var potenciaCoche = $(coche).find("cv").text();
                    var combustibleCoche = $(coche).find("combustible").text();
                    var consumoCiudad = $(coche).find("city").text();
                    var consumoCarretera = $(coche).find("highway").text();
                    var consumoMedio = (parseInt(consumoCiudad) + parseInt(consumoCarretera))/2

                    if (preciosSeleccionados.includes(precioCoche) && !(cochePintado)){
                        shaCoche = $.sha1($(coche).find("version").text());
                        $('#paso5').append('<article id="'+shaCoche+'" class="coche">');
                        $('#'+shaCoche).append('<div class="imagen-coche"></div>');
                            $('#'+shaCoche).find('.imagen-coche').css('background-image', 'url(./images/cars/'+shaCoche+'.jpg)');
                            $('#'+shaCoche).append('<label class="modelo-coche">'+familiaCoche+' - ' + modeloCoche +'</label>');
                            $('#'+shaCoche).append('<label class="puertas-coche"><i></i><span>'+puertasCoche+' puertas<span></label>');
                            $('#'+shaCoche).append('<label class="emisiones-coche"><i></i><span>'+emisionesCO2+' g/km<span></label>');
                            $('#'+shaCoche).append('<label class="marchas-coche"><i></i><span>'+marchasCoche+'<span></label>');
                            $('#'+shaCoche).append('<label class="potencia-coche"><i></i><span>'+potenciaCoche+' cv<span></label>');
                            $('#'+shaCoche).append('<label class="combustible-coche"><i></i><span>'+combustibleCoche+'<span></label>');
                            $('#'+shaCoche).append('<label class="consumo-ciudad"><i></i><span>'+consumoCiudad+' l/100<span></label>');
                            $('#'+shaCoche).append('<label class="consumo-carretera"><i></i><span>'+consumoCarretera+' l/100<span></label>');
                            $('#'+shaCoche).append('<label class="consumo-medio"><i></i><span>'+consumoMedio+' l/100<span></label>');
                            $('#'+shaCoche).append('<label class="precio-coche"><i></i><span>'+precioCoche+' €<span></label>');

                        $('#paso5').append('</article>');
                        //cochePintado=true;
                    }
                });
                form.append('</section>');
                cochesPintados = true;
            } else {
                $('#paso5').replaceWith("");
                cochesPintados = false;
                pintarCoches();
            }
        }


        /* FUNCIONES PARA OBTENER DATOS */

        function obtenerMarcas(coches) {
            var marcas = [];
            $.each(coches.find("maker"), function( indice, valor){
                if (!(marcas.includes(valor.innerHTML))) {
                    marcas.push(valor.innerHTML);
                }
            });
            return marcas;
        }

        function obtenerCombustibles(coches) {
            var combustibles = []
            $.each(coches.find("combustible"), function( indice, valor){
                if (!(combustibles.includes(valor.innerHTML))) {
                    combustibles.push(valor.innerHTML);
                }
            });
            return combustibles;        
        }

        function obtenerPuertas(coches) {
            var puertas = []
            $.each(coches.find("doors"), function( indice, valor){
                if (!(puertas.includes(valor.innerHTML+ " puertas"))) {
                    puertas.push(valor.innerHTML + " puertas");
                }
            });
            return puertas;        
        }


        var versionesAnteriores = [];
        function addCochesSeleccionadosFiltro(coche, numeroPuertas){
            versionActual = $(coche).find("version").text();
            if ($.isEmptyObject(coche) || versionesAnteriores.includes(versionActual) ) {
            } else {
                cochesSeleccionadosFiltro.push(coche);
            }
            versionesAnteriores.push(versionActual);
        }

        function addCochesSeleccionadosFiltroPuertas(numeroDePuertasSeleccionadas){
            var indicesBorrar = [];
            $.each(cochesSeleccionadosFiltro, function(indice, coche){
                if (!(numeroDePuertasSeleccionadas.includes($(coche).find("doors").text()+" puertas"))){
                    indicesBorrar.push(indice);
                }
            });
            
            $.each(indicesBorrar, function(indice, valor){
                cochesSeleccionadosFiltro.splice( $.inArray(valor, cochesSeleccionadosFiltro), 1 );
            });
        }

        function obtenerPreciosOrdenados() {
            precio = [];
            $.each(cochesSeleccionadosFiltro, function( indice, coche){
                precio.push($(coche).find("price").text());
            });

            precio.sort(function(a, b) { return a - b });
            return precio;
        }

        function obtenerPrecioMedio(precios){
            var precioMedio = 0;
            $.each(precios, function( indice, precio){
                precioMedio += parseInt(precio);
            });
            return precioMedio/precios.length;
        }

        function preciosRepetidos(precios, precio) {
            var repetidos = 0;
            $.each(precios, function( indice, valor){
                if (valor == precio){
                    repetidos++;
                }
            });
            return repetidos;
        }
 });

 