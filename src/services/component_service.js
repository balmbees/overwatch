import $ from 'jquery';
import _ from 'lodash';

import componentSchema from '../server/models/component_schema.json';


export default class ComponentService {
  static save(data) {
    return new Promise((resolve, reject) => {
      $.post('/api/cypher/save', {
        node: {
          label: componentSchema.title,
          data: _.pick(data, Object.keys(componentSchema.properties).concat(['id'])),
        },
      }).then(resolve, reject);
    });
  }
}
