import _ from 'underscore';

export default class Component {
  constructor(settings) {
    Object.assign(this, _.pick(settings, [
      'name',
      'description',
      'status',
      'notifier',
      'watcher',
    ]));
  }

  set watchResult(watchResult) {
    this._watchResult = watchResult;
  }

  watch() {
    return this.watcher.watch().then((watchResult) => {
      this.watchResult = watchResult;
      return Promise.resolve(this);
    });
  }
}
