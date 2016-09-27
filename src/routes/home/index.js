import React from 'react';
import Home, { TYPES } from './Home';
import aboutRoute from '../about';
import componentRoute from '../component';

export default {
  path: '/',
  children: [
    aboutRoute,
    componentRoute,
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
