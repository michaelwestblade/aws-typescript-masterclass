import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';

export async function PostSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body || '');

  const command = new PutItemCommand({
    Item: {
      id: { S: randomId },
      location: { S: item.location },
    },
    TableName: process.env.TABLE_NAME || '',
  });
  const result = await dynamoClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
}
