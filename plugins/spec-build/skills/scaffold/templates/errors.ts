// Named errors + one HTTP mapper at the edge. Driver messages and stacks never reach the client.
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public readonly code: string, public readonly status: number, message?: string) {
    super(message ?? code);
    this.name = new.target.name;
  }
}
export class ValidationError extends AppError { constructor(code = 'invalid_input') { super(code, 400); } }
export class UnauthorizedError extends AppError { constructor(code = 'unauthenticated') { super(code, 401); } }
export class ForbiddenError extends AppError { constructor(code = 'forbidden') { super(code, 403); } }
export class NotFoundError extends AppError { constructor(code = 'not_found') { super(code, 404); } }
export class ConflictError extends AppError { constructor(code = 'conflict') { super(code, 409); } }
export class ExternalServiceError extends AppError {
  constructor(public readonly service: string) { super('external_service_unavailable', 503); }
}

export function errorHandler(err: FastifyError | Error, req: FastifyRequest, reply: FastifyReply) {
  if (err instanceof ZodError) {
    return reply.status(400).send({ error: { code: 'invalid_input', fields: err.issues.map((i) => i.path.join('.')) } });
  }
  if (err instanceof AppError) {
    return reply.status(err.status).send({ error: { code: err.code } });
  }
  // Fastify's own client errors (malformed JSON, body too large, unsupported media type) keep their 4xx.
  const status = (err as FastifyError).statusCode;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return reply.status(status).send({ error: { code: (err as FastifyError).code ?? 'bad_request' } });
  }
  // Infra failure is 500, never 401: masking it as auth hides outages.
  req.log.error({ err: { name: err.name }, requestId: req.id }, 'unhandled_error');
  return reply.status(500).send({ error: { code: 'internal_error' } });
}
