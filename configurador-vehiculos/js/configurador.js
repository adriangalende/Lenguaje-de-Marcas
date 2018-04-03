$(document).ready(function() { //Sustituye a window.onload 
   /* $('form').click(function(){
        console.log($(this).serialize())
    });*/
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            Sala(xhttp);
        }
    };
    xhttp.open("GET", "../resources/carPool.xml");
    xhttp.send();


    function Sala(xml){
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml.responseText,"text/xml");
        console.log(xmlDoc)


    }
});