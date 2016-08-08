import _ from 'underscore';

import ComponentLoader from './loader';
import GrapheneDB from '../database/graphenedb';

export default class Component {
  constructor(settings) {
    Object.assign(this, _.pick(settings, [
      'name',
      'description',
      'watchResult',
      'notifier',
      'watcher',
    ]));
  }

  static fetchAll() {
    return new Promise((resolve, reject) => {
      const grapheneDB = new GrapheneDB(process.env.GRAPHENEDB_URL);

      grapheneDB.cypher('MATCH p=(:Notifier)<-[:NOTIFY]-(:Component)<-[:WATCH]-(:Watcher) RETURN p').then((resp) => {
        const results = resp.body.results;
        if (results.length < 1) {
          reject();
        } else {
          const data = results[0].data;
          resolve(data.map((r) => {
            const rowData = r.row[0];
            return ComponentLoader.load(rowData[2], rowData[0], rowData[4]);
          }));
        }
      }).catch(({ error, response }) => {
        console.log(error);
        console.log(response);
      });
    });
  }

  set watchResult(watchResult) {
    this._watchResult = watchResult;
    if (this.notifier && watchResult) {
      this.notifier.notify(this);
    }
  }

  get watchResult() {
    return this._watchResult;
  }

  watch() {
    return this.watcher.watch().then((watchResult) => {
      this.watchResult = watchResult;
      return Promise.resolve(this);
    });
  }
}
