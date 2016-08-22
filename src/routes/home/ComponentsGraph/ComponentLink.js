import React from 'react';

const LINK_STYLE = {
  contain: {
    stroke: 'rgba(0, 0, 0, 0.3)',
    strokeWidth: '5px',
  },
  depend: {
    stroke: 'rgba(255, 222, 0, 0.7)',
    strokeWidth: '10px',
  },
};

function ComponentLink(props) {
  const { d3Link } = props;
  return (
    <g>
      <line
        x1={d3Link.source.x}
        y1={d3Link.source.y}
        x2={d3Link.target.x}
        y2={d3Link.target.y}
        style={LINK_STYLE[d3Link.type]}
      />
    </g>
  );
}
ComponentLink.propTypes = {
  d3Link: React.PropTypes.object,
};

export default ComponentLink;
