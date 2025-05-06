import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { getSuffixFromStack } from '../Utils';
import { join } from 'path';
import { existsSync } from 'node:fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
  AccessLevel,
  Distribution,
  OriginAccessIdentity,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, 'UIDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`,
    });

    const uiDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'space-finder-ui',
      'dist',
    );

    if (!existsSync(uiDir)) {
      console.warn(
        `UI directory ${uiDir} does not exist. Skipping deployment.`,
      );
    }

    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });

    const originIdentity = new OriginAccessIdentity(
      this,
      'UIOriginAccessIdentity',
      {
        comment: 'UI Origin Access Identity',
      },
    );

    deploymentBucket.grantRead(originIdentity);

    const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: s3Origin,
      },
    });

    new CfnOutput(this, 'SpacesFinderUrl', {
      value: distribution.distributionDomainName,
    });
  }
}
