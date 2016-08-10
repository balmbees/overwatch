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

import topologyImgUrl from './topology.png';

import ComponentsList from './ComponentsList';

const title = 'Overwatch';

function Home(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Overwatch</h1>
        <div>
          <ComponentsList components={props.components} />
        </div>
        <div style={{textAlign: 'center', marginTop: '150px'}}>
          <img src={topologyImgUrl} />
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
      status: React.PropTypes.object,
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
