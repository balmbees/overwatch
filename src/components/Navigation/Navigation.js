import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Navigation.css';
import Link from '../Link';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { className } = this.props;
    return (
      <div className={cx(s.root, className)} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/components/new">
          <span className="glyphicon glyphicon-plus" />
          Component
        </Link>
      </div>
    );
  }
}
Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Navigation);
