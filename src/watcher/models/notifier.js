/**
 * Created by leehyeon on 8/9/16.
 */
import request from 'request';
import BaseModel from './base';
import _ from 'lodash';

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

  notify({ component, watcher, watchResult }) {
    throw new Error(`Not Implemented : ${component}, ${watcher}, ${watchResult}`);
  }

  isValid() {
    throw new Error('Not Implemented');
  }
}

export class SlackNotifier extends Notifier {
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

  message({ component, watcher, watchResult }) {
    return `${component.name} - ${watcher.name} : *${watchResult.status}* ${watchResult.description}` // eslint-disable-line
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'webhook_url'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }
}

export const notifierTypes = { SlackNotifier };
