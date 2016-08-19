/**
 * Created by leehyeon on 8/19/16.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Manage.css';
import ManageTable from './ManageTable';

class Manage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const title = 'Manage components';

    if (context.setTitle) {
      context.setTitle(title);
    }
  }

  render() {
    return (
      <div className={s.manageBody}>
        <ManageTable />
      </div>
    );
  }
}

export default withStyles(s)(Manage);
