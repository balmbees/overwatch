import http from 'http';
import socketIO from 'socket.io';

const server = http.createServer();
server.listen(3000);

const io = socketIO();
io.attach(server);
io.on('connection', (socket) => {
  socket.on('action', (action) => {
    // if (action.type === 'server/hello'){
    //   console.log('Got hello data!', action.data);
    //   socket.emit('action', {type:'message', data:'good day!'});
    // }
  });
});
