import _ from 'lodash';

import BaseModel from '../base';
import { STATUS_SUCCESS } from '../watch_result';

const label = 'Notifier';

import { Validator } from 'jsonschema';

export default class Notifier extends BaseModel {
  constructor(settings, id = undefined) {
    super();
    this.id = id;
    Object.assign(
      this,
      _.pick(
        settings,
        Object.keys(this.constructor.schema.properties).concat([
        ])
      )
    );
  }

  serialize() {
    return _.pick(this, Object.keys(this.constructor.schema.properties).concat([
      'id',
    ]));
  }

  isValid() {
    const validator = new Validator();
    const result = validator.validate(this, this.constructor.schema, { throwError: true });
    return result.valid;
  }

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

  message({ component, watcher, watchResult }) {
    if (component.status === STATUS_SUCCESS) {
      return `${component.name} back to normal status!`;
    }
    return `${component.name} - ${watcher.name} : *${watchResult.status}* ${watchResult.description}` // eslint-disable-line
  }
}
