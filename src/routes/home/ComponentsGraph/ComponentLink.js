import React from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentLink.css';

const LINK_CLASS_NAME = {
  contain: 'containLink',
  depend: 'dependLink',
};

const GRID_SIZE = {
  width: 25,
  height: 25,
};

function ComponentLink(props) {
  const { link } = props;

  return (
    <g>
      <polyline
        points={[
          [Number(link.source.x * GRID_SIZE.width), Number(link.source.y * GRID_SIZE.height)],
          [
            (Number(link.target.x * GRID_SIZE.width) + Number(link.source.x * GRID_SIZE.width)) / 2,
            (Number(link.target.y * GRID_SIZE.height) + Number(link.source.y * GRID_SIZE.height)) / 2
          ],
          [Number(link.target.x * GRID_SIZE.width), Number(link.target.y * GRID_SIZE.height)],
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
