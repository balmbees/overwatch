/**
 * Created by leehyeon on 8/25/16.
 */

import React from 'react';
import SlackNotifierForm from './SlackNotifierForm';
import AwsSnsNotifierForm from './AwsSnsNotifierForm';

export default function NotifierForm({ data }) {
  const { type } = data;
  switch (type) {
    case 'SlackNotifier':
      return (
        <SlackNotifierForm name={data.name} webhookUrl={data.webhook_url} />
      );
    case 'AwsSnsNotifier':
      return (
        <AwsSnsNotifierForm
          name={data.name}
          awsAccessKeyId={data.awsAccessKeyId}
          awsSecretAccessKey={data.awsSecretAccessKey}
          awsRegion={data.awsRegion}
          targetArn={data.targetArn}
        />
      );
    default:
      return (
        <div>Invalid type.</div>
      );
  }
}

NotifierForm.propTypes = {
  data: React.PropTypes.object,
};

NotifierForm.defaultProps = {
  data: {
    name: '',
    type: 'SlackNotifier',
  },
};
