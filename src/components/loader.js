import WatcherLoader from '../watchers/loader';
import Component from './index';
import getNotifier from '../notifiers/pool';

export default class ComponentLoader {
  static load(settings, notifierSettings, watcherSettings) {
    settings.notifier = getNotifier(notifierSettings);
    settings.watcher = WatcherLoader.load(watcherSettings);

    return new Component(settings);
  }
}
