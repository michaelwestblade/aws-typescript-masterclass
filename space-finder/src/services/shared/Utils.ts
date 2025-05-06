import { randomUUID } from 'node:crypto';
import { JsonError } from './DataValidator';
import { APIGatewayProxyEvent } from 'aws-lambda';

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
