/**
 * Created by leehyeon on 8/9/16.
 */
import request from 'request';
import BaseModel from './base';

export const notifiers = {};

const label = 'Notifier';
export class Notifier extends BaseModel {
  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  notify(watchResult) {
    throw new Error(`Not Implemented : ${watchResult}`);
  }
}

export class SlackNotifier extends Notifier {
  notify(watchResult) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.settings.webhook_url,
        method: 'POST',
        json: {
          text: watchResult.getMessage(),
        },
      }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }
}

export const notifierTypes = { SlackNotifier };
