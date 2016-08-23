/**
 * Created by leehyeon on 8/19/16.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';
import _ from 'lodash';

import s from './index.css';

class ManageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      notifiers: [],
    };
  }

  componentDidMount() {
    this.loadComponents();
    this.loadNotifiers();
  }

  loadNotifiers() {
    $.get('/watcher/notifiers', (r) => {
      this.setState({
        notifiers: r,
      });
    });
  }

  loadComponents() {
    $.get('/watcher/components', (r) => {
      this.setState({
        components: r,
      });
    });
  }

  handleChangeNotifier(cIdx, nId, checked) {
    const oldComponents = this.state.components;
    const component = oldComponents[cIdx];

    const onResponse = (r) => {
      oldComponents[cIdx] = r;
      this.setState({
        components: oldComponents,
      });
    };

    const targetUrl = `/watcher/component/${component.id}/notifier/${nId}`;
    if (checked) {
      oldComponents[cIdx].notifiers.push = { id: nId };
      this.setState({
        components: oldComponents,
      });

      $.post(targetUrl, onResponse);
    } else {
      _.remove(oldComponents[cIdx].notifiers, n => n.id === nId);
      this.setState({
        components: oldComponents,
      });

      $.ajax({
        url: targetUrl,
        method: 'DELETE',
      }).done(onResponse);
    }
  }

  render() {
    const { components, notifiers } = this.state;
    const renderThead = () => (
      <thead>
        <tr>
          <th className={s.manageComponentThdTh}>id</th>
          <th className={s.manageComponentThdTh}>name</th>
          {
            notifiers.map(n => (
              <th key={n.id} className={s.manageComponentThdTh}>{n.name}</th>
            ))
          }
        </tr>
      </thead>
    );

    const renderTbody = () => (
      <tbody>
        {components.map((c, idx) => (
          <tr key={c.id} className={s.manageComponentTbdTr}>
            <td>{c.id}</td>
            <td>{c.name}</td>
            {notifiers.map(n => (
              <td key={n.id}>
                <input
                  type="checkbox"
                  checked={_.find(c.notifiers, { id: n.id })}
                  onChange={(e) => this.handleChangeNotifier(idx, n.id, e.target.checked)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );

    return (
      <table className={s.manageComponentTbl}>
        {renderThead()}
        {renderTbody()}
      </table>
    );
  }
}

ManageTable.propTypes = {};
ManageTable.defaultProps = {};

export default withStyles(s)(ManageTable);
