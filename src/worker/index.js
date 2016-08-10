/**
 * Created by leehyeon on 8/9/16.
 */

import Component from './models/component';

export default function work() {
  return Component.fetchAll()
    .then((components) => {
      const watchAll = Promise.all(components.map(c => c.watch()));
      return watchAll.then(() => Promise.resolve(components));
    });
}
