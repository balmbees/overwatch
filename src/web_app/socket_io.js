import socketIO from 'socket.io';

export function createSocketIO(server) {
  const io = socketIO();
  io.attach(server);
  return io;
}
