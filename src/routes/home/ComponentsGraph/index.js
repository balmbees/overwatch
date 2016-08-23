import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import $ from 'jquery';

import ComponentNode from './ComponentNode';
import ComponentGroup from './ComponentGroup';
import ComponentLink from './ComponentLink';

class ComponentsGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: null,
      links: null,
      d3Nodes: {},
      d3Links: [],
    };
  }

  componentDidMount() {
    this.initD3Nodes(this.props);
    this.handleResizeHandler = () => {
      this.handleResize();
    };
    window.addEventListener('resize', this.handleResizeHandler);
    this.handleResizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    this.initD3Nodes(nextProps);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeHandler);
  }

  handleResize() {
    if (this.svgRef) {
      const svgWidth = $(this.svgRef).width();
      const svgHeight = $(this.svgRef).height();

      const d3s = this.d3s;
      if (d3s) {
        d3s.forceCenter.x(svgWidth * 0.5);
        d3s.forceCenter.y(svgHeight * 0.5);

        d3s.force.on('tick.boundsForce', () => {
          this.eachD3Nodes((node) => {
            Object.assign(node, {
              x: Math.max(node.size, Math.min(svgWidth - node.size, node.x)),
              y: Math.max(node.size, Math.min(svgHeight - node.size, node.y)),
            });
          });

          this.forceUpdate();
        });

        d3.select(this.svgRef)
          .call(
            d3.drag()
              .container(this.svgRef)
              .subject(() =>
                d3s.force.find(d3.event.x, d3.event.y)
              )
              .on('start', () => {
                if (!d3.event.active) d3s.force.alphaTarget(0.3).restart();
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
              })
              .on('drag', () => {
                d3.event.subject.fx = d3.event.x;
                d3.event.subject.fy = d3.event.y;
              })
              .on('end', () => {
                if (!d3.event.active) d3s.force.alphaTarget(0);
                d3.event.subject.fx = null;
                d3.event.subject.fy = null;
              })
          ).on('click', () => {
            const node = d3s.force.find(d3.event.offsetX, d3.event.offsetY);
            node.open = !!!node.open;
          });

        d3s.force.restart();
      }
    }
  }

  initD3Nodes({ components, depends }) {
    if (!this.d3s) {
      const forceManyBody = d3.forceManyBody();
      forceManyBody.strength(-140);
      forceManyBody.distanceMin(70);

      const forceCenter = d3.forceCenter();

      const forceLink = d3.forceLink();
      forceLink.id(d => d.id);
      forceLink.strength((link) => {
        switch (link.type) {
          case 'contain':
            return 0.12;
          case 'depend':
            return 0.12;
          default:
            return 0;
        }
      });

      const force =
        d3.forceSimulation()
          .force('charge', forceManyBody)
          .force('links', forceLink)
          .force('center', forceCenter);

      this.d3s = {
        force,
        forceManyBody,
        forceCenter,
        forceLink,
      };
    }

    // Nodes
    const { d3Nodes } = this.state;

    const newD3Nodes = {};
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
      newD3Nodes[c.id] = d3Node;
    });

    // groups.forEach((group) => {
    //   let d3Node = d3Nodes[group.id];
    //   if (!d3Node) {
    //     d3Node = {
    //       id: group.id,
    //       x: 0,
    //       y: 0,
    //       size: 250,
    //       type: 'group',
    //     };
    //   }
    //   newD3Nodes[group.id] = d3Node;
    // });

    this.state.d3Nodes = newD3Nodes;
    this.d3s.force.nodes(_.values(this.state.d3Nodes));

    // Links
    // const containsLinks = contains.map(c => Object({
    //   source: Number(c.startNode),
    //   target: Number(c.endNode),
    //   type: 'contain',
    //   id: c.id,
    // }));
    const containsLinks = [];

    const dependsLinks = depends.map(c => Object({
      source: Number(c.startNode),
      target: Number(c.endNode),
      type: 'depend',
      id: c.id,
    }));

    const links = containsLinks.concat(dependsLinks);
    this.state.d3Links = links;
    this.d3s.forceLink.links(links);
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
        <ComponentLink
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
