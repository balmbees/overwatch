import _ from 'lodash';
import WatchResult from '../../watch_result';
import Watcher from '../base';

export default class DummyWatcher extends Watcher {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name']), id);
    this.result = WatchResult.success();
  }

  serialize() {
    return _.pick(this,
      ['type', 'id', 'name']);
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name'], (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

  watch() {
    return this.result;
  }
}
