import { AuthService } from './AuthService';

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login(
    process.env.username || '',
    process.env.password || '',
  );
  const idToken = await service.getIdToken();
  console.log(loginResult);
  console.log(idToken);

  const credentials = await service.generateTemporaryCredentials();
  console.log(credentials);
}

testAuth()
  .then(() => console.log('done'))
  .catch((e) => console.error(e));
