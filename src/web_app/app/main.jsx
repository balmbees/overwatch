import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

// Router
import { Router, hashHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

// Socket
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import thunkMiddleware from 'redux-thunk';

import routes from './routes/index.jsx';
import rootReducer from './rootReducer.jsx';

const socket = io('http://0.0.0.0:3000');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const routerMid = routerMiddleware(hashHistory);
const store = createStore(
  rootReducer,
  applyMiddleware(socketIoMiddleware, routerMid, thunkMiddleware)
);

const appHistory = syncHistoryWithStore(
  hashHistory,
  store
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={appHistory} children={routes} />
  </Provider>,
  document.getElementById('root')
);
