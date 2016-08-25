/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function AwsSnsNotifierForm({
  name,
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  targetArn,
}) {
  return (
    <div>
      <label>name</label>
      <input type="text" name="name" value={name} />
      <label>awsAccessKeyId</label>
      <input type="text" name="awsAccessKeyId" value={awsAccessKeyId} />
      <label>awsSecretAccessKey</label>
      <input type="text" name="awsSecretAccessKey" value={awsSecretAccessKey} />
      <label>awsRegion</label>
      <input type="text" name="awsRegion" value={awsRegion} />
      <label>targetArn</label>
      <input type="text" name="targetArn" value={targetArn} />
    </div>
  );
}

AwsSnsNotifierForm.propTypes = {
  name: React.PropTypes.string,
  awsAccessKeyId: React.PropTypes.string,
  awsSecretAccessKey: React.PropTypes.string,
  awsRegion: React.PropTypes.string,
  targetArn: React.PropTypes.string,
};

AwsSnsNotifierForm.defaultProps = {
  name: '',
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
  awsRegion: 'us-east-1',
  targetArn: '',
};
