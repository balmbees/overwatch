/**
 * Created by leehyeon on 8/9/16.
 */
import { CloudWatch, Config } from 'aws-sdk';
import request from 'request';

import BaseModel from './base';
import WatchResult from './watch_result';

const label = 'Watcher';
export class Watcher extends BaseModel {
  static fetchById(id) {
    return super.fetchById(id, label);
  }

  static fetchAll() {
    return super.fetchAll(label);
  }

  watch() {
    throw new Error('Not Implemented');
  }
}

export class HttpWatcher extends Watcher {
  watch() {
    return new Promise((resolve) => {
      request(this.settings.url, (error, response) => {
        if (error || response.statusCode < 200 || response.statusCode > 299) {
          resolve(WatchResult.error({
            description: error.message,
          }));
        } else {
          resolve(WatchResult.success({
            description: `Status: ${response.statusCode}`,
          }));
        }
      });
    });
  }
}

export class CloudwatchAlarmWatcher extends Watcher {
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

export const watcherTypes = { HttpWatcher, CloudwatchAlarmWatcher };
