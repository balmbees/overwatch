import socketIO from 'socket.io';

export function createSocketIO(server) {
  const io = socketIO();
  io.attach(server);
  io.on('connection', (socket) => {
    socket.emit('action', { type: 'message', data: 'good day!' });
  });

  return io;
}
