import _ from 'lodash';
import request from 'request';

import Notifier from '../base';

export default class SlackNotifier extends Notifier {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name', 'webhook_url']), id);
  }

  serialize() {
    return _.pick(this, ['type', 'id', 'name', 'webhook_url']);
  }

  notify({ component, watcher, watchResult }) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.webhook_url,
        method: 'POST',
        json: {
          text: this.message({ component, watcher, watchResult }),
        },
      }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'webhook_url'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }
}
