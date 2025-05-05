import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';

export async function GetSpaces(
  event: APIGatewayProxyEvent,
  dynamoClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters?.id) {
    const result = await dynamoClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME || '',
        Key: { id: { S: event.queryStringParameters.id } },
      }),
    );

    return {
      statusCode: result.Item ? 200 : 404,
      body: JSON.stringify({ result }),
    };
  }

  const result = await dynamoClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME || '',
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
}
