import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import {
  STATUS_NONE,
  STATUS_SUCCESS,
  STATUS_ERROR,
} from '../../../watcher/models/watch_result';

const STATUS_TO_COLOR_MAP = {};
STATUS_TO_COLOR_MAP[STATUS_NONE] = '#111111';
STATUS_TO_COLOR_MAP[STATUS_SUCCESS] = '#00de0e';
STATUS_TO_COLOR_MAP[STATUS_ERROR] = '#ff3800';

function ComponentNode(props) {
  const { component, d3Node } = props;
  const status = component.watchers[0].result.status;
  return (
    <g>
      <circle
        cx={d3Node.x}
        cy={d3Node.y}
        r={d3Node.size / 2}
        fill={STATUS_TO_COLOR_MAP[status]}
      />
      <text
        textAnchor="middle"
        x={d3Node.x}
        y={d3Node.y - d3Node.size / 2 - 5}
      >
        {component.name}
      </text>
    </g>
  );
}


ComponentNode.propTypes = {
  component: React.PropTypes.object,
  d3Node: React.PropTypes.object,
};

class ComponentsGraph extends React.Component {
  constructor(props) {
    super(props);

    const svgWidth = 900;
    const svgHeight = 400;

    this.state = {
      svgWidth,
      svgHeight,
      nodes: null,
      links: null,
      d3Nodefs: {},
    };
  }

  componentDidMount() {
    this.initD3Nodes(this.props.components);
  }

  componentWillReceiveProps(nextProps) {
    this.initD3Nodes(nextProps.components);
  }

  initD3Nodes(components) {
    const { d3Nodes } = this.state;
    const originalSize = _.values(d3Nodes).length;
    components.forEach((c) => {
      let d3Node = d3Nodes[c.id];
      if (!d3Node) {
        d3Node = {
          index: c.id,
          x: 0,
          y: 0,
          size: 50,
        };
      }
      d3Nodes[c.id] = d3Node;
    });

    if (_.values(d3Nodes).length !== originalSize) {
      const { svgWidth, svgHeight } = this.state;

      const forceManyBody = d3.forceManyBody();
      forceManyBody.strength(-10);

      const forceCenter = d3.forceCenter();
      forceCenter.x(svgWidth / 2);
      forceCenter.y(svgHeight / 2);

      const force =
        d3.forceSimulation(_.values(d3Nodes))
          .force('charge', forceManyBody)
          .force('center', forceCenter);

      force.on('tick', () => {
        this.eachD3Nodes((node) => {
          Object.assign({
            x: Math.max(node.size, Math.min(this.state.svgWidth - node.size, node.x)),
            y: Math.max(node.size, Math.min(this.state.svgHeight - node.size, node.y)),
          }, node);
        });

        this.forceUpdate();
      });
    }
  }

  eachD3Nodes(loop) {
    this.props.components.forEach((component, index) => {
      const node = this.state.d3Nodes[component.id];
      if (node && component) {
        loop(node, component, index);
      }
    });
  }

  drawLinks() {
  }

  drawNodes() {
    const nodes = [];

    this.eachD3Nodes((node, component, index) => {
      if (node && component && component.watchers.length > 0) {
        nodes.push(
          <ComponentNode
            key={index}
            component={component}
            d3Node={node}
          />
        );
      }
    });

    return nodes;
  }

  render() {
    return (
      <div>
        <svg
          width={this.state.svgWidth}
          height={this.state.svgHeight}
        >
          {this.drawLinks()}
          {this.drawNodes()}
        </svg>
      </div>
    );
  }
}
ComponentsGraph.propTypes = {
  components: React.PropTypes.array,
};

export default ComponentsGraph;
