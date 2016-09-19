/**
 * Created by leehyeon on 8/18/16.
 */
import { Router } from 'express';

import ComponentGroup from '../models/component_group';

export const ComponentGroupsRouter = new Router();

ComponentGroupsRouter.get('/', (req, res) => {
  ComponentGroup.findAll()
    .then(cgs => res.json(cgs.map(cg => cg.serialize())));
});

export const ComponentGroupRouter = new Router();
