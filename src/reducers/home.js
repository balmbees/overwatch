import { UPDATE_COMPONENTS } from '../constants';

export default function home(state = { data: { components: [] } }, action) {
  switch (action.type) {
    case UPDATE_COMPONENTS:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
}
