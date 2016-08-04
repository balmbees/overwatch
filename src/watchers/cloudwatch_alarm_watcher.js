import { CloudWatch } from 'aws-sdk';

import BaseWatcher from './base';
import WatchResult from './watch_result';

export default class CloudWatchAlarmWatcher extends BaseWatcher {
  watch() {
    return new Promise((resolve) => {
      const cloudwatch = new CloudWatch(this.settings.awsConfig);
      cloudwatch.describeAlarms({
        AlarmNames: [
          this.settings.alarmName,
        ],
      }, (err, data) => {
        if (err) {
          resolve(new WatchResult({
            status: 'Error',
            description: err.message,
          }));
        } else {
          const alarm = data.MetricAlarms[0];
          if (alarm.StateValue === 'ALARM') {
            resolve(new WatchResult({
              status: 'Error',
              description: alarm.StateReason,
            }));
          } else {
            resolve(new WatchResult({
              status: 'Success',
              description: alarm.StateReason,
            }));
          }
        }
      });
    });
  }
}
