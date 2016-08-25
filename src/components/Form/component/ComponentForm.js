/**
 * Created by leehyeon on 8/25/16.
 */

import React from 'react';
import $ from 'jquery';
import _ from 'lodash';

import WatcherForm from '../watcher/WatcherForm';
import { WATCHER_TYPES } from '../../../constants';


class ComponentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: props.data.name,
        watchers: props.data.watchers ? props.data.watchers : [],
        notifierIds: props.data.notifierIds ? props.data.notifierIds : [],
      },
      notifiers: [],
    };
  }

  componentDidMount() {
    $.get('/watcher/notifiers', (r) => {
      this.setState({
        notifiers: r,
      });
    });
  }

  handleChangeWatcherType = (idx, value) => {
    const oldFormData = this.state.formData;
    oldFormData.watchers[idx].type = value;

    this.setState({
      formData: oldFormData,
    });
  };

  handleChangeNotifier = (e, id) => {
    const oldFormData = this.state.formData;
    if (e.target.checked) {
      oldFormData.notifierIds.push(id);
    } else {
      _.pull(oldFormData.notifierIds, id);
    }

    this.setState({
      formData: oldFormData,
    });
  };

  handleOnClickAddWatcherButton = () => {
    const oldFormData = this.state.formData;
    oldFormData.watchers.push({
      name: '',
      type: 'HttpWatcher',
    });

    this.setState({
      formData: oldFormData,
    });
  };

  handleSubmit = () => {
    $.post('/watcher/components', this.state.formData, () => {
      this.setState({
        formData: {
          name: '',
          watchers: [
            {
              name: '',
              type: 'HttpWatcher',
            },
          ],
          notifierIds: [],
        },
      });
    });
  };

  render() {
    const { name, watchers, notifierIds } = this.state.formData;
    const notifiers = this.state.notifiers;

    return (
      <div>
        <label>name</label><br />
        <input type="text" name="name" value={name} /><br /><br />
        {watchers.map((w, idx) => (
          <div key={idx}>
            {idx}<br />
            <select
              onChange={e => this.handleChangeWatcherType(idx, e.target.value)}
              value={w.type}
              placeholder="Watcher type"
            >
              {WATCHER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
            </select>
            <WatcherForm key={idx} data={w} />
          </div>
        ))}
        <button onClick={this.handleOnClickAddWatcherButton}>Add watcher</button><br /><br />
        {notifiers.map((n) => (
          <div key={n.id}>
            <input
              type="checkbox"
              value={n.id}
              onChange={e => this.handleChangeNotifier(e, n.id)}
              checked={_.indexOf(notifierIds, n.id) !== -1}
            />
            <label>{n.name}</label>
          </div>
        ))}
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

ComponentForm.propTypes = {
  data: React.PropTypes.object,
};

ComponentForm.defaultProps = {
  data: {
    name: '',
    watchers: [],
    notifierIds: [],
  },
};

export default ComponentForm;
