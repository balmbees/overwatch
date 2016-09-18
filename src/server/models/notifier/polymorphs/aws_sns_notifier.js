import _ from 'lodash';
import { SNS, Config } from 'aws-sdk';

import Notifier from '../base';

export default class AwsSnsNotifier extends Notifier {
  constructor(settings, id = undefined) {
    super(_.pick(settings, ['type', 'name', 'awsAccessKeyId',
      'awsSecretAccessKey', 'awsRegion', 'targetArn']), id);
  }

  serialize() {
    return _.pick(this, ['type', 'id', 'name', 'awsAccessKeyId',
      'awsSecretAccessKey', 'awsRegion', 'targetArn']);
  }

  notify({ component, watcher, watchResult }) {
    return new Promise((resolve, reject) => {
      const config = new Config({
        accessKeyId: this.awsAccessKeyId,
        secretAccessKey: this.awsSecretAccessKey,
        region: this.awsRegion,
      });
      const sns = new SNS(config);

      sns.publish({
        Message: this.message({ component, watcher, watchResult }),
        TargetArn: this.targetArn,
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  isValid() {
    const objFields = Object.keys(this);
    const val = _.reduce(['type', 'name', 'awsAccessKeyId',
        'awsSecretAccessKey', 'awsRegion', 'targetArn'],
      (m, n) => (m & _.includes(objFields, n)), true);

    return val;
  }
}
