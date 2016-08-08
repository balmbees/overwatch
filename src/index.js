import Component from './components/index';
import NotifierPool from './notifiers/pool';

Component.fetchAll().then((components) => {
  Promise.all(components.map((c) => c.watch()))
    .then((component) => {
      console.log(component);
    });
});

