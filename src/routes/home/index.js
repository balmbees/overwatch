import React from 'react';
import Home, { TYPES } from './Home';

export default {
  path: '/',
  action({ query }) {
    return (
      <Home type={query.type || TYPES.GRAPH} />
    );
  },
};
