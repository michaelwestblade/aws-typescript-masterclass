import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {v4 as uuidv4} from 'uuid';
import {S3Client, ListBucketsCommand} from '@aws-sdk/client-s3';

const s3 = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const command = new ListBucketsCommand({});
  const listBucketsResult = await s3.send(command);
  console.log(listBucketsResult);

  const uuid = uuidv4();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello World ${uuid}`,
    }),
  }
  return response;
}

export { handler };