import { UPDATE_COMPONENTS } from '../constants';

export function updateComponents(components) {
  return {
    type: UPDATE_COMPONENTS,
    data: {
      components: components.map(
        c => c.serialize()
      ),
    },
  };
}
