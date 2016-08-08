import NotifierLoader from './loader';
import Neo4jDB from '../database/neo4jdb';

const notifiers = {};

export default class NotifierPool {
  static getNotifier(name) {
    return notifiers[name];
  }

  static initPool() {
    return new Promise((resolve, reject) => {
      const neo4jDB = new Neo4jDB(process.env.GRAPHENEDB_URL);

      neo4jDB.cyper('MATCH (a:Notifier) RETURN a').then((resp) => {
        const results = resp.body.results;
        if (results.length < 1) {
          reject();
        } else {
          const data = results[0].data;
          data.forEach((r) => {
            const rowData = r.row[0];

            notifiers[rowData.name] = NotifierLoader.load(rowData);
          });
          resolve();
        }
      }).catch(({ error, response }) => {
        console.log(error);
        console.log(response);
      });
    });
  }
}
