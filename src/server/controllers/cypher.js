import { Router } from 'express';
import seraph from 'seraph';
import URL from 'url';

const cypherRouter = new Router();
const url = URL.parse(process.env.GRAPHENEDB_URL);
const dbConnection = seraph({
  server: `${url.protocol}//${url.host}`,
  user: url.auth.split(':')[0],
  pass: url.auth.split(':')[1],
});

cypherRouter.post('/', (req, res) => {
  const body = req.body;
  const node = body.node;

  dbConnection.save(node.data, node.label, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

export default cypherRouter;
