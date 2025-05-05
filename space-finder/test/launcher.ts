import { handler } from '../src/services/spaces/handler';

handler(
  {
    body: JSON.stringify({ location: 'Londinium' }),
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: { id: 'c6ed8665-95a9-4dc4-9513-ae96a0ec485e' },
    httpMethod: 'DELETE',
  } as any,
  {} as any,
);
