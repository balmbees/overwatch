/**
 * Created by leehyeon on 8/17/16.
 */

import React from 'react';
import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';

import { WATCHER_TYPES } from '../../../constants';

const WatcherFormGroup = ({ index, watcher, onChange }) => {
  const renderWatcherOptionalForm = (w) => {
    if (w.type === 'HttpWatcher') {
      return (
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>URL</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              value={w.url}
              placeholder="HttpWatcher url"
              onChange={e => onChange('url', e.target.value)}
            />
          </Col>
        </FormGroup>
      );
    } else if (w.type === 'CloudwatchAlarmWatcher') {
      return (
        <div>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Alarm name</Col>
            <Col sm={10}>
              <FormControl type="text" value={w.alarmName} placeholder="Watcher name" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>AWS Access Key Id</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={w.awsAccessKeyId}
                placeholder="awsAccessKeyId"
                onChange={e => onChange('awsAccessKeyId', e.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>AWS Secret Access Key</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={w.awsSecretAccessKey}
                placeholder="awsSecretAccessKey"
                onChange={e => onChange('awsSecretAccessKey', e.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>AWS Region</Col>
            <Col sm={10}>
              <FormControl
                type="text"
                value={w.awsRegion}
                placeholder="awsRegion"
                onChange={e => onChange('awsRegion', e.target.value)}
              />
            </Col>
          </FormGroup>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>Watcher {index}</Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>Watcher name</Col>
        <Col sm={10}>
          <FormControl
            type="text"
            value={watcher.name}
            placeholder="Watcher name"
            onChange={e => onChange('name', e.target.value)}
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>Watcher type</Col>
        <Col sm={10}>
          <FormControl
            onChange={e => onChange('type', e.target.value)}
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
};

WatcherFormGroup.propTypes = {
  index: React.PropTypes.number.isRequired,
  watcher: React.PropTypes.shape({
    name: React.PropTypes.string,
    type: React.PropTypes.type,
  }).isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default WatcherFormGroup;
