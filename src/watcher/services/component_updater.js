import Component from '../models/component';

export default class ComponentsUpdater {
  updateAll() {
    return Component.fetchAll()
      .then((components) => {
        const watchAll = Promise.all(components.map(c => c.watch()));
        return watchAll.then(() => Promise.resolve(components));
      });
  }
}
