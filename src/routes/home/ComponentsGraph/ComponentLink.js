import React from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentLink.css';

const LINK_CLASS_NAME = {
  contain: 'containLink',
  depend: 'dependLink',
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
        className={s[LINK_CLASS_NAME[link.type]]}
      />
    </g>
  );
}
ComponentLink.propTypes = {
  link: React.PropTypes.object,
};

export default withStyles(s)(ComponentLink);
