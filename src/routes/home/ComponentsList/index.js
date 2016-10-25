import React from 'react';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.css';

import ComponentStatus from './ComponentStatus';

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

      const result = [];
      if (watchers.length === 0) {
        result.push(
          <tr key={component.name}>
            <td className={s.tableTd}>
              {component.name}
            </td>
            <td className={s.tableTd} colSpan="3">
              <small>
                {"There isn't any watcher for this component"}
              </small>
            </td>
          </tr>
        );
      } else {
        result.push(
          ...watchers.map((w, index) => (
            <tr key={w.name}>
              {(() => {
                if (index === 0) {
                  return (
                    <td className={s.tableTd} rowSpan={watchers.length}>
                      {component.name}
                    </td>
                  );
                }
                return null;
              })()}
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
            </tr>
          ))
        );
      }

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
