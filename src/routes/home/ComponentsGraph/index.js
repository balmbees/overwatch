import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '../../../actions/route';

import _ from 'lodash';
import $ from 'jquery';

import D3ForceLayout from './D3ForceLayout';
import ComponentNode from './ComponentNode';
import ComponentLink from './ComponentLink';

class ComponentsGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      forceLayout: new D3ForceLayout({
        renderCallback: () => {
          this.forceUpdate();
        },
      }),
    };
  }

  componentDidMount() {
    const { components, depends } = this.props;
    const { forceLayout } = this.state;

    forceLayout.containerDOM = this.svgRef;

    forceLayout.addNodes(
      components.map(c => this._componentToNode(c))
    );

    forceLayout.addLinks(
      depends.map(l => this._dependToLink(l))
    );

    this.resizeHandler = () => {
      if (this.svgRef) {
        const svgWidth = $(this.svgRef).width();
        const svgHeight = $(this.svgRef).height();

        this.state.forceLayout.forceSimulationSize = {
          width: svgWidth,
          height: svgHeight,
        };
      }
    };
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    const n = nextProps;
    const o = this.props;

    // If Component Created Or Deleted, we can't really handle it now
    // (and it's pretty rare occation i would say)
    if (n.components.length !== o.components.length) {
      location.reload();
    }
    // Same with links
    if (n.depends.length !== o.depends.length) {
      location.reload();
    }

    this.state.forceLayout.updateNodes(
      _.filter(n.components, (component) => component.statusChanged)
       .map((component) => this._componentToNode(component))
    );
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  _ComponentDependencyOnClick(component) {
    if (this.cd.firstComponent) {
      this._ComponentDependencyCreate(this.cd.firstComponent, component);
      delete this.isCreatingComponentDependency;
      delete this.cd;
    } else {
      this.cd.firstComponent = component;
      window.alert('click dependency end component');
    }
  }

  _ComponentDependencyStart() {
    this.isCreatingComponentDependency = true;
    this.cd = {};

    window.alert('click dependency start component');
  }

  _ComponentDependencyCreate(firstComponent, secondComponent) {
    $.post('/api/cypher/relate', {
      firstId: firstComponent.id,
      type: 'DEPEND',
      secondId: secondComponent.id,
    }).done((result) => {
      console.log(result);
      window.alert('Change Saved!');
      window.location.reload();
    })
    .fail((e) => {
      console.error(e);
    });
  }

  _componentToNode(c) {
    return {
      id: c.id,
      size: 40,
      type: 'Component',
      data: c,
    };
  }

  _dependToLink(l) {
    return {
      source: Number(l.startNode),
      target: Number(l.endNode),
      type: 'depend',
      id: l.id,
      data: l,
    };
  }

  drawLinks() {
    return this.state.forceLayout.links.map((link) => (
      <ComponentLink
        key={link.id}
        link={link}
      />
    ));
  }

  drawNodes() {
    return this.state.forceLayout.nodes.map((node) => (
      <ComponentNode
        key={node.id}
        node={node}
        onClick={() => {
          if (!this.isCreatingComponentDependency) {
            this.props.navigate(`/components/${node.id}`)
          } else {
            this._ComponentDependencyOnClick(node.data);
          }
        }}
      />
    ));
  }

  render() {
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
          ref={(c) => { this.svgRef = c; }}
          width="100%"
          height="100%"
          style={{
            border: '1px solid black',
            boxSizing: 'border-box',
          }}
        >
          <defs>
            <marker
              id="arrowMarker"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
              strokeWidth="5"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {this.drawLinks()}
          {this.drawNodes()}
        </svg>
      </div>
    );
  }
}
ComponentsGraph.propTypes = {
  components: React.PropTypes.array,
  groups: React.PropTypes.array,
  contains: React.PropTypes.array,
  depends: React.PropTypes.array,
  // Actions
  navigate: React.PropTypes.func,
};

export default connect(null, { navigate })(ComponentsGraph);
