import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function GetSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from GET' }),
  };
}
