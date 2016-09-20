import Notifier from './base';
import polymorphs from './polymorphs';

function fromArray(array) {
  return array.map(data => new polymorphs[data.type](data));
}

export const notifierPool = {};
export {
  Notifier,
  fromArray,
  polymorphs as notifierTypes,
};
