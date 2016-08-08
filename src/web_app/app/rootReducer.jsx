import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  app: (state = { status: [] }, action) => {
    switch (action.type) {
      case 'STATUS_UPDATE':
        return {
          status: action.data,
        };
      default:
        return state;
    }
  },
  routing: routerReducer,
});

export default rootReducer;
