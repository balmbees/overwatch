import React from 'react';
import {
  STATUS_NONE,
  STATUS_SUCCESS,
  STATUS_ERROR,
} from '../../../server/models/watch_result';

const STATUS_TO_COLOR_MAP = {};
STATUS_TO_COLOR_MAP[STATUS_NONE] = '#111111';
STATUS_TO_COLOR_MAP[STATUS_SUCCESS] = '#00de0e';
STATUS_TO_COLOR_MAP[STATUS_ERROR] = '#ff3800';

function ComponentNode(props) {
  const { node, onClick } = props;
  const component = node.data;
  const status = component.status;
  let imageTag = null;
  if (component.infrastructureType) {
    const imageSize = node.size * 0.6;
    imageTag = (
      <g transform={`translate(${-imageSize * 0.5}, ${-imageSize * 0.5})`}>
        <image
          xlinkHref={`/component_icons/${component.infrastructureType}.png`}
          height={node.size * 0.6}
          width={node.size * 0.6}
        />
      </g>
    );
  }
  return (
    <g transform={`translate(${node.x}, ${node.y}) scale(${component.selected ? 1.5 : 1})`}>
      <circle
        stroke={STATUS_TO_COLOR_MAP[status]}
        strokeWidth="3px"
        fill="rgb(235, 235, 235)"
        style={{
          r: node.size * 0.5,
          transition: 'fill 0.8s cubic-bezier(0.46, -0.6, 0.46, 2.6)',
        }}
        onClick={onClick}
      />
      <circle
        style={{
          fill: STATUS_TO_COLOR_MAP[status],
        }}
        onClick={onClick}
      >
        <animate
          attributeType="CSS"
          attributeName="opacity"
          dur="1s"
          values="0 ; 0.2 ; 0"
          keyTimes="0 ; 0.1 ; 1"
          repeatCount="indefinite"
        />
        <animate
          attributeType="CSS"
          attributeName="r"
          dur="1s"
          values={[1, 1.2, 1].map((s) => s * node.size * 0.8).join('; ')}
          keyTimes="0 ; 0.1 ; 1"
          repeatCount="indefinite"
        />
      </circle>
      {imageTag}
      <text
        textAnchor="middle"
        x={0}
        y={node.size / 2 + 10}
      >
        {component.name}
      </text>
    </g>
  );
}

ComponentNode.propTypes = {
  node: React.PropTypes.object,
  onClick: React.PropTypes.func,
};

export default ComponentNode;
