/**
 * Created by leehyeon on 8/17/16.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';
import _ from 'lodash';

import ComponentForm from '../../components/Form/component/ComponentForm';
import WatcherForm from '../../components/Form/watcher/WatcherForm';
import { WATCHER_TYPES } from '../../constants';

import s from './Register.css';

class Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    const title = 'Register component';

    if (context.setTitle) {
      context.setTitle(title);
    }

    this.state = {
      formData: {
        name: '',
        description: '',
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

  handleChangeComponentName = (e) => {
    const { formData } = this.state;
    formData.name = e.target.value;

    this.setState({ formData });
  };

  handleChangeComponentDesc = (e) => {
    const { formData } = this.state;
    formData.description = e.target.value;

    this.setState({ formData });
  };

  handleChangeWatcherType = (idx, value) => {
    const { formData } = this.state;

    switch (value) {
      case 'CloudwatchAlarmWatcher':
        formData.watchers[idx] = {
          type: value,
          name: formData.watchers[idx].name || '',
          awsAccessKeyId: '',
          awsSecretAccessKey: '',
          awsRegion: 'us-east-1',
          alarmName: '',
        };
        break;
      case 'HttpWatcher':
        formData.watchers[idx] = {
          type: value,
          name: formData.watchers[idx].name || '',
          url: '',
        };
        break;
      case 'DummyWatcher':
      default:
        formData.watchers[idx] = {
          type: 'DummyWatcher',
          name: formData.watchers[idx].name || '',
        };
        break;
    }

    this.setState({ formData });
  };

  handleChangeWatcherField = (idx, field, e) => {
    const { formData } = this.state;
    formData.watchers[idx][field] = e.target.value;

    this.setState({ formData });
  };

  handleChangeNotifier = (e, id) => {
    const { formData } = this.state;
    if (e.target.checked) {
      formData.notifierIds.push(id);
    } else {
      _.pull(formData.notifierIds, id);
    }

    this.setState({ formData });
  };

  handleOnClickAddWatcherButton = () => {
    const { formData } = this.state;
    formData.watchers.push({
      name: '',
      type: 'HttpWatcher',
    });

    this.setState({ formData });
  };

  render() {
    const { formData, notifiers } = this.state;
    const { name, description, watchers, notifierIds } = formData;
    return (
      <div className={s.registerBody}>
        <ComponentForm
          name={name}
          description={description}
          handleChangeName={this.handleChangeComponentName}
          handleChangeDesc={this.handleChangeComponentDesc}
        />
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
            <WatcherForm
              key={idx}
              data={w}
              handleChangeField={(field, e) => this.handleChangeWatcherField(idx, field, e)}
            />
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

Register.contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

export default withStyles(s)(Register);
