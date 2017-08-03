'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: 3000
});

//Connect to db
server.app.db = mongojs('api-books', ['books']);
server.app.db = mongojs('api-books', ['users']);

//Load plugins and start server
server.register([
    require('./routes/books'),
    require('./routes/users')
], (err) => {

    if (err) {
        throw err;
    }


    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
