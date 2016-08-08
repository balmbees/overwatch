import createServer from './server';
import createSocketIO from './socket_io';

const server = createServer();
const io = createSocketIO(server);

export default {
  server,
  io,
};
