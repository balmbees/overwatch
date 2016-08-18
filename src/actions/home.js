import { UPDATE_COMPONENTS } from '../constants';

export function updateComponents(components, groups, contains) {
  return {
    type: UPDATE_COMPONENTS,
    data: {
      components,
      groups,
      contains,
    },
  };
}
