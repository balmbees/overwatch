import { Router } from 'express';
import DB from '../services/db';

const cypherRouter = new Router();

const dbConnection = DB.connect();
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
