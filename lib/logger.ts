/**
 * Server-side logging utility
 * Provides structured logging with context for API routes and server-side operations
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Core logger function that formats and outputs log messages
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(context && { context }),
  };

  // In production, this could be sent to a logging service (e.g., Sentry, DataDog)
  // For now, we use console with proper formatting
  const logString = JSON.stringify(logData);

  switch (level) {
    case 'error':
      console.error(logString);
      break;
    case 'warn':
      console.warn(logString);
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

