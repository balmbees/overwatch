/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

import WatcherForm from './watcher/WatcherForm';
import NotifierForm from './notifier/NotifierForm';

export default function Form({ label, data }) {
  switch (label) {
    case 'Watcher':
      return (
        <WatcherForm data={data} />
      );
    case 'Notifier':
      return (
        <NotifierForm data={data} />
      );
    default:
      return (
        <div>
          Invalid label.
        </div>
      );
  }
}

Form.propTypes = {
  label: React.PropTypes.string.isRequired,
  data: React.PropTypes.object,
};

Form.defaultProps = {
  label: 'Component',
  data: {},
};
