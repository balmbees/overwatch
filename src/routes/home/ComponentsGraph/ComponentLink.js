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
  const { link } = props;
  return (
    <g>
      <polyline
        points={[
          [link.source.x, link.source.y],
          [(link.target.x + link.source.x) / 2, (link.target.y + link.source.y) / 2],
          [link.target.x, link.target.y],
        ].join(' ')}
        markerMid="url(#arrowMarker)"
        {...LINK_STYLE[link.type]}
      />
    </g>
  );
}
ComponentLink.propTypes = {
  link: React.PropTypes.object,
};

export default ComponentLink;
