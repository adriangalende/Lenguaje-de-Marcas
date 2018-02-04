# Proyecto autoescuela


![headerTest](https://raw.githubusercontent.com/adriangalende/Lenguaje-de-Marcas/desarrollo/proyecto%20Test%20Autoescuela/resources/images/banner.jpg)

---
El proyecto de página web que he pensado para realizar ha sido sobre test de autoescuela.

 El objetivo del proyecto es simple, pero puede ser muy útil para gente que quiera sacarse el carnet



## Requisitos:
He intentado utilizar todos los recursos que hemos estado aprendiendo desde el inicio del módulo y creo que lo he conseguido:

* HTML5
* CSS ( amago de responsive )
* JavaScript ( Incluimos jQuery )
* Uso de Sprites
* Uso iconos fuentes externas
* Carga de ficheros JSON
* Serialize de datos proporcionados por el formulario

---
## Estructura:

* Tenemos un archivo .json, en el que hemos almacenado 30 preguntas típicas de los test de autoescuela
* mostraremos n preguntas ( lo normal en los test son 30)
* obtenemos una lista con números aleatorios ( desde el 1 hasta n , donde n es la cantidad de preguntas que tenemos en nuestro archivo json )
* Puedes realizar los test de dos formas
    * Modo fácil:
        *  tienes las n preguntas una tras otra, puedes cambiar de opción si te has equivocado 
        * no hay tiempo límite. 
        * Debes responder a todas las preguntas
    * Modo difícil: 
        *  Vas respondiendo las preguntas una a una y no puedes cambiar la opción elegida
        * Tienes X minutos para responder al test, si no, las preguntas que no hayas respondido se darán como malas.

En ambos  modos podrás ver la opción correctay la explicación de las preguntas que hayas fallado

---

He utilizado como fuente de información la página   www.todotest.com 