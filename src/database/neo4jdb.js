/**
 * Created by leehyeon on 8/5/16.
 */
import request from 'request';

export default class Neo4jDB {
  constructor(url, username, password) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.authHeader = new Buffer(`${username}:${password}`).toString('base64');
  }

  cyper(q) {
    return new Promise((resolve, reject) => {
      request({
        uri: `${this.url}/transaction/commit`,
        method: 'POST',
        headers: {
          Authorization: `Basic ${this.authHeader}`,
        },
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

