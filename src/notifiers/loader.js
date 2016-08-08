import notifiers from '.';

export default class NotifierLoader {
  static load(object) {
    const type = notifiers[object.type];
    if (!type) {
      throw new Error(`"${object.type}" is not supported Notifier`);
    }

    return new type(object);
  }
}
