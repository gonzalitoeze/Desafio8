const options = require('./connection/options');
const knex = require('knex');

const connection = knex(options.mysql);
const connection2 = knex(options.sqlite3);

( async () => {
    try {
        const mensajes = await connection2.schema.hasTable('mensajes');
        const productos = await connection.schema.hasTable('productos');

        if(!mensajes) {
            await connection2.schema.createTable('mensajes', (table) => {
                table.increments('id').primary();
                table.string('email', 45).notNullable();
                table.string('text', 160).notNullable();
                table.string('time');
            }).then(() => console.log('Tabla creada exitosamente'));
        }

        if(!productos) {
            await connection.schema.createTable('productos', (table) => {
                table.increments('id').primary();
                table.string('nombre', 45).notNullable();
                table.string('precio', 160).notNullable();
                table.string('thumbnail');
            }).then(() => console.log('Tabla creada exitosamente'));
        }

        connection.destroy();

    } catch (error) {
        console.log('ha ocurrido un error')
    }
}) ();