const socket = io();

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('nombre') || !searchParams.has('sala')) {
  window.location = 'index.html';

  throw new Error('Nombre o sala es necesario');
}

const usuario = {
  nombre: searchParams.get('nombre'),
  sala: searchParams.get('sala')
};

// LOS ON ES PARA ESCUCHAR

socket.on('connect', () => {
  console.log('Conectado al servidor');

  socket.emit('entrarChat', usuario, function(resp) {
    console.log('usuarios conectados', resp);
  });
});

socket.on('disconnect', () => {
  console.log('Perdimos la conexion con el server');
});

// LoS EMIT SON PARA ENVIAR INFORMACION

// socket.emit(
//   'crearMensaje',
//   {
//     usuario: 'Carlos',
//     mensaje: 'Hola'
//   },
//   resp => {
//     console.log('Respuesta server:', resp);
//   }
// );

// socket.emit('crearMensaje', { mensaje:'Hola a todos prros'
// });

// Escuchar o recibir informacion
// const mensajePublic = document.querySelector('#public');
// const enviarButton = document.querySelector('#enviar');

// enviarButton.addEventListener('click', () => {
//   socket.emit('crearMensaje', { mensaje: mensajePublic.value });
// });

socket.on('crearMensaje', message => {
  console.log(message);
});

// Escuahr cuando un usuario entra o sale del chat
socket.on('listaPersonas', personas => {
  console.log(personas);
});

// Mensajes privados

socket.on('mensajePrivado', mensaje => {
  console.log('mensajePrivado', mensaje);
});
