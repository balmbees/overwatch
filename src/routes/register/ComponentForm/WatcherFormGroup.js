/**
 * Created by leehyeon on 8/17/16.
 */

import React from 'react';
import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

import { WATCHER_TYPES } from '../../../constants';

const renderWatcherOptionalForm = (watcher) => {
  if (watcher.type === 'HttpWatcher') {
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>URL</Col>
        <Col sm={10}>
          <FormControl type="text" value={watcher.url} placeholder="HttpWatcher url" />
        </Col>
      </FormGroup>
    );
  } else if (watcher.type === 'CloudwatchAlarmWatcher') {
    return (
      <div>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Alarm name</Col>
          <Col sm={10}>
            <FormControl type="text" value={watcher.alarmName} placeholder="Watcher name" />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>AWS Access Key Id</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={watcher.awsAccessKeyId}
              placeholder="awsAccessKeyId"
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>AWS Secret Access Key</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={watcher.awsSecretAccessKey}
              placeholder="awsSecretAccessKey"
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>AWS Region</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={watcher.awsRegion}
              placeholder="awsRegion"
            />
          </Col>
        </FormGroup>
      </div>
    );
  }

  return null;
};

const WatcherFormGroup = ({ index, watcher, onChangeType }) => (
  <div>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>Watcher {index}</Col>
    </FormGroup>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>Watcher name</Col>
      <Col sm={10}>
        <FormControl type="text" value={watcher.name} placeholder="Watcher name" />
      </Col>
    </FormGroup>
    <FormGroup>
      <Col componentClass={ControlLabel} sm={2}>Watcher type</Col>
      <Col sm={10}>
        <FormControl
          onChange={onChangeType}
          value={watcher.type}
          componentClass="select"
          placeholder="Watcher type"
        >
          {WATCHER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
        </FormControl>
      </Col>
    </FormGroup>
    {renderWatcherOptionalForm(watcher)}
  </div>
);

WatcherFormGroup.propTypes = {
  index: React.PropTypes.number.isRequired,
  watcher: React.PropTypes.shape({
    name: React.PropTypes.string,
    type: React.PropTypes.type,
  }).isRequired,
  onChangeType: React.PropTypes.func.isRequired,
};

export default WatcherFormGroup;
