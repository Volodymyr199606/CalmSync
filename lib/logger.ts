/**
 * Server-side logging utility
 * Provides structured logging with context for API routes and server-side operations
 * Integrates with Sentry for error tracking and monitoring
 */

import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Core logger function that formats and outputs log messages
 * Errors and warnings are automatically sent to Sentry in production
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(context && { context }),
  };

  const logString = JSON.stringify(logData);

  switch (level) {
    case 'error':
      console.error(logString);
      // Send errors to Sentry for tracking
      Sentry.captureMessage(message, {
        level: 'error',
        contexts: context ? { extra: context } : undefined,
      });
      break;
    case 'warn':
      console.warn(logString);
      // Send warnings to Sentry in production
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureMessage(message, {
          level: 'warning',
          contexts: context ? { extra: context } : undefined,
        });
      }
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(logString);
      }
      break;
    case 'info':
    default:
      console.log(logString);
      break;
  }
}

/**
 * Logger object with convenience methods for different log levels
 */
export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};

/**
 * Helper to extract safe error information for logging
 * Prevents logging sensitive data while capturing useful debug info
 */
export function extractErrorInfo(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
  return { error: String(error) };
}

/**
 * Helper to log errors with automatic Sentry capture
 * Use this for catching and logging exceptions with full context
 */
export function logError(
  message: string,
  error: unknown,
  context?: LogContext
): void {
  const errorInfo = extractErrorInfo(error);
  logger.error(message, { ...context, ...errorInfo });

  // Explicitly capture the exception in Sentry if it's an Error object
  if (error instanceof Error) {
    Sentry.captureException(error, {
      contexts: context ? { extra: context } : undefined,
    });
  }
}

