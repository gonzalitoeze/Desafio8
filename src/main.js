//EXPRESS
const express = require('express');
const app = express();
const moment = require('moment');

//SERVER
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer)

//CONTENEDOR
const Contenedor = require('./Contenedor/ContenedorSQL');
const options = require('./connection/options');
const productos = new Contenedor(options.mysql, 'productos');
const mensajes = new Contenedor(options.sqlite3, 'mensajes');
const script = require('./index');

const PORT = 8080;
const publicRoute = './public';

//EXPRESS + JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicRoute));

//METODOS
app.get('/', (req, res) => {
    res.send('index.html', { root: publicRoute })
});

const server = httpServer.listen(PORT, () => {
    console.log(`Server listening from: ${server.address().port}`);
});
server.on('error', error => console.log(`error ${error}`));

io.on('connection', async (socket) => {
    console.log('Nuevo cliente');

    const listaProductos = await productos.getAll();
    socket.emit('nuevaConexion', listaProductos);

    socket.on("nuevoProducto", (data) => {
        productos.save(data);
        io.sockets.emit('producto', data);
    });

    const listaMensajes = await mensajes.getAll();
    socket.emit('mensajes', listaMensajes);

    socket.on('nuevoMensaje', async data => {
        data.time = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
        await mensajes.save(data);
        const listaMensajes = await mensajes.getAll();
        io.sockets.emit('mensajes', listaMensajes);
    });
});