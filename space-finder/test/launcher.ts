import { handler } from '../src/services/spaces/handler';

handler(
  {
    body: '{"location": "London"}',
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
  } as any,
  {} as any,
);
