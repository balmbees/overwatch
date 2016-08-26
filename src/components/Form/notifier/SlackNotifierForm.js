/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function SlackNotifier({ data, handleChangeField }) {
  const { name, webhookUrl } = data;
  return (
    <div>
      <label>name</label><br />
      <input
        type="text"
        value={name}
        onChange={e => handleChangeField('name', e)}
      /><br /><br />
      <label>webhookUrl</label><br />
      <input
        type="text"
        value={webhookUrl}
        onChange={e => handleChangeField('webhookUrl', e)}
      /><br /><br />
    </div>
  );
}

SlackNotifier.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

SlackNotifier.defaultProps = {
  data: {
    type: 'SlackNotifier',
    name: '',
    webhookUrl: '',
  },
};
