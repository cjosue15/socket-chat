const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIO = require('socket.io');

// IO = esta es la comunicacion del Backend
// io nos dara todo
// const io = socketIO(server);
module.exports.io = socketIO(server);
require('./sockets/socket');

const path = require('path');

const port = process.env.PORT || 3500;

const pathPublic = path.resolve(__dirname, '../public');

// midelware para habilitar para todos esta carpeta public
app.use(express.static(pathPublic));

server.listen(port, err => {
  if (err) throw new Error(err);

  console.log(`Server in port ${port}`);
});
