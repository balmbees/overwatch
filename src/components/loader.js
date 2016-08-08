import NotifierPool from '../notifiers/pool';
import WatcherLoader from '../watchers/loader';
import Component from './index';

export default class ComponentLoader {
  static load(settings) {
    settings.notifier = NotifierPool.getNotifier(settings.notifier);
    settings.watcher = WatcherLoader.load(settings.watcher);

    return new Component(settings);
  }
}
