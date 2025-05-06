import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from 'aws-cdk-lib/aws-iam';

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unauthenticatedRole: Role;
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();

    this.createIdentityPool();
    this.createRoles();
    this.attachRoles();

    this.createAdminsGroup();
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
      roleArn: this.adminRole.roleArn,
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

  private createRoles() {
    this.authenticatedRole = new Role(this, 'SpacesAuthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    this.unauthenticatedRole = new Role(this, 'SpacesUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    this.adminRole = new Role(this, 'SpacesAdminRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });

    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          's3:ListAllMyBuckets',
          's3:ListBucket',
          's3:GetBucketLocation',
        ],
        resources: ['*'],
      }),
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(
      this,
      'SpacesIdentityPoolRoleAttachment',
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: this.authenticatedRole.roleArn,
          unauthenticated: this.unauthenticatedRole.roleArn,
        },
        roleMappings: {
          adminsMapping: {
            type: 'Token',
            ambiguousRoleResolution: 'AuthenticatedRole',
            identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
          },
        },
      },
    );
  }
}
