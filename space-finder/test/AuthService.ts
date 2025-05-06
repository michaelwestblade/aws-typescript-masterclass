import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn, SignInOutput } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'us-east-2';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_2CvEv6qwA',
      userPoolClientId: 'amm2r1041g5gb2ke50d5r9lq1',
      identityPoolId: 'us-east-2:5d2ec681-facd-4417-949f-e1b5bb5178ea',
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username,
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH',
      },
    });

    return signInOutput;
  }

  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = (await this.getIdToken()) || '';
    const cognitoIdentityPool: string = `cognito-idp.${awsRegion}.amazonaws.com/us-east-2_2CvEv6qwA`;
    const cognitoIdentityClient = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'us-east-2:5d2ec681-facd-4417-949f-e1b5bb5178ea',
        logins: {
          [cognitoIdentityPool]: idToken,
        },
      }),
    });
    const credentials = await cognitoIdentityClient.config.credentials();
    return credentials;
  }
}
