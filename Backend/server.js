'use strict';


const http = require('http');
const port = process.env.SRV_PORT || '3010';

const app = require('./app');

app.set('port', port);

const server = http.createServer(app)

server.listen(port);
server.address = "0.0.0.0";


server.on('error', (error) => {
  console.error('error found', error)
});

server.on('listening', () => {
  console.log('Server running at ', port)
});