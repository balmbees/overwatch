import React from 'react';

import create from './create';
import show from './show';

export default {
  path: '/components',
  children: [
    create,
    show,
  ],
  async action({ next }) { // eslint-disable-line
    const component = await next();
    return (
      <div>
        {component}
      </div>
    );
  },
};
