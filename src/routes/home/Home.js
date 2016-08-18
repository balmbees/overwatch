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
import ComponentsGraph from './ComponentsGraph';

const title = 'Overwatch';

function Home(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Overwatch</h1>
        <div>
          {
            (() => {
              if (props.components.length > 0) {
                return (
                  <div>
                    <ComponentsGraph components={props.components} />
                    <ComponentsList components={props.components} />
                  </div>
                );
              }
              return (
                <div>
                  Loading...
                </div>
              );
            })()
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '150px' }}>
          <img alt="topology" src={topologyImgUrl} />
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  components: React.PropTypes.array,
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
