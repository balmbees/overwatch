import { UPDATE_COMPONENTS, UPDATE_COMPONENT } from '../constants';

export function updateComponents(components, groups, contains, depends) {
  return {
    type: UPDATE_COMPONENTS,
    data: {
      components,
      groups,
      contains,
      depends,
    },
  };
}

export function updateComponent(component) {
  return {
    type: UPDATE_COMPONENT,
    data: {
      component,
    },
  };
}
