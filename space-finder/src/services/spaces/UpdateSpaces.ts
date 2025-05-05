import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';

export async function UpdateSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    'id' in event.queryStringParameters &&
    event.body
  ) {
    const spaceId = event.queryStringParameters.id || '';
    const parsedBody = JSON.parse(event.body);
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await dynamoClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME || '',
        Key: {
          id: {
            S: spaceId,
          },
        },
        UpdateExpression: `set #zzzNew = :new`,
        ExpressionAttributeValues: {
          ':new': { S: requestBodyValue },
        },
        ExpressionAttributeNames: {
          '#zzzNew': requestBodyKey,
        },
        ReturnValues: 'UPDATED_NEW',
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ result: updateResult }),
    };
  }

  return {
    statusCode: 204,
    body: JSON.stringify('please provide id and body'),
  };
}
