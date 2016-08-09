/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Home.css';

const title = 'Overwatch';

function Home(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Overwatch</h1>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.components.map((component) => (
                <tr>
                  <td>{component.name}</td>
                  <td>{component.status}</td>
                  <td>{component.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  components: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string,
      description: React.PropTypes.string,
      status: React.PropTypes.string,
      updatedAt: React.PropTypes.string,
    })
  ),
};
Home.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

function stateToProps(state) {
  return {
    components: state.home.data.components || {},
  };
}

export default connect(stateToProps)(withStyles(s)(Home));
