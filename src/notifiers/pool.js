import NotifierLoader from './loader';
import Neo4jDB from '../database/neo4jdb';

const notifiers = {};

export default class NotifierPool {
  static getNotifier(name) {
    return notifiers[name];
  }

  static initPool() {
    return new Promise((resolve, reject) => {
      const neo4jDB = new Neo4jDB(process.env.NEO4J_URL, process.env.NEO4J_USER, process.env.NEO4J_PASS);

      neo4jDB.cyper('MATCH (a:Notifier) RETURN a').then((resp) => {
        const results = resp.body.results;
        if (results.length < 1) {
          reject();
        } else {
          const data = results[0].data;
          data.forEach((r) => {
            const rowData = r.row[0];
            const notifierName = rowData.name;
            delete rowData.name;

            notifiers[notifierName] = NotifierLoader.load(rowData);
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
