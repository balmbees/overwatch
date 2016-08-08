/**
 * Created by leehyeon on 8/5/16.
 */
import request from 'request';

export default class Neo4jDB {
  constructor(url) {
    this.url = url;
  }

  cyper(q) {
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
