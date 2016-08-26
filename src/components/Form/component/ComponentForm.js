/**
 * Created by leehyeon on 8/25/16.
 */

import React from 'react';


export default function ComponentForm({ name, description, handleChangeName, handleChangeDesc }) {
  return (
    <div>
      <label>name</label><br />
      <input
        type="text"
        value={name}
        onChange={handleChangeName}
      /><br /><br />
      <label>description</label><br />
      <input
        type="text"
        name="description"
        value={description}
        onChange={handleChangeDesc}
      /><br /><br />
    </div>
  );
}

ComponentForm.propTypes = {
  name: React.PropTypes.string,
  description: React.PropTypes.string,
  handleChangeName: React.PropTypes.func,
  handleChangeDesc: React.PropTypes.func,
};

ComponentForm.defaultProps = {
  name: '',
  description: '',
};
