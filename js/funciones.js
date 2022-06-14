const URL = '164.92.84.70:3000';

// "encabezados" es un objeto con los nombres de las tablas como llave y una lista de los nombres de las columnas para ser usadas por las funciones que crean el contenido del archivo tabla.html
const   encabezados = {
        'cliente'   :   ["id_cliente","dv","nombres","apellidos","email","celular","fecha_registro"],
        'gestion'   :   ["id_gestion","id_usuario","id_cliente","id_tipo_gestion","id_resultado","comentarios","fecha_registro"],
        'resultado' :   ["id_resultado","nombre_resultado","fecha_registro"],
        'tipo_gestion' :["id_tipo_gestion","nombre_tipo_gestion","fecha_registro"],
        'usuario'   :   ["id_usuario","dv","nombres","apellidos","email","celular","username","password","fecha_registro"]
        }

// "encabezados_b" es un objeto con los nombres de las tablas como llave y una lista de los nombres de las columnas sin incluir los datos que el usuario no debe ser capaz de ingresar para ser usadas por las funciones que crear el contenido del archivo formulario.html 
const   encabezados_b = {
        'cliente'   :   ["id_cliente","dv","nombres","apellidos","email","celular"],
        'gestion'   :   ["id_usuario","id_cliente","id_tipo_gestion","id_resultado","comentarios"],
        'resultado' :   ["nombre_resultado"],
        'tipo_gestion' :["nombre_tipo_gestion"],
        'usuario'   :   ["id_usuario","dv","nombres","apellidos","email","celular","username","password"]
        }

// funciones para interactuar con la api
const agregar = () => {
    // funcion que ingresar un nuevo dato dentro de cualquier tabla

    const tabla = obtener_variable_url('tabla'); //se obtiene el nombre de la tabla donde hacer el cambio
    const objeto = crear_objeto_raw(tabla); //se obtienen los datos que se van a inyectar
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    
    let raw = JSON.stringify(objeto);

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://${URL}/api/${tabla}`, requestOptions)
        .then(response => {  
            alert((response.status == 200) ? "Se pudo ingresar el registro" : "No se pudo ingresar el registro")
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

const actualizar = () => {
    // funcion para actualizar cualquier dato en cualquier tabla

    const tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla donde hacer el cambio
    const objeto = crear_objeto_raw(tabla); // se obtienen los datos que se van a inyectar
    const id_campo = obtener_variable_url('id'); // se obtiene el id del dato que se va a alterar

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify(objeto);

    let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://${URL}/api/${tabla}/${id_campo}`, requestOptions)
    .then(response => {  
        alert((response.status == 200) ? "Se pudo actualizar el registro" : "No se pudo actualizar el registro")
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const eliminar = () => {
    // funcion para eliminar un dato detro de una tabla

    const tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla 
    const id_campo = obtener_variable_url('id'); // se obtiene el id del dato que se va a eliminar

    let requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch(`http://${URL}/api/${tabla}/${id_campo}`, requestOptions)
        .then(response => {  
            alert((response.status == 200) ? "Se pudo eliminar el registro" : "No se pudo eliminar el registro")
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

const obtener = () => {
    // funcion para obtener todos los datos de cualquier tabla 

    const tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla

    if (tabla === 'gestion'){ // la tabla gestion necesita una funcion distinta por razones de funcionalidad 
        obtener_gestion();
    } else {
        crear_encabezados(tabla); // se crean los encabezados de las tablas

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        fetch(`http://${URL}/api/${tabla}?_size=100`, requestOptions)
            .then(response => response.json())
            .then((json) => json.forEach(crear_contenido_tabla))
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
}

const obtener_gestion = () => {
    // crea el contenido de la tabla gestion 

    let titulos = document.querySelector(`#encabezado`)
    titulos.innerHTML += 
    `
        <th>id_gestion
        <th>cliente</th>
        <th>usuario</th>
        <th>comentarios</th>
        <th>tipo_gestion</th
        ><th>resultado</th>
        <th>fecha_registro</th>
    `
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
    "query": "select g.id_gestion,CONCAT(c.nombres, ' ',c.apellidos) as cliente,CONCAT(u.nombres, ' ',u.apellidos) as usuario,g.comentarios,tg.nombre_tipo_gestion as 'tipo gestión',r.nombre_resultado as resultado,g.fecha_registro from gestion g,cliente c, usuario u, tipo_gestion tg,resultado r where g.id_cliente = c.id_cliente and g.id_usuario = u.id_usuario and g.id_resultado = r.id_resultado and g.id_tipo_gestion = tg.id_tipo_gestion"
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`http://${URL}/dynamic`, requestOptions)
    .then(response => response.json())
    .then((json) => json.forEach(crear_contenido_tabla))
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

const obtener_uno = (funcion) => {
    // obtiene cualquier dato de cualquier tabla 
    // se ingresa como variable la funcion sobre la que va a iterar el forEach

    const tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla para hacer la consulta
    const id = obtener_variable_url('id'); // se obtine el id del dato que se quiere consultar

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    fetch(`http://${URL}/api/${tabla}/${id}`, requestOptions)
        .then(response => response.json())
        .then((json) => json.forEach(funcion))
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

const obtener_comprobacion = (id_input) => {
    // comprueba si una id existe detro de los campos de una tabla

    id = document.querySelector(`#${id_input}`).value; // capturar el varor interno del input
    tabla = id_input.slice(3); // id_input viene en el formato id_(nombre_tabla), se cortan las primeras 3 letras  para quedar solo con el nombre de la tabla

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    
    fetch(`http://${URL}/api/${tabla}/${id}`, requestOptions)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            alert((response[0][`id_${tabla}`] == id) ? 'Existe en la base de datos' : 'No existe en la base de datos' )
        })
        .catch(error => {
            alert('No existe en la base de datos')
            console.log('error', error)
        });
}

// funciones para generar elementos html del archivo tabla.html 

const crear_encabezados = () => {
    // esta funcion toma todos los encabezados y los genera un encabezado en la tabla

    tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla 
    thead_table = document.querySelector('#encabezado');

    for (const encabezado of encabezados[tabla]) {
        thead_table.innerHTML += `<th>${encabezado}</th>`;
    }
    thead_table.innerHTML += `<th> acciones </th>`;
}

const crear_contenido_tabla = (elemento,index,arreglo) =>{
    // toma la consulta a la api y procesa los datos para ser mostrados en el archivo tabla.html

    let tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla
    let objeto = Object.keys(elemento) // se obtiene las llaves del elemento 
    let fila = '<tr>'
    for (const llave in elemento) {
        fila += `<td>${elemento[llave]}</td>`
    }
    // console.log(elemento);
    fila += 
    `<td>
        <a href = formulario.html?tabla=${tabla}&id=${elemento[objeto[0]]}&accion=eliminar> 
            <button class="btn btn-outline-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
            </button> 
        </a>
        <a href = "formulario.html?tabla=${tabla}&id=${elemento[objeto[0]]}&accion=editar"> 
            <button class="btn btn-outline-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </button> 
        </a>
    </td>
    `
    arreglo[index] = document.querySelector("tbody").innerHTML += fila;
    arreglo[index] = document.querySelector("tbody").innerHTML += '</tr>';
}

// funciones para generar elementos html en el archivo formulario.html

const crear_formulario = () => {

    const accion = obtener_variable_url('accion'); //se obtiene la accion para la que se crea el formulario
    const tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla
    const formulario = document.querySelector('fieldset'); // se hace una referencia al fieldset
    let lista_encabezados = (accion === 'eliminar') ? encabezados : encabezados_b; // dependiendo de la accion se define que encabezados se van a usar 

    // crear los inputs
    for (const encabezado of lista_encabezados[tabla]) {
        formulario.innerHTML += `
            <div class="input-group mb-2" id="div_${encabezado}">
                <span class="input-group-text col-3">${encabezado} </span>
                <input id="${encabezado}" type="text" class="form-control col-4" placeholder="${encabezado}" aria-label="${encabezado}" aria-describedby="${encabezado}">
            </div>
        `;
    }

    // en caso de ser la tabla gestion agregar los botones para la comprobacion de datos
    if (tabla === 'gestion') {
        //se hace un if para evitar que se agreguen los botones en caso de que la accion sea eliminar
        if (accion === 'agregar' || accion === 'editar'){
            let encabezados = ['id_usuario','id_cliente','id_tipo_gestion','id_resultado'];
            // se agregan los botones
            for (const encabezado of encabezados) {
                let div = document.querySelector(`#div_${encabezado}`);
                div.innerHTML += `<input type= "button" value="comprobar" onclick="obtener_comprobacion('${encabezado}')">`;
                }
        }
    }
    
}

const crear_objeto_raw = () => {
    // se capturan todos los datos de los inputs y se los devulete en formato json 
    tabla = obtener_variable_url('tabla'); // se obtiene el nombre de la tabla
    let objeto = {};

    for (const encabezado of encabezados_b[tabla]){
        objeto[encabezado] = document.querySelector(`#${encabezado}`).value 
    }
    return objeto;
}

const determinar_accion = () => {
    // se personalisa el formulario dependiendo de la accion de la tabla

    const accion = obtener_variable_url('accion');
    const tabla = obtener_variable_url('tabla');
    const boton = document.querySelector('#boton_accion');
    const titulo = document.querySelector('h2');

    if (accion === 'agregar'){
        titulo.innerText += `Ingresar dato en tabla ${tabla}`;
        boton.innerHTML += `Agregar`;
        boton.addEventListener('click',()=>{
            agregar();
        })
    } else if (accion === 'eliminar') {
        titulo.innerText += `Eliminar dato en tabla ${tabla}`;
        boton.innerHTML += `Eliminar`;
        obtener_uno(inyectar_valor);
        formulario = document.querySelector('fieldset');
        formulario.setAttribute('disabled','');
        boton.addEventListener('click', () => {
            eliminar();
        })
        
    } else if(accion === 'editar'){
        titulo.innerText += `Actualizar dato en tabla ${tabla}`;
        boton.innerHTML += `Actualizar`;
        if (tabla === 'cliente' || tabla === 'usuario') {
            let id = document.querySelector(`#${encabezados[tabla][0]}`);
            id.setAttribute('disabled','');
        }
        
        obtener_uno(inyectar_valor);
        boton.addEventListener('click',() => {
            actualizar();
        })
        
    }
}

const inyectar_valor= (elemento,index,arreglo) => {
    // se toma el elemento y se ingresa el valor al imput
    let accion = obtener_variable_url('accion');
    let tabla = obtener_variable_url('tabla');
    let lista_encabezados = (accion === 'eliminar') ? encabezados : encabezados_b;
    let lista = lista_encabezados[tabla];

        // ingresar los valores a los inputs
        for (const campo of lista) {
            let input = document.querySelector(`#${campo}`)
            input.setAttribute('value',`${elemento[campo]}`)
        }
}

// funcion que toma las vairables pasadas por la url 

const obtener_variable_url = (nombre) => {
    // busca el nombre de la variable ingresada en la url y devuelve el valor si existe
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let id = urlParams.get(`${nombre}`);
    return id;
}
