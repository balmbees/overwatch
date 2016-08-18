/**
 * Created by leehyeon on 8/12/16.
 */

import React from 'react';
import { Form, FormGroup, Col, ControlLabel,
  FormControl, Checkbox, ButtonGroup, Button } from 'react-bootstrap';
import $ from 'jquery';
import _ from 'lodash';

import WatcherFormGroup from './WatcherFormGroup';

class ComponentFrom extends React.Component {
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
    const newWatcher = Object.assign({}, {
      name: '',
      type: 'HttpWatcher',
    });
    const oldFormData = this.state.formData;
    oldFormData.watchers.push(newWatcher);

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
    $.post('/watcher/components', this.state.formData, (r) => {
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
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>Notifiers</Col>
        <Col sm={10}>
        {notifiers.map((n) => (
          <Checkbox
            key={n.id}
            value={n.id}
            name="notifierIds"
            onChange={(e) => this.handleChangeNotifier(e.target.checked, n.id)}
            checked={n.id in notifierIds}
            inline
          >
            {n.name}
          </Checkbox>
        ))}
        </Col>
      </FormGroup>
    );

    return (
      <Form horizontal>
        <FormGroup controlId="componentName">
          <Col componentClass={ControlLabel} sm={2}>Component Name</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={formData.name}
              placeholder="Component name"
              onChange={e => this.handleChangeData('name', e.target.value)}
            />
          </Col>
        </FormGroup>
        {watchers.map((w, i) => (
          <WatcherFormGroup
            key={i}
            index={i}
            watcher={w}
            onChange={(field, value) => this.handleChangeWatcher(i, field, value)}
          />
        ))}
        <Col smOffset={2} sm={10}>
          <ButtonGroup vertical block>
            <Button onClick={() => this.handleOnClickAddWatcherButton()}>Add watcher</Button>
          </ButtonGroup>
        </Col>
        {renderNotifierCheckbox()}
        <ButtonGroup vertical block>
          <Button
            bsStyle="primary"
            bsSize="large"
            onClick={() => this.handleSubmit()}
          >
            Submit
          </Button>
        </ButtonGroup>
      </Form>
    );
  }
}

export default ComponentFrom;
