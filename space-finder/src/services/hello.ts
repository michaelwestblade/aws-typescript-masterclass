import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import {v4 as uuidv4} from 'uuid';

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log('event',event);
  console.log('context', context);

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