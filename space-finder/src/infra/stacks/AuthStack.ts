import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CfnIdentityPool,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminsGroup();
    this.createIdentityPool();
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

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, 'spacesAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admins',
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, 'SpacesIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    new CfnOutput(this, 'SpacesIdentityPoolId', {
      value: this.identityPool.ref,
    });
  }
}
