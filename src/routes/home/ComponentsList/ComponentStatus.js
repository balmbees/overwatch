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

function ComponentStatus(props) {
  const { status } = props;
  const size = 15;
  return (
    <div>
      <svg height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={STATUS_TO_COLOR_MAP[status]}
        />
      </svg>
    </div>
  );
}
ComponentStatus.propTypes = {
  status: React.PropTypes.string.isRequired,
};

export default ComponentStatus;
