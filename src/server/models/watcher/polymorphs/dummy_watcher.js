import Watcher from '../base';

import { jsonSchemaModel } from '../../base';

import WatchResult from '../../watch_result';

@jsonSchemaModel(require('./dummy_watcher_schema')) // eslint-disable-line
export default class DummyWatcher extends Watcher {
  watch() {
    this.result = WatchResult.success('Dummy checking success');
    return Promise.resolve(this.result);
  }
}
