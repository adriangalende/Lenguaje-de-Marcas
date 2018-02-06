window.onload = function() {
    document.getElementById("mainImage").addEventListener("click", function(e){
        var parrafos = document.getElementsByTagName("p");
        
		var para = document.createElement("P");                       
		var t = document.createTextNode("");   
		
		para.append("Antes habia " + parrafos.length + 
		" parrafos, ahora hay " + (parrafos.length +1 ) + "");
		
		parrafos[parrafos.length-2].appendChild(para); 


    
    });
  };