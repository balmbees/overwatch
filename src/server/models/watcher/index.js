import watcherPolymorphs from './polymorphs';
import Watcher from './base';

function fromArray(array) {
  return array.map(data => new watcherPolymorphs[data.type](data));
}

export default Watcher;

export {
  Watcher,
  watcherPolymorphs as watcherTypes,
  fromArray,
};
