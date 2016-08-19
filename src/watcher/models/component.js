/**
 * Created by leehyeon on 8/9/16.
 */
import _ from 'lodash';

import BaseModel from './base';
import { notifierPool, notifierTypes } from './notifier';
import { watcherTypes } from './watcher';
import { STATUS_SUCCESS, STATUS_ERROR } from './watch_result';

const label = 'Component';

export default class Component extends BaseModel {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['name', 'description', 'status']), id);
    this.notifiers = [];
    this.watchers = [];
  }

  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  static fetchComponentDependencies() {
    return BaseModel.db()
      .cypher('MATCH p=(:Component)-[:DEPEND]->(:Component) return p', null, ['graph'])
      .then(resp => {
        const depends = resp.body.results[0].data.map(row => {
          const r = row.graph.relationships[0];
          return r;
        });
        return depends;
      });
  }

  static registerWatcher(componentId, watcherId) {
    return BaseModel.db()
      .cypher(`MATCH (c:Component), (w:Watcher)
            WHERE id(c) = ${componentId} AND id(w) = ${watcherId}
            MERGE (c)<-[:WATCH]-(w)
            RETURN id(c), c`)
      .then(resp => {
        const result = resp.body.results[0].data[0];
        return new this(result.row[1], result.row[0]);
      });
  }

  static registerNotifier(componentId, notifierId) {
    return BaseModel.db()
      .cypher(`MATCH (c:Component), (n:Notifier)
              WHERE id(c) = ${componentId} AND id(n) = ${notifierId}
              MERGE (c)-[:NOTIFY]->(n)
              RETURN id(c), c`)
      .then(resp => {
        const result = resp.body.results[0].data[0];
        return new this(result.row[1], result.row[0]);
      });
  }

  static deregisterNotifier(componentId, notifierId) {
    return BaseModel.db()
      .cypher(`MATCH (c:Component)-[r:NOTIFY]->(n:Notifier)
              WHERE id(c) = ${componentId} AND id(n) = ${notifierId}
              DELETE r
              RETURN id(c), c`)
      .then(resp => {
        const result = resp.body.results[0].data[0];
        return new this(result.row[1], result.row[0]);
      });
  }

  static registerDependency(fromId, toId) {
    return BaseModel.db()
      .cypher(`MATCH (c1:Component), (c2:Component)
              WHERE id(c1) = ${fromId} AND id(n2) = ${toId}
              MERGE p=(c1)-[:DEPEND]->(c2)
              RETURN p`)
      .then(resp => resp.body.results[0].data[0].row[0]);
  }

  serialize() {
    return _.pick(this, ['id', 'name', 'status', 'description', 'notifiers', 'watchers']);
  }

  insert() {
    if (!this.name) {
      return Promise.reject('required field missing');
    }
    return BaseModel.db()
      .cypher('CREATE (c:Component { props }}) RETURN id(c), c',
        { props: _.pick(this, ['name', 'description']) })
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
          const failedResults = results.filter(r => (r.status === STATUS_ERROR));
          if (process.env.NODE_ENV === 'production') {
            failedResults
              .forEach(fr => {
                notifiers.forEach(n => {
                  n.notify(fr).then();
                });
              });
          } else {
            failedResults
              .forEach(fr => {
                console.log(`notify failed watches ${fr}`); // eslint-disable-line
              });
          }
          this.status = failedResults.length === 0 ? STATUS_SUCCESS : STATUS_ERROR;

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
        this.notifiers = result.map(r => {
          const id = r.row[0];
          let notifier = notifierPool[id];
          if (!notifier) {
            notifier = new notifierTypes[r.row[1].type](r.row[1], id);
            notifierPool[id] = notifier;
          }
          return notifier;
        });

        return this.notifiers;
      });
  }

  getWatchers() {
    return BaseModel.db()
      .cypher(`
        MATCH (c:Component)<-[:WATCH]-(n:Watcher)
        WHERE id(c) = ${this.id} RETURN id(n), n
      `).then(resp => {
        const result = resp.body.results[0].data;
        this.watchers = result.map(r => new watcherTypes[r.row[1].type](r.row[1], r.row[0]));

        return this.watchers;
      });
  }
}
