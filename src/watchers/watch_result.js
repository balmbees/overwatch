import _ from 'underscore';

export default class WatchResult {
  constructor(options) {
    Object.assign(
      this,
      _.pick(options, [
        'status',
        'description',
      ])
    );
  }
}
