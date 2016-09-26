import React from 'react';
import ComponentModal, { MODES } from '../home/ComponentsGraph/ComponentModal';

import $ from 'jquery';

export default {
  path: '/components/:id',
  async action({ params }) { // eslint-disable-line
    const node = await new Promise((resolve, reject) => {
      $.getJSON('/api/cypher/read', {
        id: params.id,
      })
      .done(resolve)
      .fail(reject);
    });

    return (
      <ComponentModal
        component={{ data: node }}
        close={() => goBack()}
        initialMode={MODES.EDIT}
      />
    );
  },
};
