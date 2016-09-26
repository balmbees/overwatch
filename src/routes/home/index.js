import React from 'react';
import Home, { TYPES } from './Home';
import about from '../about';
import component from '../component'

export default {
  path: '/',
  children: [
    about,
    component,
  ],
  async action({ query, next }) { // eslint-disable-line
    const component = await next();
    return (
      <Home type={query.type || TYPES.GRAPH}>
        {component}
      </Home>
    );
  },
};
