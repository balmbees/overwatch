import requireDir from 'require-dir';
import ComponentLoader from './components/loader';
import NotifierPool from './notifiers/pool';

const dir = requireDir('../database/components');


NotifierPool.initPool().then(() => {
  const components = Object.keys(dir).map((key) => {
    const value = dir[key];
    return ComponentLoader.load(value);
  });

  Promise.all(components.map((c) => c.watch()))
    .then((component) => {
      console.log(component);
    });
});

