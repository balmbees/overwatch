/**
 * Created by leehyeon on 8/10/16.
 */
import _ from 'lodash';
import { Router } from 'express';

import Component from '../models/component';
import { watcherTypes } from '../models/watcher';

export const ComponentsRouter = new Router();

ComponentsRouter.get('/', (req, res) => {
  Component.fetchAll()
    .then(components => Promise.all(components.map(c =>
      Promise.all([c.getWatchers(), c.getNotifiers(), c.getGroups()])
        .then(() => c.serialize())
    ))).then(r => res.json(r));
});

ComponentsRouter.post('/', (req, res) => {
  const paramName = req.body.name;

  if (!paramName) {
    res.status(400).json({ message: 'required field missing' });
  }

  new Component({ name: paramName }).insert()
    .then(c => {
      const notifierIds = req.body.notifierIds;
      const watchers = req.body.watchers;
      Promise.all(
        watchers.filter(w => w.type in watcherTypes)
          .map(w => new watcherTypes[w.type](w).insert())
      ).then(watcherList => {
        Promise.all(
          _.flatten(
            watcherList.map(w => Component.registerWatcher(c.id, w.id)),
            notifierIds.map(nid => Component.registerNotifier(c.id, nid))
          )
        ).then(() => res.json(c.serialize()), m => res.status(400).json({ message: m }));
      });
    });
});

export const ComponentRouter = new Router();

ComponentRouter.post('/:componentId/watcher/:watcherId', (req, res) => {
  const componentId = req.params.componentId;
  const watcherId = req.params.watcherId;

  Component.registerWatcher(componentId, watcherId)
    .then(c => Promise.all([c.getNotifiers(), c.getWatchers])
      .then(() => res.json(c.serialize())), m => res.status(400).json({ message: m }));
});


ComponentRouter.post('/:componentId/notifier/:notifierId', (req, res) => {
  const componentId = req.params.componentId;
  const notifierId = req.params.notifierId;

  Component.registerNotifier(componentId, notifierId)
    .then(c => Promise.all([c.getNotifiers(), c.getWatchers])
      .then(() => res.json(c.serialize())), m => res.status(400).json({ message: m }));
});
