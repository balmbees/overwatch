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

  watch() {
    return this.watcher.watch();
  }
}
