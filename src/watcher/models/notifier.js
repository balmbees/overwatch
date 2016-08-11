/**
 * Created by leehyeon on 8/9/16.
 */
import request from 'request';
import BaseModel from './base';

export const notifierPool = {};

const label = 'Notifier';
export class Notifier extends BaseModel {
  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  insert() {
    if (!this.isValid()) {
      return Promise.reject('Invalid watcher');
    }

    return BaseModel.db()
      .cyper('CREATE (n:Notifier { props }) RETURN id(n), n',
        { props: _.omit(this.serialize(), 'id') })
      .then(resp => {
        const r = resp.body.results[0].data[0].row;
        return _.extend(r[1], { id: r[0] });
      });
  }

  notify(watchResult) {
    throw new Error(`Not Implemented : ${watchResult}`);
  }

  isValid() {
    throw new Error('Not Implemented');
  }
}

export class SlackNotifier extends Notifier {
  serialize() {
    return _.pick(this, ['type', 'id', 'name', 'webhook_url']);
  }

  notify(watchResult) {
    return new Promise((resolve, reject) => {
      request({
        uri: this.webhook_url,
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


  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'webhook_url'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }
}

export const notifierTypes = { SlackNotifier };
