const { io } = require('../index');

const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', client => {
  // El on puede responder con un callback

  client.on('entrarChat', (usuario, callback) => {
    if (!usuario.nombre || !usuario.sala) {
      return callback({ ok: false, message: 'El nombre o sala es necesario' });
    }

    client.join(usuario.sala);

    const personas = usuarios.agregarPersona(
      client.id,
      usuario.nombre,
      usuario.sala
    );

    // client.broadcast.emit('listaPersonas', usuarios.getPersonas());
    client.broadcast
      .to(usuario.sala)
      .emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

    callback({ ok: true, personas });
  });

  client.on('crearMensaje', data => {
    const persona = usuarios.getPersona(client.id);
    const mensaje = crearMensaje(persona.nombre, data.mensaje);

    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
  });

  client.on('disconnect', () => {
    const personaBorrada = usuarios.borrarPersona(client.id);

    client.broadcast
      .to(personaBorrada.sala)
      .emit(
        'crearMensaje',
        crearMensaje('Administrador', `${personaBorrada.nombre} salio`)
      );

    client.broadcast
      .to(personaBorrada.sala)
      .emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
  });

  // Mensajes privados

  client.on('mensajePrivado', (data, callback) => {
    if (!data.mensaje) {
      return callback({ ok: false, message: 'El mensaje es necesario' });
    }

    const persona = usuarios.getPersona(client.id);

    client.broadcast
      .to(data.para)
      .emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
  });
});
