import _s from 'underscore.string';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

import NotifierLoader from './loader';

const notifiers = {};

// Glob must perform a synchronous job
glob.sync(path.resolve(__dirname, '../../database/notifiers/*.json')).forEach((filepath) => {
  const f = fs.readFileSync(filepath);
  if (!f) {
    return;
  }
  const notifierSettings = JSON.parse(f);
  const notifierName = _s.capitalize(_s.camelize(path.basename(filepath, '.json')));
  notifiers[notifierName] = NotifierLoader.load(notifierSettings);
});

export default {
  notifiers,
};
