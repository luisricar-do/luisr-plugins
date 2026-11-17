// Contract of the HTTP error mapper: named errors keep their status, Fastify 4xx stay 4xx,
// anything else is 500 and never leaks the message.
import { describe, expect, it } from 'vitest';
import Fastify from 'fastify';
import { z } from 'zod';
import { errorHandler, ForbiddenError, NotFoundError } from '../src/errors.js';

function app(thrower: () => never) {
  const f = Fastify();
  f.setErrorHandler(errorHandler);
  f.post('/x', async () => thrower());
  return f;
}

describe('errorHandler', () => {
  it('maps named errors to their status and code', async () => {
    const res = await app(() => { throw new ForbiddenError('not_owner'); }).inject({ method: 'POST', url: '/x' });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ error: { code: 'not_owner' } });
    const nf = await app(() => { throw new NotFoundError(); }).inject({ method: 'POST', url: '/x' });
    expect(nf.statusCode).toBe(404);
  });

  it('maps zod validation to 400 with field names only', async () => {
    const res = await app(() => { z.object({ a: z.string() }).parse({}); throw new Error('unreachable'); }).inject({ method: 'POST', url: '/x' });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.fields).toEqual(['a']);
  });

  it('keeps Fastify client errors as 4xx (malformed JSON is 400, not 500)', async () => {
    const res = await app(() => { throw new Error('unreachable'); }).inject({
      method: 'POST', url: '/x', headers: { 'content-type': 'application/json' }, payload: '{bad',
    });
    expect(res.statusCode).toBe(400);
  });

  it('turns unknown errors into 500 without leaking the message', async () => {
    const res = await app(() => { throw new Error('password=hunter2 at db.internal'); }).inject({ method: 'POST', url: '/x' });
    expect(res.statusCode).toBe(500);
    expect(res.body).not.toContain('hunter2');
  });
});
