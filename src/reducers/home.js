import {
  UPDATE_COMPONENTS,
  UPDATE_COMPONENT,
} from '../constants';

export default function home(state = { data: { components: {} } }, action) {
  switch (action.type) {
    case UPDATE_COMPONENTS: {
      return {
        ...state,
        data: action.data,
      };
    }
    case UPDATE_COMPONENT: {
      const newState = { ...state };
      const component = action.data;
      newState.data.components[component.id] = component;
      return newState;
    }
    default:
      return state;
  }
}
