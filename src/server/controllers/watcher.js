/**
 * Created by leehyeon on 8/10/16.
 */

import { Router } from 'express';

import { watcherTypes, Watcher } from '../models/watcher';

export const WatchersRouter = new Router();

WatchersRouter.get('/', (req, res) => {
  Watcher.findAll()
    .then(watchers => res.json(watchers.map(w => new watcherTypes[w.type](w, w.id).serialize())));
});

WatchersRouter.post('/', (req, res) => {
  const paramType = req.body.type;

  if (!paramType) {
    res.status(400).json({ message: 'required field missing' });
  }

  new watcherTypes[paramType](req.body).insert()
    .then(w => res.json(w.serialize()), m => res.status(400).json({ message: m }));
});
