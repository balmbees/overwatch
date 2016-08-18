/**
 * Created by leehyeon on 8/12/16.
 */

import React from 'react';
import $ from 'jquery';
import _ from 'lodash';

import WatcherFormGroup from './WatcherFormGroup';

class ComponentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handleOnClickAddWatcherButton() {
    const oldFormData = this.state.formData;
    oldFormData.watchers.push({
      name: '',
      type: 'HttpWatcher',
    });

    this.setState({
      formData: oldFormData,
    });
  }

  handleChangeWatcher(idx, field, value) {
    const oldFormData = this.state.formData;
    oldFormData.watchers[idx][field] = value;

    this.setState({
      formData: oldFormData,
    });
  }

  handleChangeData(field, value) {
    const oldFormData = this.state.formData;
    oldFormData[field] = value;

    this.setState({
      formData: oldFormData,
    });
  }

  handleChangeNotifier(checked, notifierId) {
    const oldFormData = this.state.formData;

    if (checked) {
      oldFormData.notifierIds.push(notifierId);
    } else {
      _.pull(oldFormData.notifierIds, notifierId);
    }

    this.setState({
      formData: oldFormData,
    });
  }

  handleSubmit() {
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
  }

  render() {
    const { formData, notifiers } = this.state;
    const { watchers, notifierIds } = formData;

    const renderNotifierCheckbox = () => (
      <div>
        <div>Notifiers</div>

        {notifiers.map((n) => (
          <div key={n.id}>
            <input
              type="checkbox"
              value={n.id}
              name="notifierIds"
              onChange={(e) => this.handleChangeNotifier(e.target.checked, n.id)}
              checked={n.id in notifierIds}
            />
            <label>{n.name}</label>
          </div>
          ))}
      </div>
    );

    return (
      <div>
        <div>
          <div>Component Name</div>
          <div>
            <input
              type="text"
              value={formData.name}
              placeholder="Component name"
              onChange={e => this.handleChangeData('name', e.target.value)}
            />
          </div>
        </div>
        {watchers.map((w, i) => (
          <WatcherFormGroup
            key={i}
            index={i}
            watcher={w}
            onChange={(field, value) => this.handleChangeWatcher(i, field, value)}
          />
        ))}
        <div>
          <button onClick={() => this.handleOnClickAddWatcherButton()}>Add watcher</button>
        </div>
        {renderNotifierCheckbox()}
        <button onClick={() => this.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default ComponentForm;
