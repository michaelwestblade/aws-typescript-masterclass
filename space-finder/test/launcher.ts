import { handler } from '../src/services/spaces/handler';

handler(
  {
    body: '{"location": "London"}',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: { id: 'c6ed8665-95a9-4dc4-9513-ae96a0ec485e' },
    httpMethod: 'GET',
  } as any,
  {} as any,
);
