/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function SlackNotifier({ name, webhookUrl }) {
  return (
    <div>
      <label>name</label>
      <input type="text" name="name" value={name} />
      <label>webhookUrl</label>
      <input type="text" name="webhookUrl" value={webhookUrl} />
    </div>
  );
}

SlackNotifier.propTypes = {
  name: React.PropTypes.string,
  webhookUrl: React.PropTypes.string,
};

SlackNotifier.defaultProps = {
  name: '',
  webhookUrl: '',
};
