import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import ComponentModal, { MODES } from '../../routes/home/ComponentsGraph/ComponentModal';
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
        <button
          className="btn btn-default"
          onClick={() => this.setState({
            editingNode: {
              data: {
                watchers: [],
              }
            }
          })}
        >
          <span className="glyphicon glyphicon-plus" />
          Component
          <ComponentModal
            component={this.state.editingNode}
            close={() => this.setState({ editingNode: null })}
            initialMode={MODES.EDIT}
          />
        </button>
      </div>
    );
  }
}
Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Navigation);
