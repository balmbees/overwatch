/**
 * Created by leehyeon on 8/23/16.
 */

import React from 'react';
import { NOTIFIER_TYPES } from '../../../constants';

import $ from 'jquery';

class NotifierForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      type: 'SlackNotifier',
    };
  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleChangeType = (e) => {
    this.setState({
      type: e.target.value,
    });
  };

  handleChangeDetailed = (field, e) => {
    const currentState = this.state;
    currentState[field] = e.target.value;

    this.setState(currentState);
  };

  handleSubmit = () => {
    $.post('/watcher/notifiers', this.state, () => {
      this.setState({
        name: '',
        type: 'SlackNotifier',
      });
    });
  };


  render() {
    const { name, type } = this.state;

    const renderNotifierDetailedForm = (notifierType) => {
      if (notifierType === 'SlackNotifier') {
        return (<div>
          <label>Webhook url</label>
          <input
            type="url"
            value={this.state.webhook_url}
            onChange={(e) => this.handleChangeDetailed('webhook_url', e)}
          /><br />
        </div>);
      } else if (notifierType === 'AwsSnsNotifier') {
        return (<div>
          <label>awsAccessKeyId</label>
          <input
            type="text"
            value={this.state.awsAccessKeyId}
            onChange={(e) => this.handleChangeDetailed('awsAccessKeyId', e)}
          /><br />
          <label>awsSecretAccessKey</label>
          <input
            type="text"
            value={this.state.awsSecretAccessKey}
            onChange={(e) => this.handleChangeDetailed('awsSecretAccessKey', e)}
          /><br />
          <label>awsRegion</label>
          <input
            type="text"
            value={this.state.awsRegion}
            onChange={(e) => this.handleChangeDetailed('awsRegion', e)}
          /><br />
          <label>targetArn</label>
          <input
            type="text"
            value={this.state.targetArn}
            onChange={(e) => this.handleChangeDetailed('targetArn', e)}
          /><br />
        </div>);
      }
      return null;
    };

    return (
      <div>
        <label>Name</label>
        <input name="name" type="text" value={name} onChange={this.handleChangeName} /><br />

        <label>Type</label>
        <select
          name="type"
          onChange={this.handleChangeType}
          value={type}
          placeholder="Notifier type"
        >
          {NOTIFIER_TYPES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select><br />
        {renderNotifierDetailedForm(type)}

        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default NotifierForm;
