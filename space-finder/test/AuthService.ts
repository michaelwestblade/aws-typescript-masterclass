import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn, SignInOutput } from '@aws-amplify/auth';

const awsRegion = 'us-east-2';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_2CvEv6qwA',
      userPoolClientId: 'amm2r1041g5gb2ke50d5r9lq1',
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
}
