import { AuthService } from './AuthService';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

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

  await listBuckets(credentials);
}

async function listBuckets(credentials: any) {
  const s3Client = new S3Client({
    credentials: credentials,
  });

  const listBucketsResponse = await s3Client.send(new ListBucketsCommand());
  console.log(listBucketsResponse);
}

testAuth()
  .then(() => console.log('done'))
  .catch((e) => console.error(e));
