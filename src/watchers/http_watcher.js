import request from 'request';

import BaseWatcher from './base';
import WatchResult from './watch_result';

export default class HttpWatcher extends BaseWatcher {
  watch() {
    return new Promise((resolve) => {
      request(this.settings.url, (error, response) => {
        if (error || response.statusCode < 200 || response.statusCode > 299) {
          resolve(WatchResult.error({
            description: error.message,
          }));
        } else {
          resolve(WatchResult.success({
            description: `Status: ${response.statusCode}`,
          }));
        }
      });
    });
  }
}
