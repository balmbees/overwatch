import NotifierPool from '../notifiers/pool';
import WatcherLoader from '../watchers/loader';
import Component from './index';

export default class ComponentLoader {
  static load(settings) {
    const notifierPool = new NotifierPool();

    settings.notifier = notifierPool.getNotifier(settings.notifier);
    settings.watcher = WatcherLoader.load(settings.watcher);

    return new Component(settings);
  }
}
