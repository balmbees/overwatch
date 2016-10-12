import React from 'react';
import { connect } from 'react-redux';
import WatcherModal from './WatcherModal';

import { goBack } from '../../actions/route';
import $ from 'jquery';

const WatcherPage = connect(null, { close: goBack })(WatcherModal);

export default {
  path: '/:componentId/watchers/new',
  async action(ctx) { // eslint-disable-line
    const { params } = ctx;
    const component = await new Promise((resolve, reject) => {
      $.getJSON('/api/cypher/read', {
        id: params.componentId,
        label: 'Component',
      })
      .done(resolve)
      .fail(reject);
    });

    const watcher = { type: 'HttpWatcher' };

    return (
      <WatcherPage
        component={{ data: component }}
        watcher={{ data: watcher }}
      />
    );
  },
};
