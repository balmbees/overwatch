import React from 'react';
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

export default ComponentNode;
