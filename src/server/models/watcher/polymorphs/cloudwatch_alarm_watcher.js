import _ from 'lodash';
import { CloudWatch, Config } from 'aws-sdk';

import WatchResult from '../../watch_result';
import Watcher from '../base';

class CloudwatchAlarmWatcher extends Watcher {
  constructor(settings, id = undefined) {
    super(_.pick(settings,
      ['type', 'name', 'awsAccessKeyId', 'awsSecretAccessKey', 'awsRegion', 'alarmName']), id);
  }

  serialize() {
    return _.pick(this,
      ['type', 'id', 'name', 'awsAccessKeyId', 'awsSecretAccessKey', 'awsRegion', 'alarmName']);
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'alarmName'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

  _cloudwatchConfig() {
    const config = new Config({
      accessKeyId: (
        this.awsAccessKeyId || process.env.CLOUDWATCH_WATCHER_AWS_ACCESS_KEY_ID
      ),
      secretAccessKey: (
        this.awsSecretAccessKey || process.env.CLOUDWATCH_WATCHER_AWS_SECRET_ACCESS_KEY
      ),
      region: (
        this.awsRegion || process.env.CLOUDWATCH_WATCHER_AWS_REGION
      ),
    });
    return config;
  }

  watch() {
    return new Promise((resolve) => {
      const cloudwatch = new CloudWatch(this._cloudwatchConfig());
      cloudwatch.describeAlarms({
        AlarmNames: [
          this.alarmName,
        ],
      }, (err, data) => {
        if (err) {
          this.result = WatchResult.error({
            description: err.message,
          });
        } else {
          const alarm = data.MetricAlarms[0];
          if (!alarm) {
            this.result = WatchResult.error({
              description: 'Alarm not exists.',
            });
          } else if (alarm.StateValue === 'ALARM') {
            this.result = WatchResult.error({
              description: alarm.StateReason,
            });
          } else {
            this.result = WatchResult.success({
              description: alarm.StateReason,
            });
          }
        }
        resolve(this.result);
      });
    });
  }
}

export default CloudwatchAlarmWatcher;
