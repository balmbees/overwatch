import React from 'react';
import moment from 'moment';

import {
  STATUS_NONE,
  STATUS_SUCCESS,
  STATUS_ERROR,
} from '../../../watcher/models/watch_result';

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

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.css';

class ComponentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentsExpanded: {},
    };
  }

  toggleExpand(component) {
    const componentsExpanded = this.state.componentsExpanded;
    componentsExpanded[component.name] = !componentsExpanded[component.name];

    this.setState({
      componentsExpanded,
    });
  }

  render() {
    const formatCreatedAt = (createdAt) => moment(createdAt).fromNow();
    const componentTableRow = (component) => {
      const watchers = component.watchers;

      if (watchers.length === 0) {
        return (<tr key={component.name}>
          <td className={s.tableTd}>
            {component.name}
          </td>
          <td className={s.tableTd}>
            <ComponentStatus status={STATUS_NONE} />
          </td>
        </tr>);
      }

      const result = [];
      const firstWatcher = watchers[0];
      result.push(<tr key={firstWatcher.name}>
        <td className={s.tableTd} rowSpan={watchers.length}>
          {component.name}
        </td>
        <td className={s.tableTd}>
          {firstWatcher.name}
        </td>
        <td className={s.tableTd}>
          <ComponentStatus status={firstWatcher.result.status} />
          <small>{firstWatcher.result.description}</small>
        </td>
        <td className={s.tableTd}>
          {formatCreatedAt(firstWatcher.status)}
        </td>
      </tr>);

      watchers.slice(1).forEach((w) => {
        result.push(<tr key={w.name}>
          <td className={s.tableTd}>
            {w.name}
          </td>
          <td className={s.tableTd}>
            <ComponentStatus status={w.result.status} />
            <small>{w.result.description}</small>
          </td>
          <td className={s.tableTd}>
            {formatCreatedAt(w.status)}
          </td>
        </tr>);
      });

      return result;
    };

    const { components } = this.props;
    return (
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.tableTh} width="240px">
              Name
            </th>
            <th className={s.tableTh}>
              Watcher
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
          {components.map((component) => componentTableRow(component))}
        </tbody>
      </table>
    );
  }
}
ComponentsList.propTypes = {
  components: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.number,
      name: React.PropTypes.string,
      description: React.PropTypes.string,
    })
  ),
};

export default withStyles(s)(ComponentsList);
