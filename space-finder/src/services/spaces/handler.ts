import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PostSpaces } from './PostSpaces';
import { GetSpaces } from './GetSpaces';
import { UpdateSpaces } from './UpdateSpaces';
import { DeleteSpaces } from './DeleteSpaces';

const dynamoClient = new DynamoDBClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  let message: string = '';

  try {
    switch (event.httpMethod) {
      case 'GET':
        return GetSpaces(event, dynamoClient);
      case 'POST':
        return PostSpaces(event, dynamoClient);
      case 'PUT':
        return UpdateSpaces(event, dynamoClient);
      case 'DELETE':
        return DeleteSpaces(event, dynamoClient);
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error?.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
}

export { handler };
