import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '../../../actions/route';

import $ from 'jquery';
import _ from 'lodash';

import ComponentNode from './ComponentNode';
import ComponentLink from './ComponentLink';

class ComponentsGraph extends React.Component {
  _ComponentDependencyOnClick(component) {
    if (this.cd.firstComponent) {
      this._ComponentDependencyCreate(this.cd.firstComponent, component);
      delete this.isCreatingComponentDependency;
      delete this.cd;
    } else {
      this.cd.firstComponent = component;
      window.alert('click dependency end component'); // eslint-disable-line
    }
  }

  _ComponentDependencyStart() {
    this.isCreatingComponentDependency = true;
    this.cd = {};

    window.alert('click dependency start component'); // eslint-disable-line
  }

  _ComponentDependencyCreate(firstComponent, secondComponent) {
    $.post('/api/cypher/relate', {
      firstId: firstComponent.id,
      type: 'DEPEND',
      secondId: secondComponent.id,
    }).done(() => {
      window.alert('Change Saved!'); // eslint-disable-line
      window.location.reload();
    })
    .fail((e) => {
      console.error(e);  // eslint-disable-line
    });
  }

  render() {
    const { depends, components } = this.props;

    const nodes = _.map(components, (c, id) => { // eslint-disable-line
      return (
        <ComponentNode
          key={c.id}
          node={c}
          onClick={() => {
            if (!this.isCreatingComponentDependency) {
              this.props.navigate(`/components/${c.id}`);
            } else {
              this._ComponentDependencyOnClick(c);
            }
          }}
        />
      );
    });

    const links = _.map(depends, (l) => {
      const link = {
        source: _.find(components, { id: Number(l.startNode) }),
        target: _.find(components, { id: Number(l.endNode) }),
        type: 'depend',
        id: l.id,
        data: l,
      };
      return (
        <ComponentLink
          key={link.id}
          link={link}
        />
      );
    });

    return (
      <div
        style={{
          padding: '20px',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
        }}
      >
        <button
          className="btn btn-sm btn-primary"
          style={{
            position: 'absolute',
            margin: '10px',
          }}
          onClick={() => this._ComponentDependencyStart()}
        >
          Connnect
        </button>
        <svg
          width="100%"
          height="700px"
          style={{
            border: '1px solid black',
            boxSizing: 'border-box',
          }}
        >
          {links}
          {nodes}
        </svg>
      </div>
    );
  }
}
ComponentsGraph.propTypes = {
  components: React.PropTypes.object,
  groups: React.PropTypes.object,
  contains: React.PropTypes.object,
  depends: React.PropTypes.object,
  // Actions
  navigate: React.PropTypes.func,
};

export default connect(null, { navigate })(ComponentsGraph);
