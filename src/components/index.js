import _ from 'underscore';

export default class Component {
  constructor(settings) {
    Object.assign(this, _.pick(settings, [
      'name',
      'description',
      'watchResult',
      'notifier',
      'watcher',
    ]));
  }

  set watchResult(watchResult) {
    this._watchResult = watchResult;
    if (this.notifier && watchResult) {
      this.notifier.notify(this);
    }
  }

  get watchResult() {
    return this._watchResult;
  }

  watch() {
    return this.watcher.watch().then((watchResult) => {
      this.watchResult = watchResult;
      return Promise.resolve(this);
    });
  }
}
