import NotifierPool from '../notifiers/pool';
import WatcherLoader from '../watchers/loader';
import Component from './index';

export default class ComponentLoader {
  static load(settings, notifierSettings, watcherSettings) {
    settings.notifier = NotifierPool.getNotifier(notifierSettings);
    settings.watcher = WatcherLoader.load(watcherSettings);

    return new Component(settings);
  }
}
