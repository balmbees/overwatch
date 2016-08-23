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
  const { node } = props;
  const component = node.data;
  const status = component.status;
  return (
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size / 2}
        fill={STATUS_TO_COLOR_MAP[status]}
      />
      <text
        textAnchor="middle"
        x={node.x}
        y={node.y - node.size / 2 - 5}
      >
        {component.name}
      </text>
    </g>
  );
}

ComponentNode.propTypes = {
  node: React.PropTypes.object,
};

export default ComponentNode;
