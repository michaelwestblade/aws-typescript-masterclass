import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import { marshall } from '@aws-sdk/util-dynamodb';

export async function DeleteSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters && 'id' in event.queryStringParameters) {
    const spaceId = event.queryStringParameters.id || '';

    const deleteResult = await dynamoClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME || '',
        Key: {
          id: {
            S: spaceId,
          },
        },
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ result: deleteResult }),
    };
  }

  return {
    statusCode: 204,
    body: JSON.stringify('please provide id'),
  };
}
