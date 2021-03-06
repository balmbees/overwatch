/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import { expect } from 'chai';
import
  WatchResult,
  { STATUS_ERROR, STATUS_SUCCESS }
from './watch_result';

describe('WatchResult', () => {
  it('static success', () => {
    const result = WatchResult.success({ description: 'test' });
    expect(result.status).to.eq(STATUS_SUCCESS);
    expect(result.description).to.eq('test');
  });

  it('static error', () => {
    const result = WatchResult.error({ description: 'test' });
    expect(result.status).to.eq(STATUS_ERROR);
    expect(result.description).to.eq('test');
  });

  describe('getMessage()', () => {
    it('should return message', () => {
      const result = WatchResult.success({ description: 'test' });
      expect(result.getMessage()).to.eq('Success : test');
    });
  });
});
