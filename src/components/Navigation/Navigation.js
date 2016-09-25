import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import ComponentModal from '../../routes/home/ComponentsGraph/ComponentModal';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { className } = this.props;
    return (
      <div className={cx(s.root, className)} role="navigation">
        <button
          className="btn btn-default"
          onClick={() => this.setState({ editingNode: {} })}
        >
          <span className="glyphicon glyphicon-plus" />
          Component
          <ComponentModal
            component={this.state.editingNode}
            close={() => this.setState({ editingNode: null })}
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
