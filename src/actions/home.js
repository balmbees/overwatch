import { UPDATE_COMPONENTS } from '../constants';

export function updateComponents(components) {
  return {
    type: UPDATE_COMPONENTS,
    data: {
      components: components.map(
        c => ({
          id: c.id,
          name: c.name,
          status: c.status,
        })
      ),
    },
  };
}
