import socketIO from 'socket.io';

export default function createSocketIO(server) {
  const io = socketIO();
  io.attach(server);
  return io;
}
