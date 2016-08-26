/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';
import HttpWatcherForm from './HttpWatcherForm';
import CloudwatchAlarmWatcherForm from './CloudwatchAlarmWatcherForm';
import DummyWatcherForm from './DummyWatcherForm';

export default function WatcherForm({ data, handleChangeField }) {
  const { type } = data;

  switch (type) {
    case 'CloudwatchAlarmWatcher':
      return (
        <CloudwatchAlarmWatcherForm data={data} handleChangeField={handleChangeField} />
      );
    case 'HttpWatcher':
      return (
        <HttpWatcherForm data={data} handleChangeField={handleChangeField} />
      );
    case 'DummyWatcher':
    default:
      return (
        <DummyWatcherForm data={data} handleChangeField={handleChangeField} />
      );
  }
}

WatcherForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

WatcherForm.defaultProps = {
  data: {
    name: '',
    type: 'HttpWatcher',
  },
};
