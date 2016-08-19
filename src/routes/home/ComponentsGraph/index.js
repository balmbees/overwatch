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
  const status = component.status;
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

function ComponentGroup(props) {
  const { group, d3Node } = props;
  return (
    <g opacity="0.3">
      <circle
        cx={d3Node.x}
        cy={d3Node.y}
        r={d3Node.size / 2}
      />
      <text
        textAnchor="middle"
        x={d3Node.x}
        y={d3Node.y - d3Node.size / 2 - 5}
      >
        {group.label}
      </text>
    </g>
  );
}

ComponentGroup.propTypes = {
  group: React.PropTypes.object,
  d3Node: React.PropTypes.object,
};

const LINK_STYLE = {
  contain: {
    stroke: 'rgba(0, 0, 0, 0.3)',
    strokeWidth: '5px',
  },
  depend: {
    stroke: '#bda85d',
    strokeWidth: '3px',
  },
};

function Link(props) {
  const { d3Link } = props;
  return (
    <g>
      <polyline
        points={[
          [d3Link.source.x, d3Link.source.y],
          [(d3Link.target.x + d3Link.source.x) / 2, (d3Link.target.y + d3Link.source.y) / 2],
          [d3Link.target.x, d3Link.target.y],
        ].join(' ')}
        markerMid="url(#Triangle)"
        {...LINK_STYLE[d3Link.type]}
      />
    </g>
  );
}
Link.propTypes = {
  d3Link: React.PropTypes.object,
};

class ComponentsGraph extends React.Component {
  constructor(props) {
    super(props);

    const svgWidth = 900;
    const svgHeight = 600;

    this.state = {
      svgWidth,
      svgHeight,
      nodes: null,
      links: null,
      d3Nodes: {},
      d3Links: [],
    };
  }

  componentDidMount() {
    this.initD3Nodes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initD3Nodes(nextProps);
  }

  initD3Nodes({ components, groups, contains, depends }) {
    const { d3Nodes } = this.state;
    const originalSize = _.values(d3Nodes).length;

    components.forEach((c) => {
      let d3Node = d3Nodes[c.id];
      if (!d3Node) {
        d3Node = {
          id: c.id,
          x: 0,
          y: 0,
          size: 40,
          type: 'component',
        };
      }
      d3Nodes[c.id] = d3Node;
    });

    groups.forEach((group) => {
      let d3Node = d3Nodes[group.id];
      if (!d3Node) {
        d3Node = {
          id: group.id,
          x: 0,
          y: 0,
          size: 250,
          type: 'group',
        };
      }
      d3Nodes[group.id] = d3Node;
    });

    const newSize = _.values(d3Nodes).length;

    if (newSize !== originalSize) {
      const { svgWidth, svgHeight } = this.state;

      const forceManyBody = d3.forceManyBody();
      forceManyBody.strength(-140);
      forceManyBody.distanceMin(70);

      const forceCenter = d3.forceCenter();
      forceCenter.x(svgWidth / 2);
      forceCenter.y(svgHeight / 2);

      const forceLink = d3.forceLink();
      forceLink.id(d => d.id);
      forceLink.strength((link) => {
        switch (link.type) {
          case 'contain':
            return 0.1;
          case 'depend':
            return 0.1;
          default:
            return 0;
        }
      });

      const containsLinks = contains.map(c => Object({
        source: Number(c.startNode),
        target: Number(c.endNode),
        type: 'contain',
        id: c.id,
      }));

      const dependsLinks = depends.map(c => Object({
        source: Number(c.startNode),
        target: Number(c.endNode),
        type: 'depend',
        id: c.id,
      }));

      const links = containsLinks.concat(dependsLinks);
      forceLink.links(links);

      const force =
        d3.forceSimulation(_.values(d3Nodes))
          .force('charge', forceManyBody)
          .force('links', forceLink)
          .force('center', forceCenter);

      this.state.d3Links = links;

      force.on('tick', () => {
        this.eachD3Nodes((node) => {
          Object.assign(node, {
            x: Math.max(node.size * 2, Math.min(this.state.svgWidth - node.size, node.x)),
            y: Math.max(node.size, Math.min(this.state.svgHeight - node.size, node.y)),
          });
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
    const links = [];
    _.values(this.state.d3Links).forEach((link) => {
      links.push(
        <Link
          key={link.id}
          d3Link={link}
        />
      );
    });

    return links;
  }

  drawNodes() {
    const nodes = [];

    this.eachD3Nodes((node, component) => {
      if (node && component && component.watchers.length > 0) {
        nodes.push(
          <ComponentNode
            key={component.id}
            component={component}
            d3Node={node}
          />
        );
      }
    });

    this.props.groups.forEach((group) => {
      const node = this.state.d3Nodes[group.id];
      if (node) {
        nodes.push(
          <ComponentGroup
            key={group.id}
            group={group}
            d3Node={node}
          />
        );
      }
    });

    return nodes;
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <svg
          width={this.state.svgWidth}
          height={this.state.svgHeight}
          style={{
            border: '1px solid black',
            margin: '20px',
          }}
        >
          <defs>
            <marker ref="marker" id="arrow">
              <path d="M2,1 L2,10 L10,6 L2,2" style={{ fill: 'red' }} />
            </marker>
          </defs>
          <defs>
            <marker
              id="Triangle"
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
