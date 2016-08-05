import _s from 'underscore.string';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

import NotifierLoader from './loader';

let _instance = null;

export default class NotifierPool {
  constructor() {
    if (!_instance) {
      this.notifiers = {};
      this._loadNotifiers();

      _instance = this;
    }

    return _instance;
  }

  getNotifier(className) {
    return this.notifiers[className];
  }

  _loadNotifiers() {
    const that = this;

    // Glob must perform a synchronous job
    glob.sync(path.resolve(__dirname, `../database/notifiers/*.json`)).forEach((filepath) => {
      const f = fs.readFileSync(filepath);
      if (!f) {
        return;
      }
      const notifierSettings = JSON.parse(f);
      const className = _s.capitalize(_s.camelize(path.basename(filepath, `.json`)));
      that.notifiers[className] = NotifierLoader.load({type: className, settings: notifierSettings})
    });
  }


}