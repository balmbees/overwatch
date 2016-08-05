import request from 'request';

import BaseNotifier from './base';

export default class SlackNotifier extends BaseNotifier {
  notify(component) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.settings.webhook_url,
        method: 'POST',
        json: {
          text: this.message(component),
        },
      }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }
}
