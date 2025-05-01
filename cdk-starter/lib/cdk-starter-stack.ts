import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput, CfnParameter } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number = 30) {
    super(scope, id);

    new Bucket(this, id, {
      lifecycleRules: [{ expiration: cdk.Duration.days(expiration) }],
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create an s3 bucket 3 ways

    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{ expirationInDays: 1, status: 'Enabled' }],
      },
    });

    const expirationInDays = new CfnParameter(this, 'ExpirationInDays', {
      default: 30,
      type: 'Number',
    });

    const myL2Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [
        { expiration: cdk.Duration.days(expirationInDays.valueAsNumber) },
      ],
    });

    new CfnOutput(this, 'MyL2BucketName', { value: myL2Bucket.bucketName });

    new L3Bucket(this, 'MyL3Bucket', 1);
  }
}
