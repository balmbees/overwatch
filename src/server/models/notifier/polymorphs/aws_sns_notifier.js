import { SNS, Config } from 'aws-sdk';

import Notifier from '../base';

import { jsonSchemaModel } from '../../base';

@jsonSchemaModel(require('./aws_sns_notifier_schema')) // eslint-disable-line
export default class AwsSnsNotifier extends Notifier {
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
}
