import Component from '../models/component';

export default class ComponentsUpdater {
  updateAll() {
    return Component.findAll({
      include: {
        depends: {
          model: Component.model,
          rel: 'DEPEND',
          direction: 'out',
          many: true,
        },
      },
    })
    .then((components) => {
      const watchAll = Promise.all(components.map(c => c.watch()));
      return watchAll.then(() => Promise.resolve(components));
    });
  }
}
