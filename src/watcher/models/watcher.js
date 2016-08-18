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
    return _.pick(this, ['type', 'id', 'name', 'url', 'result']);
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
          this.result = WatchResult.error({
            description: error.message,
          });
        } else {
          this.result = WatchResult.success({
            description: `Status: ${response.statusCode}`,
          });
        }
        resolve(this.result);
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

export class DummyWatcher extends Watcher {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name']), id);
    this.result = WatchResult.success();
  }

  serialize() {
    return _.pick(this,
      ['type', 'id', 'name']);
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name'], (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }

  watch() {
    return this.result;
  }
}

export const watcherTypes = { HttpWatcher, CloudwatchAlarmWatcher, DummyWatcher };
