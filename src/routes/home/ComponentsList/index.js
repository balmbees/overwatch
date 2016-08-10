import React, { PropTypes } from 'react';
import moment from 'moment';

import {
  STATUS_SUCCESS,
  STATUS_ERROR
} from '../../../worker/models/watch_result';

const STATUS_TO_COLOR_MAP = {};
STATUS_TO_COLOR_MAP[STATUS_SUCCESS] = '#00de0e';
STATUS_TO_COLOR_MAP[STATUS_ERROR] = '#ff3800';

function ComponentStatus(props, context) {
  const { status } = props;
  const size = 15;
  return (
    <div>
      <svg height={size} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={STATUS_TO_COLOR_MAP[status.status]} />
      </svg>
    </div>
  )
}


import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.css';

class ComponentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentsExpanded: {}
    };
  }

  toggleExpand(component) {
    const componentsExpanded = this.state.componentsExpanded;
    componentsExpanded[component.name] = !componentsExpanded[component.name];

    this.setState({
      componentsExpanded: componentsExpanded
    })
  }

  render() {
    const formatCreatedAt = (createdAt) => {
      return moment(createdAt).fromNow();
    }
    const { components } = this.props;
    return (
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.tableTh} width="240px">
              Name
            </th>
            <th className={s.tableTh}>
              Status
            </th>
            <th className={s.tableTh} width="180px">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {components.map((component) => (
            <tr key={component.name} onClick={() => { this.toggleExpand(component) }}>
              <td className={s.tableTd}>
                {component.name}
              </td>
              <td className={s.tableTd}>
                <ComponentStatus status={component.status} />
                {(() => {
                  const expanded = this.state.componentsExpanded[component.name];
                  if (expanded) {
                    return (
                      <small>
                        {component.status.description}
                      </small>
                    );
                  }
                })()}
              </td>
              <td className={s.tableTd}>
                {formatCreatedAt(component.status.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
ComponentsList.propTypes = {
  components: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string,
      description: React.PropTypes.string,
      status: React.PropTypes.object,
    })
  ),
};

export default withStyles(s)(ComponentsList);
