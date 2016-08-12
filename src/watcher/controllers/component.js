/**
 * Created by leehyeon on 8/10/16.
 */

import { Router } from 'express';

import Component from '../models/component';

export const ComponentsRouter = new Router();

ComponentsRouter.get('/', (req, res) => {
  Component.fetchAll()
    .then(components => Promise.all(components.map(c =>
      Promise.all([c.getWatchers(), c.getNotifiers()])
        .then(r => {
          const result = c.serialize();
          const [watchers, notifiers] = r;
          result.watchers = watchers;
          result.notifiers = notifiers;

          return result;
        })
    ))).then(r => res.json(r));
});

ComponentsRouter.post('/', (req, res) => {
  const paramName = req.body.name;

  if (!paramName) {
    res.status(400).json({ message: 'required field missing' });
  }

  new Component({ name: paramName }).insert()
    .then(c => res.json(c), m => res.status(400).json({ message: m }));
});

export const ComponentRouter = new Router();

ComponentRouter.post('/:componentId/watcher/:watcherId', (req, res) => {
  const componentId = req.params.componentId;
  const watcherId = req.params.watcherId;

  Component.registerWatcher(componentId, watcherId)
    .then(c => res.json(c.serialize()), m => res.status(400).json({ message: m }));
});


ComponentRouter.post('/:componentId/notifier/:notifierId', (req, res) => {
  const componentId = req.params.componentId;
  const notifierId = req.params.notifierId;

  Component.registerNotifier(componentId, notifierId)
    .then(c => res.json(c.serialize()), m => res.status(400).json({ message: m }));
});
