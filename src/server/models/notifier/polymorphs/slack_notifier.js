import request from 'request';

import Notifier from '../base';

import { jsonSchemaModel } from '../../base';

@jsonSchemaModel(require('./slack_notifier_schema')) // eslint-disable-line
export default class SlackNotifier extends Notifier {
  notify({ component, watcher, watchResult }) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.webhookUrl,
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
}
