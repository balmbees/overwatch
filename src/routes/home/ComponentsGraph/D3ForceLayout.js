import * as d3 from 'd3';
import _ from 'lodash';
import $ from 'jquery';

export default class D3ForceLayout {
  constructor({ renderCallback }) {
    const forceSimulation = d3.forceSimulation();
    this.forceSimulation = forceSimulation;

    const forceManyBody = d3.forceManyBody();
    forceManyBody.strength(-140);
    forceManyBody.distanceMin(70);
    this.forceManyBody = forceManyBody;

    const forceCenter = d3.forceCenter();
    this.forceCenter = forceCenter;

    const forceLink = d3.forceLink();
    forceLink.id(d => d.id);
    forceLink.strength((link) => {
      switch (link.type) {
        case 'contain':
          return 0.12;
        case 'depend':
          return 0.10;
        default:
          return 0;
      }
    });
    this.forceLink = forceLink;

    // Connect Forces
    forceSimulation.force('forceManyBody', forceManyBody);
    forceSimulation.force('forceLink', forceLink);
    forceSimulation.force('forceCenter', forceCenter);

    // setter
    this.renderCallback = renderCallback;
  }

  get nodes() {
    return this.forceSimulation.nodes();
  }

  get links() {
    return this.forceLink.links();
  }

  addNodes(newNodes) {
    const nodes = this.forceSimulation.nodes();
    nodes.push(...newNodes);
    this.forceSimulation.nodes(nodes);
  }

  updateNodes(changedNodes) {
    const oldNodes = this.nodes;

    changedNodes.forEach((newNode) => {
      const oldNode = _.find(oldNodes, (n) => n.id === newNode.id);
      if (oldNode) {
        Object.assign(oldNode, newNode);
      } else {
        throw new Error(`node ${newNode} is changed but coudln't find it`);
      }
    });
  }

  addLinks(newLinks) {
    const links = this.forceLink.links();
    links.push(...newLinks);
    this.forceLink.links(links);
  }

  static EVENTS = {
    NODE_CLICK: 'node.click',
  };

  set containerDOM(containerDOM) {
    this._containerDOM = containerDOM;

    this._bindEventToContainerDom();
  }

  get containerDOM() {
    return this._containerDOM;
  }

  on(eventName, callback) {
    this.eventCallbacks[eventName] = callback;
  }

  _bindEventToContainerDom() {
    this.eventCallbacks = {};

    d3.select(this.containerDOM)
      .call(
        d3.drag()
          .container(this.containerDOM)
          .subject(() =>
            this.forceSimulation.find(
              d3.event.x,
              d3.event.y
            )
          )
          .on('start', () => {
            if (!d3.event.active) this.forceSimulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
          })
          .on('drag', () => {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
          })
          .on('end', () => {
            if (!d3.event.active) this.forceSimulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
          })
      );

    const that = this;
    $(this.containerDOM).click(function onclick(event) {
      const elm = $(this);
      const x = event.pageX - elm.offset().left;
      const y = event.pageY - elm.offset().top;

      const node = that.forceSimulation.find(x, y);
      node.fx = x;
      node.fy = y;

      that.eventCallbacks[D3ForceLayout.EVENTS.NODE_CLICK](node);
    });
  }

  set forceSimulationSize(size) {
    this._forceSimulationSize = size;

    // Update Force Center
    this.forceCenter.x(size.width * 0.5);
    this.forceCenter.y(size.height * 0.5);

    // Update Bounding Box
    this.forceSimulation.on('tick.boundsForce', () => {
      this.nodes.forEach((node) => {
        const padding = 50;
        Object.assign(node, {
          x: Math.max(padding, Math.min(size.width - padding, node.x)),
          y: Math.max(padding, Math.min(size.height - padding, node.y)),
        });
      });

      this.renderCallback();
    });

    // Restart
    this.forceSimulation.restart();
  }

  get forceSimulationSize() {
    return this._forceSimulationSize;
  }
}
