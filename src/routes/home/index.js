import React from 'react';
import Home, { TYPES } from './Home';

export default {
  path: '/',
  children: [
    {
      path: '/about',
      action() {
        return (
          <h3>ABOUT</h3>
        );
      },
    },
  ],
  async action({ query, next }) {
    const component = await next();
    return (
      <Home type={query.type || TYPES.GRAPH}>
        {component}
      </Home>
    );
  },
};
