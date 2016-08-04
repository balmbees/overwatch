import request from 'request';

import BaseWatcher from './base';

export default class HTTPWatcher extends BaseWatcher {
  watch() {
    return new Promise((resolve, reject) => {
      request(this.settings.url, (error, response, body) => {
        if (error) reject(error);
        else resolve({ response, body });
      });
    });
  }
}
