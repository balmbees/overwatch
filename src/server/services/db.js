import seraph from 'seraph';
import URL from 'url';

export default class DB {
  static connect() {
    const url = URL.parse(process.env.GRAPHENEDB_URL);
    const dbConnection = seraph({
      server: `${url.protocol}//${url.host}`,
      user: url.auth.split(':')[0],
      pass: url.auth.split(':')[1],
    });

    return dbConnection;
  }
}
