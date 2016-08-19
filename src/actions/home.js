import { UPDATE_COMPONENTS } from '../constants';

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
