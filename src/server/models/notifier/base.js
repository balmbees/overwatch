import BaseModel, { jsonSchemaModel } from '../base';

import { STATUS_SUCCESS } from '../watch_result';

@jsonSchemaModel({ title: 'Notifier' })
export default class Notifier extends BaseModel {
  notify({ component, watcher, watchResult }) {
    throw new Error(`Not Implemented : ${component}, ${watcher}, ${watchResult}`);
  }

  message({ component, watcher, watchResult }) {
    if (component.status === STATUS_SUCCESS) {
      return `${component.name} back to normal status!`;
    }
    return `${component.name} - ${watcher.name} : *${watchResult.status}* ${watchResult.description}` // eslint-disable-line
  }
}
