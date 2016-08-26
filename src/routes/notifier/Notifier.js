/**
 * Created by leehyeon on 8/23/16.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';

import NotifierForm from '../../components/Form/notifier/NotifierForm';
import { NOTIFIER_TYPES } from '../../constants';

import s from './Notifier.css';

class Notifier extends React.Component {
  constructor(props, context) {
    super(props, context);
    const title = 'Manage notifiers';

    if (context.setTitle) {
      context.setTitle(title);
    }

    this.state = {
      formData: {
        name: '',
        type: 'SlackNotifier',
      },
    };
  }

  componentDidMount() {
    this.refineData();
  }

  refineData = () => {
    const { formData } = this.state;
    formData.name = formData.name || '';

    const { type } = formData;

    switch (type) {
      case 'AwsSnsNotifier':
        formData.awsAccessKeyId = formData.awsAccessKeyId || '';
        formData.awsSecretAccessKey = formData.awsSecretAccessKey || '';
        formData.awsRegion = formData.awsRegion || '';
        formData.targetArn = formData.targetArn || '';

        break;
      case 'SlackNotifier':
      default:
        formData.type = 'SlackNotifier';
        formData.webhookUrl = formData.webhookUrl || '';

        break;
    }
    this.setState({ formData });
  };

  handleChangeType = (e) => {
    this.setState({
      formData: {
        type: e.target.value,
      },
    });
  };

  handleChangeField = (field, e) => {
    const { formData } = this.state;
    formData[field] = e.target.value;
    this.setState({ formData });
  };

  handleSubmit = () => {
    $.post('/watcher/notifiers', this.state.formData, () => {
      this.setState({
        formData: {
          name: '',
          type: 'SlackNotifier',
        },
      });
    });
  };

  render() {
    const { formData } = this.state;
    return (
      <div className={s.notifierBody}>
        <select name="type" value={formData.type} onChange={this.handleChangeType}>
          {NOTIFIER_TYPES.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <NotifierForm data={formData} handleChangeField={this.handleChangeField} />
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default withStyles(s)(Notifier);
