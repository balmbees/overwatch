import React from 'react';
import { connect } from 'react-redux';
import ComponentModal, { MODES } from './ComponentModal';

import { goBack } from '../../actions/route';

const ComponentPage = connect(null, { close: goBack })(ComponentModal);

export default {
  path: '/new',
  async action() { // eslint-disable-line
    const node = {
      data: {
        watchers: [],
      },
    };
    return (
      <ComponentPage
        component={{ data: node }}
        initialMode={MODES.EDIT}
      />
    );
  },
};
