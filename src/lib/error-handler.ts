/**
 * SaaS Vala Enterprise - Error Handler
 * Centralized error handling for APIs
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, 'AUTHENTICATION_ERROR', message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(403, 'AUTHORIZATION_ERROR', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND_ERROR', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(409, 'CONFLICT_ERROR', message, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(429, 'RATE_LIMIT_ERROR', message);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, 'INTERNAL_SERVER_ERROR', message, details);
  }
}

export function handleError(error: unknown): Response {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    return Response.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return Response.json(
      {
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error,
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  return Response.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    },
    { status: 500 }
  );
}
