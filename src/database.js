/**
 * Created by leehyeon on 8/5/16.
 */
import neo4j from 'neo4j-driver';

const driver = neo4j.v1.driver(process.env.NEO4J_URL, neo4j.v1.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS));

const session = driver.session();
session.run('MATCH (a) RETURN a')
  .subscribe({
    onNext: (a) => {
      console.log(a._fields);
    },
  });
export default {
  driver,
};
