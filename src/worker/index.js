/**
 * Created by leehyeon on 8/9/16.
 */

import Component from './models/component';

export default function work() {
  Component.fetchAll().then(components => {
    components.forEach(component => {
      component.watch();
    });
  });
}
