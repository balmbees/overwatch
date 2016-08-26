/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function CloudwatchAlarmWatcherForm({ data, handleChangeField }) {
  return (
    <div>
      <label>name</label><br />
      <input
        type="text"
        value={data.name}
        onChange={e => handleChangeField('name', e)}
      /><br /><br />
      <label>awsAccessKeyId</label><br />
      <input
        type="text"
        value={data.awsAccessKeyId}
        onChange={e => handleChangeField('awsAccessKeyId', e)}
      /><br /><br />
      <label>awsSecretAccessKey</label><br />
      <input
        type="text"
        value={data.awsSecretAccessKey}
        onChange={e => handleChangeField('awsSecretAccessKey', e)}
      /><br /><br />
      <label>awsRegion</label><br />
      <input
        type="text"
        value={data.awsRegion}
        onChange={e => handleChangeField('awsRegion', e)}
      /><br /><br />
      <label>alarmName</label><br />
      <input
        type="text"
        value={data.alarmName}
        onChange={e => handleChangeField('alarmName', e)}
      /><br /><br />
    </div>
  );
}

CloudwatchAlarmWatcherForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

CloudwatchAlarmWatcherForm.defaultProps = {
  data: {
    name: '',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    alarmName: '',
  },
};
