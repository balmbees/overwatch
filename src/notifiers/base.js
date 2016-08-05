export default class BaseNotifier {
  constructor(settings) {
    this.settings = settings;
  }

  notify(component/* : Component */) /* : Promise */ {
    throw new Error(`Not Implemented : ${component}`);
  }

  message(component) {
    return `[${component.name}] status : ${component.watchResult.status}\n"${component.watchResult.description}"`;
  }
}
