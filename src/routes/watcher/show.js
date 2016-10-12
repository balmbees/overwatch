import React from 'react';
import { connect } from 'react-redux';

import WatcherModal from './WatcherModal';
import $ from 'jquery';

import { goBack } from '../../actions/route';

const WatcherPage = connect(null, { close: goBack })(WatcherModal);

export default {
  path: '/:componentId/watchers/:watcherId',
  async action(ctx) { // eslint-disable-line
    const { params } = ctx;
    const [component, watcher] = await Promise.all([
      new Promise((resolve, reject) => {
        $.getJSON('/api/cypher/read', {
          id: params.componentId,
          label: 'Component',
        })
        .done(resolve)
        .fail(reject);
      }),
      new Promise((resolve, reject) => {
        $.getJSON('/api/cypher/read', {
          id: params.watcherId,
          label: 'Watcher',
        })
        .done(resolve)
        .fail(reject);
      }),
    ]);

    return (
      <WatcherPage
        component={{ data: component }}
        watcher={{ data: watcher }}
      />
    );
  },
};
