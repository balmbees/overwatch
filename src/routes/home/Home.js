import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Home.css';
import _ from 'lodash';

import ComponentsList from './ComponentsList';
import ComponentsGraph from './ComponentsGraph';

export const TYPES = {
  GRAPH: 'graph',
  LIST: 'list',
};

const title = 'Overwatch';

function Home(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div>
        {props.children}
      </div>
      <div className={s.container}>
        {
          (() => {
            if (Object.values(props.components).length > 0) {
              if (props.type === TYPES.GRAPH) {
                return (
                  <ComponentsGraph
                    components={props.components}
                    groups={props.groups}
                    contains={props.contains}
                    depends={props.depends}
                  />
                );
              } else if (props.type === TYPES.LIST) {
                return (
                  <ComponentsList components={props.components} />
                );
              }
            }
            return (
              <div>
                Loading...
              </div>
            );
          })()
        }
      </div>
    </div>
  );
}

Home.propTypes = {
  components: React.PropTypes.object,
  groups: React.PropTypes.object,
  contains: React.PropTypes.object,
  depends: React.PropTypes.object,
  children: React.PropTypes.object,
  type: React.PropTypes.oneOf(_.values(TYPES)),
};
Home.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

function stateToProps(state) {
  return {
    components: state.home.data.components || {},
    groups: state.home.data.groups || {},
    contains: state.home.data.contains || {},
    depends: state.home.data.depends || {},
  };
}

export default connect(stateToProps)(withStyles(s)(Home));
