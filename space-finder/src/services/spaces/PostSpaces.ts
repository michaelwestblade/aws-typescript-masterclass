import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';
import { validateAsSpaceEntry } from '../shared/DataValidator';

export async function PostSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const item = JSON.parse(event.body || '');
  item.id = randomId;
  validateAsSpaceEntry(item);

  const command = new PutItemCommand({
    Item: marshall(item),
    TableName: process.env.TABLE_NAME || '',
  });
  const result = await dynamoClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
}
