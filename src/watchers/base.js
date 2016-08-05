import _s from 'underscore.string';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export default class BaseWatcher {
  constructor(settings) {
    this.settings = _.defaultsDeep(settings, this.constructor.globalSettings());
  }

  static globalSettings() {
    const className = _s(this.name).underscored().value();
    const rawFile = fs.readFileSync(path.resolve(__dirname, `../../database/watchers/${className}.json`), 'utf8');
    if (!rawFile) {
      throw new Error(`${this.name} should have global config file but could not find it`);
    }
    const model = JSON.parse(rawFile);
    return model.settings;
  }

  // return Promise, with resolve(result: WatchResult), reject(error: Error)
  watch() {
    throw new Error(`${this.className}.watch, Not Implemented`);
  }
}
