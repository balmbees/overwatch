import _ from 'lodash';

import BaseModel from '../base';

const label = 'Watcher';
export default class Watcher extends BaseModel {
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
      .cypher('CREATE (w:Watcher { props }) RETURN id(w), w',
        { props: _.omit(this.serialize(), 'id') })
      .then(resp => {
        const r = resp.body.results[0].data[0].row;
        return _.extend(r[1], { id: r[0] });
      });
  }

  isValid() {
    throw new Error('Not Implemented');
  }

  watch() {
    throw new Error('Not Implemented');
  }
}
