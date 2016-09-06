/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import { expect } from 'chai';
import CloudwatchAlarmWatcher from './cloudwatch_alarm_watcher';

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

      process.env.CLOUDWATCH_ALA_WATCHER_AWS_REGION = 'test-region';
      process.env.CLOUDWATCH_ALA_WATCHER_AWS_ACCESS_KEY_ID = 'test-key-id';

      const config = watcher._cloudwatchConfig(); // eslint-disable-line
      expect(config.region).to.eq('test-region');
      expect(config.credentials.accessKeyId).to.eq('test-key-id');
    });
  });
});
