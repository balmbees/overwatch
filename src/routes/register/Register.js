/**
 * Created by leehyeon on 8/17/16.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ComponentForm from './ComponentForm';

import s from './Register.css';

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    const title = 'Register component';

    if (context.setTitle) {
      context.setTitle(title);
    }
  }

  render() {
    return (
      <div className={s.registerBody}>
        <ComponentForm />
      </div>
    );
  }
}

Register.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default withStyles(s)(Register);