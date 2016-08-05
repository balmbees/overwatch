import
  STATUS,
  { STATUS_SUCCESS,
    STATUS_ERROR }
  from './watch_result_status';

const statusValues = Object.values(STATUS);

export default class WatchResult {
  constructor(options) {
    this.status = options.status;
    this.description = options.description;
  }

  static success(options) {
    options.status = STATUS_SUCCESS;
    return new this(options);
  }

  static error(options) {
    options.status = STATUS_ERROR;
    return new this(options);
  }

  set status(status) {
    if (!statusValues.includes(status)) {
      throw new Error(`${status} is invalid value for WatchResult.status`);
    }
    this._status = status;
  }

  get status() {
    return this._status;
  }
}
