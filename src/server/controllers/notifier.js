import { Router } from 'express';

import { Notifier, notifierTypes } from '../models/notifier';

export const NotifiersRouter = new Router();

NotifiersRouter.get('/', (req, res) => {
  Notifier.findAll()
    .then(notifiers =>
      res.json(notifiers.map(n => new notifierTypes[n.type](n, n.id).serialize()))
    );
});

NotifiersRouter.post('/', (req, res) => {
  const paramType = req.body.type;

  if (!paramType) {
    res.status(400).json({ message: 'required field missing' });
  }

  new notifierTypes[paramType](req.body).insert()
    .then(n => res.json(n), m => res.status(400).json({ message: m }));
});
