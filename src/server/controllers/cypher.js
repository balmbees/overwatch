import { Router } from 'express';
import DB from '../services/db';

const cypherRouter = new Router();

const dbConnection = DB.connect();

cypherRouter.post('/save', (req, res) => {
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

cypherRouter.get('/read', (req, res) => {
  const id = JSON.parse(req.query.id);
  dbConnection.read(id, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

cypherRouter.post('/delete', (req, res) => {
  const body = req.body;
  const node = body.node;

  dbConnection.delete(node, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

cypherRouter.get('/find', (req, res) => {
  const predicate = JSON.parse(req.query.predicate || '{}');
  const label = req.query.label;
  dbConnection.find(predicate, label, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({
        data: result,
      });
    }
  });
});

export default cypherRouter;
