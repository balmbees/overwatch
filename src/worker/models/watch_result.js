/**
 * Created by leehyeon on 8/9/16.
 */
import _ from 'lodash';


export const STATUS_ERROR = 'Error';
export const STATUS_SUCCESS = 'Success';

const STATUS = {
  STATUS_ERROR,
  STATUS_SUCCESS,
};
const statusValues = _.values(STATUS);

export default class WatchResult {
  constructor(status, options) {
    this.status = status;
    this.description = options.description;
    this.createdAt = new Date();
  }

  static success(options = {}) {
    return new this(STATUS_SUCCESS, options);
  }

  static error(options = {}) {
    return new this(STATUS_ERROR, options);
  }

  getMessage() {
    return `${this.status} : ${this.description}`;
  }
}
