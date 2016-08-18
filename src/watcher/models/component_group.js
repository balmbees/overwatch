/**
 * Created by leehyeon on 8/10/16.
 */
import _ from 'lodash';

import BaseModel from './base';

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

  static registerComponent(componentGroupId, componentId) {
    return BaseModel.db()
      .cypher(`MATCH (cg:ComponentGroup), (c:Component)
              WHERE id(cg) = ${componentGroupId} AND id(c) = ${componentId}
              CREATE (cg)-[:CONTAINS]->(c)
              RETURN cg`)
      .then(resp => {
        const result = resp.body.results[0].data[0];
        return new ComponentGroup(result.row[1], result.row[0]);
      });
  }

  static deregisterComponent(componentGroupId, componentId) {
    return BaseModel.db()
      .cypher(`MATCH (cg:ComponentGroup)-[r:CONTAINS]->(c:Component)
              WHERE id(cg) = ${componentGroupId} AND id(c) = ${componentId}
              DELETE r
              RETURN cg`)
      .then(resp => {
        const result = resp.body.results[0].data[0];
        return new ComponentGroup(result.row[1], result.row[0]);
      });
  }

  serialize() {
    return _.pick(this, ['id', 'name']);
  }
}
