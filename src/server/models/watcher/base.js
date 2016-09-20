import BaseModel, { jsonSchemaModel } from '../base';

@jsonSchemaModel({ title: 'Watcher' })
export default class Watcher extends BaseModel {
  watch() {
    throw new Error('Not Implemented');
  }
}
