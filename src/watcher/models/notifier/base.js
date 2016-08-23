import _ from 'lodash';

import BaseModel from '../base';

const label = 'Notifier';

export default class Notifier extends BaseModel {
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
      .cypher('CREATE (n:Notifier { props }) RETURN id(n), n',
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

  message({ component, watcher, watchResult }) {
    return `${component.name} - ${watcher.name} : *${watchResult.status}* ${watchResult.description}` // eslint-disable-line
  }
}
