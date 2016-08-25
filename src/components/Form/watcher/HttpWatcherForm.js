/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function HttpWatcherForm({ name, url }) {
  return (
    <div>
      <label>name</label><br />
      <input type="text" name="name" value={name} /><br /><br />
      <label>url</label><br />
      <input type="url" name="url" value={url} /><br /><br />
    </div>
  );
}

HttpWatcherForm.propTypes = {
  name: React.PropTypes.string,
  url: React.PropTypes.string,
};

HttpWatcherForm.defaultProps = {
  name: '',
  url: '',
};
