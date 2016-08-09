/**
 * Created by leehyeon on 8/9/16.
 */
import BaseModel from './base';
import { notifiers, notifierTypes } from './notifier';
import { watcherTypes } from './watcher';

const label = 'Component';

export default class Component extends BaseModel {
  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  getNotifiers() {
    return new Promise(resolve => {
      this.db()
        .cypher(`MATCH (c:Component)-[:NOTIFY]->(n:Notifier) WHERE id(c) = ${this.id} RETURN n`)
        .then(resp => {
          const result = resp.body.results[0].data;
          resolve(result.map(r => {
            const id = r.row[0];
            let notifier = notifiers[id];
            if (!notifier) {
              notifier = new notifierTypes[r.row[1].type](id, r.row[1]);
              notifiers[id] = notifier;
            }
            return notifier;
          }));
        });
    });
  }

  getWatchers() {
    return new Promise(resolve => {
      this.db()
        .cypher(`MATCH (c:Component)<-[:WATCH]-(n:Watcher) WHERE id(c) = ${this.id} RETURN n`)
        .then(resp => {
          const result = resp.body.results[0].data;
          resolve(result.map(r => watcherTypes[r.row[1].type](r.row[0], r.row[1])));
        });
    });
  }
}
