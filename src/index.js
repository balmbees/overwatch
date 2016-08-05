import requireDir from 'require-dir';
import ComponentLoader from './components/loader';

const dir = requireDir('./database/components');

const components = Object.keys(dir).map((key) => {
  const value = dir[key];
  return ComponentLoader.load(value);
});

Promise.all(components.map((c) => c.watch()))
  .then((components) => {
  });
