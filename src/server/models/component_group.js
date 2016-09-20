import BaseModel, { jsonSchemaModel } from './base';
import Component from './component';

@jsonSchemaModel(require('./component_group_schema')) // eslint-disable-line
class ComponentGroup extends BaseModel {}
ComponentGroup.model.compose(Component.model, 'components', 'CONTAINS');

export default ComponentGroup;
