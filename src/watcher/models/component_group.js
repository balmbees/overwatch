/**
 * Created by leehyeon on 8/10/16.
 */
import _ from 'lodash';

import { BaseModel } from './base';
import Component from './component';

const label = 'ComponentGroup';

export default class ComponentGroup extends BaseModel {
  constructor(settings, id) {
    super(_.pick(settings, ['name']), id);
  }

  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  serialize() {
    return _.pick(this, ['name']);
  }

  getComponents() {
    return BaseModel.db()
      .cypher(`
        MATCH (cg:ComponentGroup)-[:HAS]->(c:Component)
        WHERE id(cg) = ${this.id} RETURN id(c), c
      `).then(resp => {
        const result = resp.body.results[0].data;
        return result.map(r => new Component(r.row[1], r.row[0]));
      });
  }
}
