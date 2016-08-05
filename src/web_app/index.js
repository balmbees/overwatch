import server from './server';
import { createSocketIO } from './socket_io';

createSocketIO(server);

export default server;
