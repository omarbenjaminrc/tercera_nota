const URL = '164.92.84.70:3000';

// encabezados de las tablas de la api
const   encabezados = {
        'cliente'   :   ["id_cliente","dv","nombres","apellidos","email","celular","fecha_registro"],
        'gestion'   :   ["id_gestion","id_usuario","id_cliente","id_tipo_gestion","id_resultado","comentarios","fecha_registro"],
        'resultado' :   ["id_resultado","nombre_resultado","fecha_registro"],
        'tipo_gestion' :["id_tipo_gestion","nombre_tipo_gestion","fecha_registro"],
        'usuario'   :   ["id_usuario","dv","nombres","apellidos","email","celular","username","password","fecha_registro"]
        }

const   encabezados_b = {
        'cliente'   :   ["id_cliente","dv","nombres","apellidos","email","celular"],
        'gestion'   :   ["id_usuario","id_cliente","id_tipo_gestion","id_resultado","comentarios"],
        'resultado' :   ["nombre_resultado"],
        'tipo_gestion' :["nombre_tipo_gestion"],
        'usuario'   :   ["id_usuario","dv","nombres","apellidos","email","celular","username","password"]
        }

// funciones para interactuar con la api
const agregar = () => {
// esta funcion toma la variable objeto que tiene que contener un objeto con llaves que tienen que coinsidir con los nombres de las tablas, la variable tabla es para incluir el nombre de la tabla en la que va a agregar la instancia
    const tabla = obtener_variable_url('tabla');
    const objeto = crear_objeto_raw(tabla);
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
    // esta funcion toma la variable objeto que tiene que contener un objeto con llaves que tienen que coinsidir con los nombres de las tablas, la variable tabla es para incluir el nombre de la tabla en la que va a agregar la instancia, id_campo es el identificador del campo que quieres actualizar
    const tabla = obtener_variable_url('tabla');
    const objeto = crear_objeto_raw(tabla);
    const id_campo = obtener_variable_url('id');

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
// la variable tabla es para incluir el nombre de la tabla en la que va a eliminar la instancia, id_campo es el identificador del campo que quieres actualizar
    const tabla = obtener_variable_url('tabla');
    const id_campo = obtener_variable_url('id');

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
// la variable tabla es para incluir el nombre de la tabla en la que va a obtener las instancias, funcion es el nombre de una funcion que agrega el cuerpo de la tabla con las intancias de la base de datos

    const tabla = obtener_variable_url('tabla');
    if (tabla === 'gestion'){
        obtener_gestion();
    }else{
    crear_encabezados(tabla);
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
    let titulos = document.querySelector(`#encabezado`)
    titulos.innerHTML += `<th>id_gestion</th><th>cliente</th><th>usuario</th><th>comentarios</th><th>tipo_gestion</th><th>resultado</th><th>fecha_registro</th>
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
// la variable tabla es para incluir el nombre de la tabla en la que va a obtener las instancias, funcion es el nombre de una funcion que agrega el cuerpo de la tabla con las intancias de la base de datos, id es el identificador del campo que quieres obtener 
    const tabla = obtener_variable_url('tabla');
    const id = obtener_variable_url('id');

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

// funciones para generar elementos html del archivo tabla.html 
const crear_encabezados = () => {
// esta funcion toma todos los encabezados y los genera un encabezado en la tabla
    tabla = obtener_variable_url('tabla');
    thead_table = document.querySelector('#encabezado');
    for (const encabezado of encabezados[tabla]) {
        thead_table.innerHTML += `<th>${encabezado}</th>`;
    }
    thead_table.innerHTML += `<th> acciones </th>`;
}

const crear_contenido_tabla = (elemento,index,arreglo) =>{
    let tabla = obtener_variable_url('tabla');
    objeto = Object.keys(elemento)
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

const obtener_comprobacion = (id_input) => {
    id = document.querySelector(`#${id_input}`).value;
    tabla = id_input.slice(3);
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
// funciones para generar elementos html en el archivo formulario.html

const crear_formulario = () => {

    const accion = obtener_variable_url('accion');
    const tabla = obtener_variable_url('tabla');
    const formulario = document.querySelector('fieldset');
    let lista_encabezados = (accion === 'eliminar') ? encabezados : encabezados_b;

    for (const encabezado of lista_encabezados[tabla]) {
        formulario.innerHTML += `
            <div class="input-group mb-2" id="div_${encabezado}">
                <span class="input-group-text col-3">${encabezado} </span>
                <input id="${encabezado}" type="text" class="form-control col-4" placeholder="${encabezado}" aria-label="${encabezado}" aria-describedby="${encabezado}">
            </div>
        `;
    }
    if (tabla === 'gestion') {
        if (accion === 'agregar' || accion === 'editar'){
            let encabezados = ['id_usuario','id_cliente','id_tipo_gestion','id_resultado'];
        for (const encabezado of encabezados) {
            let div = document.querySelector(`#div_${encabezado}`);
            div.innerHTML += `<input type= "button" value="comprobar" onclick="obtener_comprobacion('${encabezado}')">`;
        }
        }
    }
    
}

const crear_objeto_raw = () => {
    tabla = obtener_variable_url('tabla');
    let objeto = {};
    for (const encabezado of encabezados_b[tabla]){
        objeto[encabezado] = document.querySelector(`#${encabezado}`).value 
    }
    return objeto;
}

const determinar_accion = () => {
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
    let accion = obtener_variable_url('accion');
    let tabla = obtener_variable_url('tabla');
    let lista_encabezados = (accion === 'eliminar') ? encabezados : encabezados_b;
    let lista = lista_encabezados[tabla];
        for (const campo of lista) {
            let input = document.querySelector(`#${campo}`)
            input.setAttribute('value',`${elemento[campo]}`)
        }
}

// funcion que toma las vairables pasadas por la url 

const obtener_variable_url = (nombre) => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let id = urlParams.get(`${nombre}`);
    return id;
}
