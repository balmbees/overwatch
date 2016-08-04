import request from 'request';

import BaseNotifier from './base';

export default class SlackNotifier extends BaseNotifier {
  notify(watchResult) {
    console.log(this.settings);
    request({
      uri: this.settings.webhook_url,
      method: "POST",
      json: {
        "text": watchResult.description
      }
    }, (error, response, body) => {
      console.log(response.statusCode);
    });
  }
}
