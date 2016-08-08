import React from 'react';
import { connect } from 'react-redux';
import styles from './App.css';

class App extends React.Component {
  render() {
    const { app } = this.props;
    const components = app.status.map((component) => {
      return (
        <div key={component.name}>
          <h4>{component.name}</h4>
          <b>{component.statusUpdatedAt}</b>
          <br />
          <span>{component.status}</span>
          <br />
          <span>{component.description}</span>
        </div>
      );
    });
    return (
      <div className={styles.app}>
        {components}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  params: React.PropTypes.object,
  app: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

export default connect((state) => {
  return {
    app: state.app,
  };
})(App);
