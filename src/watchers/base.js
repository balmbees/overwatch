export default class BaseWatcher {
  constructor(settings) {
    this.settings = settings;
  }

  // return Promise, with resolve(result: WatchResult), reject(error: Error)
  watch() {
    throw new Error(`${this.className}.watch, Not Implemented`);
  }
}
