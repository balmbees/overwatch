/**
 * Created by leehyeon on 8/9/16.
 */
import _ from 'lodash';

import BaseModel from './base';
import { notifierPool, notifierTypes } from './notifier';
import { watcherTypes } from './watcher';
import STATUS_ERROR from './watch_result';

const label = 'Component';

export default class Component extends BaseModel {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['name', 'status']), id);
  }

  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  serialize() {
    return _.pick(this, ['id', 'name', 'status']);
  }

  insert() {
    if (!this.name) {
      return Promise.reject('required field missing');
    }
    return BaseModel.db()
      .cypher(`CREATE (c:Component {name: '${this.name}'}) RETURN id(c), c`)
      .then(resp => {
        const r = resp.body.results[0].data[0].row;
        return _.extend(r[1], { id: r[0] });
      });
  }

  watch() {
    return Promise.all([
      this.getWatchers(),
      this.getNotifiers(),
    ]).then((argv) => {
      const [watchers, notifiers] = argv;
      return Promise.all(watchers.map(w => w.watch()))
        .then(results => {
          const watchResult =
            results.find(r => (r.status === STATUS_ERROR)) || results[0];

          this.status = watchResult;
          notifiers.forEach(n => {
            n.notify(watchResult).then();
          });

          return this.status;
        });
    });
  }

  getNotifiers() {
    return BaseModel.db()
      .cypher(`
        MATCH (c:Component)-[:NOTIFY]->(n:Notifier)
        WHERE id(c) = ${this.id} RETURN id(n), n
      `).then(resp => {
        const result = resp.body.results[0].data;
        return result.map(r => {
          const id = r.row[0];
          let notifier = notifierPool[id];
          if (!notifier) {
            notifier = new notifierTypes[r.row[1].type](r.row[1], id);
            notifierPool[id] = notifier;
          }
          return notifier;
        });
      });
  }

  getWatchers() {
    return BaseModel.db()
      .cypher(`
        MATCH (c:Component)<-[:WATCH]-(n:Watcher)
        WHERE id(c) = ${this.id} RETURN id(n), n
      `).then(resp => {
        const result = resp.body.results[0].data;
        return result.map(r => new watcherTypes[r.row[1].type](r.row[1], r.row[0]));
      });
  }
}
