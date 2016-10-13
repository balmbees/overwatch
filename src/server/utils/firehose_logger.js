/**
 * Created by am2rican5 on 2016. 10. 6..
 */

import { Firehose, Config } from 'aws-sdk';

export class FirehoseLogger {
  static _firehose() {
    const config = new Config({
      accessKeyId: (
        this.awsAccessKeyId || process.env.FIREHOSE_AWS_ACCESS_KEY_ID
      ),
      secretAccessKey: (
        this.awsSecretAccessKey || process.env.FIREHOSE_AWS_SECRET_ACCESS_KEY
      ),
      region: (
        this.awsRegion || process.env.FIREHOSE_AWS_REGION
      ),
    });

    return new Firehose(config);
  }

  static logWatcherRecords(component, records) {
    if (process.env.NODE_ENV === 'production') {
      this._firehose().putRecordBatch({
        DeliveryStreamName: process.env.FIREHOSE_DELIVERY_STREAM_NAME || 'overwatch_watcher_log',
        Records: records.map(r => ({
          Data: JSON.stringify({
            Component: {
              id: component.id,
              name: component.name,
            },
            Watcher: {
              id: r[0].id,
              name: r[0].name,
            },
            WatchResult: {
              status: r[1].status,
              description: r[1].description,
              createdAt: r[1].createdAt,
            },
          }),
        })),
      }, (err) => {
        if (err) {
          console.log(err, err.stack); // eslint-disable-line no-console
        }
      });
    }
  }
}
