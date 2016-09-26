import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    position: 'static',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '90%',
    width: '600px',
    WebkitOverflowScrolling: 'touch',
  },
};

function About(props) {
  const { goBack } = props;
  return (
    <Modal
      isOpen={!!true}
      style={modalStyle}
      onRequestClose={() => goBack()}
    >
      <h3 className="text-center">About</h3>
      <div>
        <p className="lead">
          <i>
            Genji is with you
          </i>
        </p>
        <small>
          Made By Kurt Lee / Hyun Lee
        </small>
      </div>
    </Modal>
  );
}
About.propTypes = {
  // actions
  goBack: React.PropTypes.func,
};

import { goBack } from '../../actions/route';

export default connect(
  null,
  { goBack }
)(About);
