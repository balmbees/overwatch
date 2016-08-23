import React from 'react';
import Home, { TYPES } from './Home';

export default {
  path: '/',
  async action({ next, render, context, query }) { // eslint-disable-line
    const component = await next();
    if (component === undefined) return component;
    return (
      <Home type={query.type || TYPES.GRAPH}>
        {component}
      </Home>
    );
  },
  children: [
    {
      path: '/',
      action: () => (<h1>Posts</h1>),
    },
    {
      path: '/:id',
      action: (context) => (<h1>Post #{context.params.id}</h1>),
    },
  ],
};
