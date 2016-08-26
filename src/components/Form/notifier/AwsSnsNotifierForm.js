/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function AwsSnsNotifierForm({ data, handleChangeField }) {
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
      <label>targetArn</label><br />
      <input
        type="text"
        value={data.targetArn}
        onChange={e => handleChangeField('targetArn', e)}
      /><br /><br />
    </div>
  );
}

AwsSnsNotifierForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

AwsSnsNotifierForm.defaultProps = {
  data: {
    type: 'AwsSnsNotifier',
    name: '',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1',
    targetArn: '',
  },
};
