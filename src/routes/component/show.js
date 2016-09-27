import React from 'react';
import { connect } from 'react-redux';
import ComponentModal, { MODES } from './ComponentModal';
import $ from 'jquery';

import { goBack } from '../../actions/route';

const ComponentPage = connect(null, { close: goBack })(ComponentModal);

export default {
  path: '/:id',
  async action({ params }) { // eslint-disable-line
    const node = await new Promise((resolve, reject) => {
      $.getJSON('/api/cypher/read', {
        id: params.id,
        label: 'Component',
      })
      .done(resolve)
      .fail(reject);
    });

    return (
      <ComponentPage
        component={{ data: node }}
        initialMode={MODES.SHOW}
      />
    );
  },
};
