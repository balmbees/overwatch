import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  app: (state = {}, action) => {
    console.log(action);
    switch (action.type) {
      case 'message':
        return Object.assign({}, { message: action.data });
      default:
        return state;
    }
  },
  routing: routerReducer,
});

export default rootReducer;
