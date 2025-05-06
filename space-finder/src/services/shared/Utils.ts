import { randomUUID } from 'node:crypto';
import { JsonError } from './DataValidator';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export function createRandomId() {
  return randomUUID();
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error: any) {
    throw new JsonError(error.message);
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims?.['cognito:groups'];

  if (groups) {
    return groups.includes('admin');
  }

  return false;
}

export function addCORSHeader(arg: APIGatewayProxyResult) {
  return {
    ...arg,
    headers: {
      ...arg.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    },
  };
}
