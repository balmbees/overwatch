/**
 * Created by leehyeon on 8/9/16.
 */

import request from 'request';
import _ from 'underscore';

export class GrapheneDB {
  constructor(url) {
    this.url = url;
  }

  cypher(q, params = undefined, contents = ['row']) {
    return new Promise((resolve, reject) => {
      request({
        uri: `${this.url}/db/data/transaction/commit`,
        method: 'POST',
        json: {
          statements: [{
            statement: q,
            resultDataContents: contents,
            parameters: params,
          }],
        },
      }, (err, response) => {
        if (err || response.statusCode < 200 || response.statusCode > 200) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default class BaseModel {
  constructor(settings, id = undefined) {
    this.id = id;
    _.extend(this, settings);
  }

  static fetchById(id, label) {
    return new Promise(resolve => {
      this.db().cypher(`MATCH (n:${label}) WHERE id(n)=${id} RETURN id(n), n`).then(resp => {
        const result = resp.body.results[0].data[0];
        resolve(new this(result.row[1], result.row[0]));
      });
    });
  }

  static fetchAll(label, limit = 30) {
    return new Promise(resolve => {
      this.db().cypher(`MATCH (n:${label}) RETURN id(n), n LIMIT ${limit}`).then(resp => {
        const result = resp.body.results[0].data;
        resolve(result.map(r => new this(r.row[1], r.row[0])));
      });
    });
  }

  static db() {
    const url = process.env.GRAPHENEDB_URL || 'http://localhost:7474';
    return new GrapheneDB(url);
  }
}
