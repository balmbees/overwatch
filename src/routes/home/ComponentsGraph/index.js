import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

import D3ForceLayout from './D3ForceLayout';
import ComponentNode from './ComponentNode';
import ComponentLink from './ComponentLink';
import ComponentModal from './ComponentModal';

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
        onClick={() => this.setState({ editingNode: node })}
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
        <ComponentModal
          component={this.state.editingNode}
          close={() => this.setState({ editingNode: null })}
        />
      </div>
    );
  }
}
ComponentsGraph.propTypes = {
  components: React.PropTypes.array,
  groups: React.PropTypes.array,
  contains: React.PropTypes.array,
  depends: React.PropTypes.array,
};

export default ComponentsGraph;
