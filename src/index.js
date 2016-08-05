import App from './web_app';
import requireDir from 'require-dir';
import ComponentLoader from './components/loader';

const dir = requireDir('../database/components');

const components = Object.keys(dir).map((key) => {
  const value = dir[key];
  return ComponentLoader.load(value);
});

let currentStatus = null;
Promise.all(components.map((c) => c.watch()))
  .then(() => {
    currentStatus = components.map((c) => {
      return {
        name: c.name,
        status: c.watchResult.status,
        description: c.watchResult.description,
      };
    });
  });

App.io.on('connection', (socket) => {
  socket.emit('action', {
    type: 'STATUS_UPDATE',
    data: currentStatus,
  });
});
