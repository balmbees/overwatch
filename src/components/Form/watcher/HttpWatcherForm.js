/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function HttpWatcherForm({ data, handleChangeField }) {
  return (
    <div>
      <label>name</label><br />
      <input
        type="text"
        value={data.name}
        onChange={e => handleChangeField('name', e)}
      /><br /><br />
      <label>url</label><br />
      <input
        type="url"
        name="url"
        value={data.url}
        onChange={e => handleChangeField('url', e)}
      /><br /><br />
    </div>
  );
}

HttpWatcherForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

HttpWatcherForm.defaultProps = {
  data: {
    name: '',
    url: '',
  },
};
