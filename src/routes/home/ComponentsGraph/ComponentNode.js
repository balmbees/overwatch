import React from 'react';
import Draggable from 'react-draggable';
import {
  STATUS_NONE,
  STATUS_SUCCESS,
  STATUS_ERROR,
} from '../../../server/models/watch_result';
import { connect } from 'react-redux';

import { updateComponent } from '../../../actions/home';

const STATUS_TO_COLOR_MAP = {};
STATUS_TO_COLOR_MAP[STATUS_NONE] = '#111111';
STATUS_TO_COLOR_MAP[STATUS_SUCCESS] = '#00de0e';
STATUS_TO_COLOR_MAP[STATUS_ERROR] = '#ff3800';

const GRID_SIZE = {
  width: 25,
  height: 25,
};

import ComponentService from '../../../services/component_service';

class ComponentNode extends React.Component {
  _handleStop(e, location) {
    const { node } = this.props;
    Object.assign(
      node,
      {
        x: (location.x / GRID_SIZE.width).toFixed(0),
        y: (location.y / GRID_SIZE.height).toFixed(0),
      }
    );

    this.props.dispatch(updateComponent(node));

    ComponentService.save(node);
  }

  render() {
    const { node, onClick } = this.props;
    const size = 40;

    return (
      <Draggable
        grid={[GRID_SIZE.width, GRID_SIZE.height]}
        defaultPosition={{
          x: (node.x || 5) * GRID_SIZE.width,
          y: (node.y || 5) * GRID_SIZE.height,
        }}
        onStop={(e, location) => this._handleStop(e, location)}
      >
        <g>
          <circle
            stroke={STATUS_TO_COLOR_MAP[node.status]}
            strokeWidth="3px"
            fill="rgb(235, 235, 235)"
            style={{
              r: size * 0.5,
              transition: 'fill 0.8s cubic-bezier(0.46, -0.6, 0.46, 2.6)',
            }}
            onClick={onClick}
          />
          <circle
            style={{
              fill: STATUS_TO_COLOR_MAP[node.status],
            }}
            onClick={onClick}
          >
          </circle>
          <text
            textAnchor="middle"
            x={0}
            y={size / 2 + 10}
          >
            {node.name}
          </text>
        </g>
      </Draggable>
    );
  }
}

ComponentNode.propTypes = {
  node: React.PropTypes.object,
  onClick: React.PropTypes.func,
  dispatch: React.PropTypes.func,
};

export default connect()(ComponentNode);
