/**
 * Created by leehyeon on 8/17/16.
 */

import React from 'react';

import { WATCHER_TYPES } from '../../../constants';

const Watcherdiv = ({ index, watcher, onChange }) => {
  const renderWatcherOptionalForm = (w) => {
    if (w.type === 'HttpWatcher') {
      return (
        <div>
          <label>URL</label>
          <div>
            <input
              type="text"
              value={w.url}
              placeholder="HttpWatcher url"
              onChange={e => onChange('url', e.target.value)}
            />
          </div>
        </div>
      );
    } else if (w.type === 'CloudwatchAlarmWatcher') {
      return (
        <div>
          <div>
            <label>Alarm name</label>
            <div>
              <input type="text" value={w.alarmName} placeholder="Watcher name" />
            </div>
          </div>
          <div>
            <label>AWS Access Key Id</label>
            <div>
              <input
                type="text"
                value={w.awsAccessKeyId}
                placeholder="awsAccessKeyId"
                onChange={e => onChange('awsAccessKeyId', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label>AWS Secret Access Key</label>
            <div>
              <input
                type="text"
                value={w.awsSecretAccessKey}
                placeholder="awsSecretAccessKey"
                onChange={e => onChange('awsSecretAccessKey', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label>AWS Region</label>
            <div>
              <input
                type="text"
                value={w.awsRegion}
                placeholder="awsRegion"
                onChange={e => onChange('awsRegion', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div>
        <label>Watcher {index}</label>
      </div>
      <div>
        <label>Watcher name</label>
        <div>
          <input
            type="text"
            value={watcher.name}
            placeholder="Watcher name"
            onChange={e => onChange('name', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label>Watcher type</label>
        <div>
          <select
            onChange={e => onChange('type', e.target.value)}
            value={watcher.type}
            placeholder="Watcher type"
          >
            {WATCHER_TYPES.map(wt => <option key={wt} value={wt}>{wt}</option>)}
          </select>
        </div>
      </div>
      {renderWatcherOptionalForm(watcher)}
    </div>
  );
};

Watcherdiv.propTypes = {
  index: React.PropTypes.number.isRequired,
  watcher: React.PropTypes.shape({
    name: React.PropTypes.string,
    type: React.PropTypes.type,
  }).isRequired,
  onChange: React.PropTypes.func.isRequired,
};

export default Watcherdiv;
