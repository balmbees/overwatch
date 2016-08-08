import cron from 'node-cron';

import Component from './components/index';
import App from './web_app';

let currentStatus = null;

cron.schedule('*/3 * * * * *', () => {
  Component.fetchAll().then((components) => {
    Promise.all(components.map((c) => c.watch()))
      .then(() => {
        currentStatus = components.map((c) => {
          return {
            name: c.name,
            status: c.watchResult.status,
            description: c.watchResult.description,
            statusUpdatedAt: c.watchResult.createdAt,
          };
        });

        App.io.sockets.emit('action', {
          type: 'STATUS_UPDATE',
          data: currentStatus,
        });
      });
  });
});

App.io.on('connection', (socket) => {
  socket.emit('action', {
    type: 'STATUS_UPDATE',
    data: currentStatus,
  });
});
