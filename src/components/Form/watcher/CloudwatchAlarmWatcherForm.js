/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function CloudwatchAlarmWatcherForm({
  name,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  alarmName,
}) {
  return (
    <div>
      <label>name</label><br />
      <input type="text" name="name" value={name} /><br /><br />
      <label>awsAccessKeyId</label><br />
      <input type="text" name="awsAccessKeyId" value={awsAccessKeyId} /><br /><br />
      <label>awsSecretAccessKey</label><br />
      <input type="text" name="awsSecretAccessKey" value={awsSecretAccessKey} /><br /><br />
      <label>awsRegion</label><br />
      <input type="text" name="awsRegion" value={awsRegion} /><br /><br />
      <label>alarmName</label><br />
      <input type="text" name="alarmName" value={alarmName} /><br /><br />
    </div>
  );
}

CloudwatchAlarmWatcherForm.propTypes = {
  name: React.PropTypes.string,
  awsAccessKeyId: React.PropTypes.string,
  awsSecretAccessKey: React.PropTypes.string,
  awsRegion: React.PropTypes.string,
  alarmName: React.PropTypes.string,
};

CloudwatchAlarmWatcherForm.defaultProps = {
  name: '',
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
  awsRegion: 'us-east-1',
  alarmName: '',
};
