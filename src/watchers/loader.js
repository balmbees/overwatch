import watchers from '.';

export default class WatcherLoader {
  static load(object) {
    const type = watchers[object.type];
    if (!type) {
      throw new Error(`"${type}" is not supported Watcher`);
    }

    return new type(object.settings);
  }
}
