/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';
import HttpWatcherForm from './HttpWatcherForm';
import CloudwatchAlarmWatcherForm from './CloudwatchAlarmWatcherForm';
import DummyWatcherForm from './DummyWatcherForm';

export default function WatcherForm({ data }) {
  const { type } = data;
  switch (type) {
    case 'HttpWatcher':
      return (
        <HttpWatcherForm
          name={data.name}
          url={data.url}
        />
      );
    case 'CloudwatchAlarmWatcher':
      return (
        <CloudwatchAlarmWatcherForm
          name={data.name}
          awsAccessKeyId={data.awsAccessKeyId}
          awsSecretAccessKey={data.awsSecretAccessKey}
          awsRegion={data.awsRegion}
          alarmNam={data.alarmName}
        />
      );
    case 'DummyWatcher':
      return (
        <DummyWatcherForm name={data.name} />
      );
    default:
      return (
        <div>Invalid type.</div>
      );
  }
}

WatcherForm.propTypes = {
  data: React.PropTypes.object,
};

WatcherForm.defaultProps = {
  data: {
    name: '',
    type: 'HttpWatcher',
  },
};

