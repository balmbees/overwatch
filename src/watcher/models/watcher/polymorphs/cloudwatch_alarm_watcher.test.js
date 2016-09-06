/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import { expect } from 'chai';
import CloudwatchAlarmWatcher from './cloudwatch_alarm_watcher';
import pmock from 'pmock';

describe('CloudwatchAlarmWatcher', () => {
  describe('_cloudwatchConfig()', () => {
    let watcher = null;
    before(() => {
      watcher = new CloudwatchAlarmWatcher();
    });

    it('should build config from model', () => {
      watcher.awsRegion = 'test-region';
      watcher.awsAccessKeyId = 'test-key-id';

      const config = watcher._cloudwatchConfig(); // eslint-disable-line
      expect(config.region).to.eq('test-region');
      expect(config.credentials.accessKeyId).to.eq('test-key-id');
    });

    it('should build config from default if model values are empty', () => {
      watcher.awsRegion = null;
      watcher.awsAccessKeyId = null;

      pmock.env({
        CLOUDWATCH_WATCHER_AWS_REGION: 'test-region',
        CLOUDWATCH_WATCHER_AWS_ACCESS_KEY_ID: 'test-key-id',
        CLOUDWATCH_WATCHER_AWS_SECRET_ACCESS_KEY: 'test-secret-key',
      });

      const config = watcher._cloudwatchConfig(); // eslint-disable-line
      expect(config.region).to.eq('test-region');
      expect(config.credentials.accessKeyId).to.eq('test-key-id');
    });
  });
});
