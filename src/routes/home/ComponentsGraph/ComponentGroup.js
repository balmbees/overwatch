import React from 'react';

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

export default ComponentGroup;
