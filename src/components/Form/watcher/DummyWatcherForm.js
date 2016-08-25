/**
 * Created by leehyeon on 8/25/16.
 */
import React from 'react';

export default function DummyWatcherForm({ name }) {
  return (
    <div>
      <label>name</label><br />
      <input type="text" name="name" value={name} /><br /><br />
    </div>
  );
}

DummyWatcherForm.propTypes = {
  name: React.PropTypes.string,
};

DummyWatcherForm.defaultProps = {
  name: '',
};
