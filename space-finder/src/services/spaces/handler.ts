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
import { MissingFieldException } from '../shared/DataValidator';
import { addCORSHeader } from '../shared/Utils';

const dynamoClient = new DynamoDBClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult | undefined = undefined;

  try {
    switch (event.httpMethod) {
      case 'GET':
        response = await GetSpaces(event, dynamoClient);
        break;
      case 'POST':
        response = await PostSpaces(event, dynamoClient);
        break;
      case 'PUT':
        response = await UpdateSpaces(event, dynamoClient);
        break;
      case 'DELETE':
        response = await DeleteSpaces(event, dynamoClient);
        break;
    }
  } catch (error: any) {
    if (error instanceof MissingFieldException) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: error?.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error?.message }),
    };
  }

  return addCORSHeader(response as APIGatewayProxyResult);
}

export { handler };
