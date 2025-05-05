import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class AuthStack extends Stack {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'SpacesUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });

    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
    });
  }
  private createUserPoolClient() {
    this.userPoolClient = new UserPoolClient(this, 'SpacesUserPoolClient', {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        custom: true,
        adminUserPassword: true,
        userSrp: true,
      },
    });

    new CfnOutput(this, 'SpacesUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
