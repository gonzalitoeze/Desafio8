const socket = io();

function renderProducto(producto) {
    const linea = document.createElement('tr');

    const nombre = document.createElement('td');
    nombre.innerHTML = producto.nombre;
    linea.appendChild(nombre);

    const precio = document.createElement('td');
    precio.innerHTML = producto.precio;
    linea.appendChild(precio);

    const foto = document.createElement('td');
    const img = document.createElement('img');
    img.setAttribute('src', producto.thumbnail);
    img.setAttribute('width', '25')
    foto.appendChild(img);
    linea.appendChild(foto);

    document.getElementById('productos').appendChild(linea);
}

socket.on('nuevaConexion', data => {
    data.forEach(producto => {
        renderProducto(producto);
    });
});

socket.on('productos', data => {
    renderProducto(data);
});

function addProductos(e) {
    const producto = {
        nombre: document.getElementById("nombre").value,
        precio: document.getElementById("precio").value,
        thumbnail: document.getElementById("thumbnail").value
    };
    socket.emit('nuevoProducto', producto);
    return false;
};

function render(data) {
    const html = data.map((elem, index) => {
        return(`<div style="color: brown">
            <strong style="color: blue">${elem.email}</strong> [${elem.time}] :
            <em style="color: green">${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
};

socket.on('messages', function(data) { render(data); });

function addMessage(e) {
    const mensaje = {
        email: document.getElementById('email').value,
        text: document.getElementById('texto').value
    };
    if (mensaje.email) {
        socket.emit('nuevoMensaje', mensaje);
    } else {
        alert('Introducir email')
    }
    return false;
}   