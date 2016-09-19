import _ from 'lodash';
import { Router } from 'express';

import Component from '../models/component';
import { watcherTypes } from '../models/watcher';

export const ComponentRouter = new Router();
