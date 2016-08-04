import NotifierLoader from '../notifiers/loader';
import WatcherLoader from '../watchers/loader';
import Component from './index';

export default class ComponentLoader {
  static load(settings) {
    settings.notifier = NotifierLoader.load(settings.notifier);
    settings.watcher = WatcherLoader.load(settings.watcher);

    return new Component(settings);
  }
}
