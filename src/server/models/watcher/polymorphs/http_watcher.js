import request from 'request';

import Watcher from '../base';
import WatchResult from '../../watch_result';

import { jsonSchemaModel } from '../../base';

@jsonSchemaModel(require('./http_watcher_schema')) // eslint-disable-line
export default class HttpWatcher extends Watcher {
  watch() {
    return new Promise((resolve) => {
      request(this.url, (error, response) => {
        if (error || response.statusCode < 200 || response.statusCode > 299) {
          this.result = WatchResult.error({
            description: error ? error.message : `Status: ${response.statusCode}`,
          });
        } else {
          this.result = WatchResult.success({
            description: `Status: ${response.statusCode}`,
          });
        }
        resolve(this.result);
      });
    });
  }
}
