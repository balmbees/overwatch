/**
 * Created by leehyeon on 8/12/16.
 */

import React from 'react';
import { Form, FormGroup, Col, ControlLabel,
  FormControl, Checkbox, ButtonGroup, Button } from 'react-bootstrap';
import $ from 'jquery';

import { WATCHER_SKELETON } from '../../../constants';
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

  handleChangeWatcherType(e, i) {
    const oldFormData = this.state.formData;
    oldFormData.watchers[i].type = e.target.value;

    this.setState({
      formData: oldFormData,
    });
  }

  handleOnClickAddWatcherButton() {
    const newWatcher = Object.assign({}, WATCHER_SKELETON);
    const oldFormData = this.state.formData;
    oldFormData.watchers.push(newWatcher);

    this.setState({
      formData: oldFormData,
    });
  }

  render() {
    const { formData, notifiers } = this.state;
    const watchers = formData.watchers;

    const renderNotifierCheckbox = () => (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>Notifiers</Col>
        <Col sm={10}>
        {notifiers.map((n) => (
          <Checkbox
            key={n.id}
            value={n.id}
            name="notifierIds"
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
            <FormControl type="text" value={formData.name} placeholder="Component name" />
          </Col>
        </FormGroup>
        {watchers.map((w, i) => (
          <WatcherFormGroup
            key={i}
            index={i}
            watcher={w}
            onChangeType={(e) => this.handleChangeWatcherType(e, i)}
          />
        ))}
        <Col smOffset={2} sm={10}>
          <ButtonGroup vertical block>
            <Button onClick={() => this.handleOnClickAddWatcherButton()}>Add watcher</Button>
          </ButtonGroup>
        </Col>
        {renderNotifierCheckbox()}
        <ButtonGroup vertical block>
          <Button bsStyle="primary" bsSize="large">Submit</Button>
        </ButtonGroup>
      </Form>
    );
  }
}

export default ComponentFrom;
