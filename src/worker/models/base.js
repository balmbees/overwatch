/**
 * Created by leehyeon on 8/9/16.
 */

import request from 'request';
import _ from 'underscore';

export class GrapheneDB {
  constructor(url) {
    this.url = url;
  }

  cypher(q) {
    return new Promise((resolve, reject) => {
      request({
        uri: `${this.url}/db/data/transaction/commit`,
        method: 'POST',
        json: {
          statements: [{
            statement: q,
          }],
        },
      }, (err, response) => {
        if (err || response.statusCode < 200 || response.statusCode > 200) {
          reject({ err, response });
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default class BaseModel {
  constructor(id, settings) {
    this.id = id;
    _.extend(this, settings);
  }

  static fetchById(id, label) {
    return new Promise(resolve => {
      this.db().cypher(`MATCH (n:${label}) WHERE id(n)=${id} RETURN n`).then(resp => {
        const result = resp.body.results[0].data[0];
        resolve(new this(result.row[0], result.row[1]));
      });
    });
  }

  static fetchAll(label, limit = 30) {
    return new Promise(resolve => {
      this.db().cypher(`MATCH (n:${label}) RETURN n LIMIT ${limit}`).then(resp => {
        const result = resp.body.results[0].data;
        resolve(result.map(r => {
          return new this(r.row[0], r.row[1]);
        }));
      });
    });
  }

  static db() {
    return new GrapheneDB(process.env.GRAPHENEDB_URL);
  }
}

