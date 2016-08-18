/**
 * Created by leehyeon on 8/18/16.
 */
import { Router } from 'express';

import ComponentGroup from '../models/component_group';

export const ComponentGroupsRouter = new Router();

ComponentGroupsRouter.get('/', (req, res) => {
  ComponentGroup.fetchAll()
    .then(cgs => res.json(cgs.map(cg => cg.serialize())));
});

ComponentGroupsRouter.get('/', (req, res) => {
  ComponentGroup.fetchAll()
    .then(cgs => res.json(cgs.map(cg => cg.serialize())));
});

export const ComponentGroupRouter = new Router();

ComponentGroupRouter.post('/:componentGroupId/component/:componentId', (req, res) => {
  const { componentGroupId, componentId } = req.params;

  ComponentGroup.registerComponent(componentGroupId, componentId)
    .then(cg => res.json(cg.serialize()), m => res.status(400).json({ message: m }));
});

ComponentGroupRouter.delete('/:componentGroupId/component/:componentId', (req, res) => {
  const { componentGroupId, componentId } = req.params;

  ComponentGroup.deregisterComponent(componentGroupId, componentId)
    .then(cg => res.json(cg.serialize()), m => res.status(400).json({ message: m }));
});
