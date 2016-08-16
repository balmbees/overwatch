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
import
  WatchResult,
  { STATUS_NONE, STATUS_ERROR, STATUS_SUCCESS }
from './watch_result';

describe('WatchResult', () => {
  it('static success', () => {
    const result = WatchResult.success({ description: 'test' });
    expect(result.status).to.eq(STATUS_SUCCESS);
  });
});
