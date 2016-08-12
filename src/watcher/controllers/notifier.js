/**
 * Created by leehyeon on 8/11/16.
 */

import { Router } from 'express';

import { notifierTypes } from '../models/notifier';

export const NotifiersRouter = new Router();

NotifiersRouter.post('/', (req, res) => {
  const paramType = req.body.type;

  if (!paramType) {
    res.status(400).json({ message: 'required field missing' });
  }

  new notifierTypes[paramType](req.body).insert()
    .then(n => res.json(n.serialize()), m => res.status(400).json({ message: m }));
});
