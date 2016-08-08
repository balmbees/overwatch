import Component from './components/index';

Component.fetchAll().then((components) => {
  Promise.all(components.map((c) => c.watch()))
    .then((component) => {
      console.log(component);
    });
});

