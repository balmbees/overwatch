import { SNS } from 'aws-sdk';
import BaseNotifier from './base';

export default class SnsNotifier extends BaseNotifier {
  notify(component) {
    return new Promise((resolve, reject) => {
      const sns = new SNS(this.settings.awsConfig);
      sns.publish({
        Message: this.message(component),
        TargetArn: this.settings.targetArn,
      }, (err, data) => {
        console.log(err, data);
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
}
