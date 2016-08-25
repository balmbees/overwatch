import _ from 'lodash';
import { CloudWatch, Config } from 'aws-sdk';

import WatchResult from '../../watch_result';
import Watcher from '../base';

export default class CloudwatchAlarmWatcher extends Watcher {
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
    const val = _.reduce(['type', 'name', 'awsAccessKeyId',
      'awsSecretAccessKey', 'awsRegion', 'alarmName'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

  watch() {
    return new Promise((resolve) => {
      const config = new Config({
        accessKeyId: this.awsAccessKeyId,
        secretAccessKey: this.awsSecretAccessKey,
        region: this.awsRegion,
      });
      const cloudwatch = new CloudWatch(config);

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
