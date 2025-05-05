import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export async function PostSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  const randomId = v4();
  const item = JSON.parse(event.body || '');

  const command = new PutItemCommand({
    Item: item,
    TableName: process.env.TABLE_NAME || '',
  });
  const result = await docClient.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
}
