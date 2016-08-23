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
      <div className={s.container}>
        {
          (() => {
            if (props.components.length > 0) {
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
  children: PropTypes.element.isRequired,
  components: React.PropTypes.array,
  groups: React.PropTypes.array,
  contains: React.PropTypes.array,
  depends: React.PropTypes.array,
  type: React.PropTypes.oneOf(_.values(TYPES)),
};
Home.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

function stateToProps(state) {
  return {
    components: state.home.data.components || [],
    groups: state.home.data.groups || [],
    contains: state.home.data.contains || [],
    depends: state.home.data.depends || [],
  };
}

export default connect(stateToProps)(withStyles(s)(Home));
