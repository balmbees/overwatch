import URL from 'url';

import seraph from 'seraph';
import seraphModel from 'seraph-model';

export default class DB {
  static __connection = null;
  static connect() {
    const url = URL.parse(process.env.GRAPHENEDB_URL);
    if (!this.__connection) {
      this.__connection = seraph({
        server: `${url.protocol}//${url.host}`,
        user: url.auth.split(':')[0],
        pass: url.auth.split(':')[1],
      });
    }
    return this.__connection;
  }

  static createModel(modelName) {
    const model = seraphModel(this.connect(), modelName);
    return model;
  }
}
