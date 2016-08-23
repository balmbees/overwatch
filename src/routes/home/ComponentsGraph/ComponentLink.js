import React from 'react';

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

function ComponentLink(props) {
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
ComponentLink.propTypes = {
  d3Link: React.PropTypes.object,
};

export default ComponentLink;
