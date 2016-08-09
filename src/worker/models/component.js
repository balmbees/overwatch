/**
 * Created by leehyeon on 8/9/16.
 */
import BaseModel from './base';
import { notifierPool, notifierTypes } from './notifier';
import { watcherTypes } from './watcher';
import STATUS_ERROR from './watch_result';

const label = 'Component';

export default class Component extends BaseModel {
  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  watch() {
    Promise.all([this.getWatchers(), this.getNotifiers()])
      .then((argv) => {
        const [watchers, notifiers] = argv;
        Promise.all(watchers.map(w => w.watch()))
          .then(results => {
            const watchResult = results.find(r => (r.status === STATUS_ERROR));
            if (watchResult) {
              notifiers.forEach(n => {
                n.notify(watchResult).then();
              });
            } else {
              notifiers.forEach(n => {
                n.notify(results[0]).then();
              });
            }
          });
      });
  }

  getNotifiers() {
    return new Promise(resolve => {
      BaseModel.db()
        .cypher(`MATCH (c:Component)-[:NOTIFY]->(n:Notifier) 
                WHERE id(c) = ${this.id} RETURN id(n), n`)
        .then(resp => {
          const result = resp.body.results[0].data;
          resolve(result.map(r => {
            const id = r.row[0];
            let notifier = notifierPool[id];
            if (!notifier) {
              notifier = new notifierTypes[r.row[1].type](id, r.row[1]);
              notifierPool[id] = notifier;
            }
            return notifier;
          }));
        });
    });
  }

  getWatchers() {
    return new Promise(resolve => {
      BaseModel.db()
        .cypher(`MATCH (c:Component)<-[:WATCH]-(n:Watcher) 
                  WHERE id(c) = ${this.id} RETURN id(n), n`)
        .then(resp => {
          const result = resp.body.results[0].data;
          resolve(result.map(r => new watcherTypes[r.row[1].type](r.row[0], r.row[1])));
        });
    });
  }
}
