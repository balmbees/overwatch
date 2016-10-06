import { Firehose, Config } from 'aws-sdk';

import BaseModel, { jsonSchemaModel } from './base';

import { Notifier, fromArray as notifierFromArray } from './notifier';
import { Watcher, fromArray as watcherFromArray } from './watcher';
import { STATUS_SUCCESS, STATUS_ERROR } from './watch_result';

@jsonSchemaModel(require('./component_schema')) // eslint-disable-line
export default class Component extends BaseModel {
  constructor(options) {
    super(options);

    this.notifiers = notifierFromArray(options.notifiers);
    this.watchers = watcherFromArray(options.watchers);
  }

  _firehose() {
    const config = new Config({
      accessKeyId: (
        this.awsAccessKeyId || process.env.FIREHOSE_AWS_ACCESS_KEY_ID
      ),
      secretAccessKey: (
        this.awsSecretAccessKey || process.env.FIREHOSE_AWS_SECRET_ACCESS_KEY
      ),
      region: (
        this.awsRegion || process.env.FIREHOSE_AWS_REGION
      ),
    });

    return new Firehose(config);
  }

  static findAll(options) {
    Object.assign(options, {
      include: {
        watchers: {
          model: Watcher.model,
          rel: 'WATCH',
          direction: 'in',
          many: true,
        },
        notifiers: {
          model: Notifier.model,
          rel: 'NOTIFY',
          direction: 'out',
          many: true,
        },
      },
    });
    return super.findAll(options);
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

  watch() {
    return Promise
      .all(this.watchers.map(w =>
        Promise.all([
          Promise.resolve(w),
          w.watch(),
        ])
      ))
      .then(results => {
        this._firehose().putRecordBatch({
          DeliveryStreamName: 'overwatch_watcher_log',
          Records: results.map(r => ({
            Data: JSON.stringify({
              Component: {
                id: this.id,
                name: this.name,
              },
              Watcher: {
                id: r[0].id,
                name: r[0].name,
              },
              WatchResult: {
                status: r[1].status,
                description: r[1].description,
                createdAt: r[1].createdAt,
              },
            }),
          })),
        }, (err) => {
          if (err) {
            console.log(err, err.stack); // eslint-disable-line no-console
          }
        });

        const failedWatchers = results.filter(r => (r[1].status === STATUS_ERROR));
        const newStatus = failedWatchers.length === 0 ? STATUS_SUCCESS : STATUS_ERROR;

        let promise = null;

        if (newStatus !== this.status) {
          this.status = newStatus;
          this.statusChanged = true;

          promise =
            BaseModel.db()
              .cypher(`
                MATCH (n)
                WHERE id(n)=${this.id}
                SET n.status='${this.status}'
                RETURN id(n)
              `);
        } else {
          this.statusChanged = false;

          promise = Promise.resolve();
        }

        return promise.then(() => {
          if (this.statusChanged) {
            if (process.env.NODE_ENV === 'production') {
              if (this.status === STATUS_SUCCESS) {
                return Promise.all(
                  this.notifiers.map(n =>
                  n.notify({
                    component: this,
                  }))
                );
              } else { // eslint-disable-line
                return Promise.all(
                  failedWatchers.map(([watcher, watchResult]) => {
                    const notifyPromises = this.notifiers.map(n =>
                      n.notify({
                        component: this,
                        watcher,
                        watchResult,
                      })
                    );
                    return Promise.all(notifyPromises);
                  })
                );
              }
            } else { // eslint-disable-line
              failedWatchers
                .forEach(fr => {
                  console.log(`notify failed watches ${JSON.stringify(fr)}`); // eslint-disable-line
                });

              return Promise.resolve();
            }
          } else { // eslint-disable-line
            return Promise.resolve();
          }
        });
      });
  }
}
