export default class BaseComponent {
  constructor(options) {
    this.name = options.name;
    this.descriptions = options.descriptions;
    this.status = options.status;
    this.notifier = options.notifer;
    this.watcher = options.watcher;
  }
}
