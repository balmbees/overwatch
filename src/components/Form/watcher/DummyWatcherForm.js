/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function DummyWatcherForm({ data, handleChangeField }) {
  return (
    <div>
      <label>name</label><br />
      <input
        type="text"
        value={data.name}
        onChange={e => handleChangeField('name', e)}
      /><br /><br />
    </div>
  );
}

DummyWatcherForm.propTypes = {
  data: React.PropTypes.object,
  handleChangeField: React.PropTypes.func,
};

DummyWatcherForm.defaultProps = {
  data: {
    name: '',
  },
};
