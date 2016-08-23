import React from 'react';
import $ from 'jquery';

import D3ForceLayout from './D3ForceLayout';
import ComponentNode from './ComponentNode';
import ComponentGroup from './ComponentGroup';
import ComponentLink from './ComponentLink';

class ComponentsGraph extends React.Component {
  componentDidMount() {
    this.state = {
      forceLayout: new D3ForceLayout({
        renderCallback: () => {
          this.forceUpdate();
        },
        containerDOM: this.svgRef,
      }),
    };

    const { components, depends } = this.props;
    const { forceLayout } = this.state;

    forceLayout.addNodes(
      components.map((c) => ({
        id: c.id,
        x: 0,
        y: 0,
        size: 40,
        type: 'component',
        data: c,
      }))
    );

    forceLayout.addLinks(
      depends.map(c => ({
        source: Number(c.startNode),
        target: Number(c.endNode),
        type: 'depend',
        id: c.id,
        data: c,
      }))
    );

    this.handleResizeHandler = () => {
      if (this.svgRef) {
        const svgWidth = $(this.svgRef).width();
        const svgHeight = $(this.svgRef).height();

        this.state.forceLayout.forceSimulationSize = {
          width: svgWidth,
          height: svgHeight,
        };
      }
    };
    window.addEventListener('resize', this.handleResizeHandler);
    this.handleResizeHandler();
  }

  // componentWillReceiveProps(nextProps) {
  //   this.initD3Nodes(nextProps);
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeHandler);
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
