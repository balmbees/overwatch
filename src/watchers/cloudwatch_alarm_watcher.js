import { CloudWatch, Config } from 'aws-sdk';

import BaseWatcher from './base';
import WatchResult from './watch_result';

export default class CloudwatchAlarmWatcher extends BaseWatcher {
  watch() {
    return new Promise((resolve) => {
      const config = new Config({
        accessKeyId: this.settings.awsAccessKeyId,
        secretAccessKey: this.settings.awsSecretAccessKey,
        region: this.settings.awsRegion,
      });
      const cloudwatch = new CloudWatch(config);

      cloudwatch.describeAlarms({
        AlarmNames: [
          this.settings.alarmName,
        ],
      }, (err, data) => {
        if (err) {
          resolve(WatchResult.error({
            description: err.message,
          }));
        } else {
          const alarm = data.MetricAlarms[0];
          if (!alarm) {
            resolve(new WatchResult({
              status: 'Error',
              description: 'Alarm not exists.',
            }));
          } else if (alarm.StateValue === 'ALARM') {
            resolve(WatchResult.error({
              description: alarm.StateReason,
            }));
          } else {
            resolve(WatchResult.success({
              description: alarm.StateReason,
            }));
          }
        }
      });
    });
  }
}
