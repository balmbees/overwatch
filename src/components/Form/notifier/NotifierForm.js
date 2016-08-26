/**
 * Created by leehyeon on 8/25/16.
 */

import React from 'react';
import SlackNotifierForm from './SlackNotifierForm';
import AwsSnsNotifierForm from './AwsSnsNotifierForm';

export default function NotifierForm({ data, handleChangeField }) {
  const { type } = data;

  switch (type) {
    case 'AwsSnsNotifier':
      return (
        <AwsSnsNotifierForm data={data} handleChangeField={handleChangeField} />
      );
    case 'SlackNotifier':
    default:
      return (
        <SlackNotifierForm data={data} handleChangeField={handleChangeField} />
      );
  }
}

NotifierForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

NotifierForm.defaultProps = {
  data: {
    name: '',
    type: 'SlackNotifier',
  },
};
