import _ from 'lodash';
import request from 'request';

import WatchResult from '../../watch_result';
import Watcher from '../base';

export default class HttpWatcher extends Watcher {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name', 'url']), id);
  }

  serialize() {
    return _.pick(this, ['type', 'id', 'name', 'url', 'result']);
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'url'], (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

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
