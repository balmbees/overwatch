/**
 * Created by leehyeon on 8/9/16.
 */
import { CloudWatch, Config } from 'aws-sdk';
import request from 'request';
import _ from 'lodash';

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

  insert() {
    if (!this.isValid()) {
      return Promise.reject('Invalid watcher');
    }

    return BaseModel.db()
      .cypher('CREATE (w:Watcher { props }) RETURN id(w), w',
        { props: _.omit(this.serialize(), 'id') })
      .then(resp => {
        const r = resp.body.results[0].data[0].row;
        return _.extend(r[1], { id: r[0] });
      });
  }

  isValid() {
    throw new Error('Not Implemented');
  }

  watch() {
    throw new Error('Not Implemented');
  }
}

export class HttpWatcher extends Watcher {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name', 'url']), id);
  }

  serialize() {
    return _.pick(this, ['type', 'id', 'name', 'url']);
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'url'], (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

  watch() {
    return new Promise((resolve) => {
      request(this.url, (error, response) => {
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
  constructor(settings, id = undefined) {
    super(_.pick(settings,
      ['type', 'name', 'awsAccessKeyId', 'awsSecretAccessKey', 'awsRegion', 'alarmName']), id);
  }

  serialize() {
    return _.pick(this,
      ['type', 'id', 'name', 'awsAccessKeyId', 'awsSecretAccessKey', 'awsRegion', 'alarmName']);
  }

  isValid() {
    return _.reduce(Object.keys(this),
      (m, n) => m & (n in ['type', 'name', 'awsAccessKeyId',
        'awsSecretAccessKey', 'awsRegion', 'alarmName']),
      true);
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
          resolve(WatchResult.error({
            description: err.message,
          }));
        } else {
          const alarm = data.MetricAlarms[0];
          if (!alarm) {
            resolve(WatchResult.error({
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
