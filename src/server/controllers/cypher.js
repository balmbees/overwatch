import { Router } from 'express';
import DB from '../services/db';

import Component from '../models/component';
import Watcher, { fromArray, watcherTypes } from '../models/watcher';

const cypherRouter = new Router();
const dbConnection = DB.connect();

const ALL_MODELS = {};
ALL_MODELS[Component.name] = Component;

const POLYMORPHIC_MODLES = {};
POLYMORPHIC_MODLES[Watcher.name] = watcherTypes;

cypherRouter.post('/save', (req, res) => {
  const body = req.body;
  const node = body.node;

  if (ALL_MODELS[node.label]) {
    ALL_MODELS[node.label]
      .create(node.data)
      .then((model) => {
        res.status(200).json(model.serialize());
      }, (err) => {
        res.status(400).json({ error: err.message });
      });
  } else if (POLYMORPHIC_MODLES[node.label]) {
    const ModelType = POLYMORPHIC_MODLES[node.label][node.data.type];
    ModelType
      .create(node.data)
      .then((model) => {
        res.status(200).json(model.serialize());
      }, (err) => {
        res.status(400).json({ error: err.message });
      });
  } else {
    dbConnection.save(node.data, node.label, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(200).json(result);
      }
    });
  }
});

cypherRouter.get('/read', (req, res) => {
  const id = req.query.id;
  const label = req.query.label;

  if (ALL_MODELS[label]) {
    ALL_MODELS[label].read(id).then((result) => {
      res.status(200).json(result);
    }, (err) => {
      res.status(400).json({ error: err.message });
    });
  } else {
    dbConnection.read(id, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        if (label === Watcher.name) {
          const model = fromArray([result])[0];
          res.status(200).json(model.serialize());
        } else {
          res.status(200).json(result);
        }
      }
    });
  }
});

cypherRouter.post('/delete', (req, res) => {
  const body = req.body;
  const node = body.node;

  dbConnection.delete(node, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ status: 'success' });
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

cypherRouter.post('/relate', (req, res) => {
  const {
    firstId,
    type,
    properties,
    secondId,
  } = req.body;

  dbConnection.relate(firstId, type, secondId, properties, (err, relationship) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({
        data: relationship,
      });
    }
  });
});

export default cypherRouter;
