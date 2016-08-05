import request from 'request';

import BaseNotifier from './base';

export default class SlackNotifier extends BaseNotifier {
  notify(watchResult) {
    request({
      uri: this.settings.webhook_url,
      method: 'POST',
      json: {
        text: watchResult.description,
      },
    }, (error, response) => {
      console.log(response.statusCode);
    });
  }
}
