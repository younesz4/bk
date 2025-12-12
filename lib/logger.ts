/**
 * Professional Event Logger
 * Server and client-side logging with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  sessionId?: string
  url?: string
  userAgent?: string
}

// Log storage (in-memory for now, can be extended to file/database)
const logBuffer: LogEntry[] = []
const MAX_BUFFER_SIZE = 1000

// Only log in development or if explicitly enabled
const shouldLog = (level: LogLevel): boolean => {
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  // In production, only log warn, error, and critical
  return ['warn', 'error', 'critical'].includes(level)
}

/**
 * Format log entry
 */
function formatLogEntry(entry: LogEntry): string {
  const timestamp = entry.timestamp
  const level = entry.level.toUpperCase().padEnd(8)
  const message = entry.message
  const context = entry.context ? JSON.stringify(entry.context, null, 2) : ''
  const error = entry.error ? `\n${entry.error.stack}` : ''
  
  return `[${timestamp}] ${level} ${message}${context ? '\n' + context : ''}${error}`
}

/**
 * Add log entry to buffer
 */
function addToBuffer(entry: LogEntry) {
  logBuffer.push(entry)
  
  // Keep buffer size manageable
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift()
  }
  
  // Send critical errors to Sentry (if available)
  if (entry.level === 'critical' && typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(entry.error || new Error(entry.message), {
      level: 'fatal',
      contexts: {
        custom: entry.context,
      },
    })
  }
}

/**
 * Server-side logger
 */
export const logger = {
  debug(message: string, context?: Record<string, any>) {
    if (!shouldLog('debug')) return
    
    const entry: LogEntry = {
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      context,
    }
    
    addToBuffer(entry)
    console.debug(formatLogEntry(entry))
  },
  
  info(message: string, context?: Record<string, any>) {
    if (!shouldLog('info')) return
    
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context,
    }
    
    addToBuffer(entry)
    console.info(formatLogEntry(entry))
  },
  
  warn(message: string, context?: Record<string, any>, error?: Error) {
    if (!shouldLog('warn')) return
    
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
    
    addToBuffer(entry)
    console.warn(formatLogEntry(entry))
  },
  
  error(message: string, error?: Error, context?: Record<string, any>) {
    if (!shouldLog('error')) return
    
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
    
    addToBuffer(entry)
    console.error(formatLogEntry(entry))
    
    // Send to Sentry if available (server-side)
    if (typeof process !== 'undefined' && (process as any).env?.SENTRY_DSN) {
      // Sentry will be initialized separately
    }
  },
  
  critical(message: string, error?: Error, context?: Record<string, any>) {
    const entry: LogEntry = {
      level: 'critical',
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }
    
    addToBuffer(entry)
    console.error(formatLogEntry(entry))
    
    // Always log critical errors, even in production
    // Send to Sentry if available
    if (typeof process !== 'undefined' && (process as any).env?.SENTRY_DSN) {
      // Sentry will be initialized separately
    }
  },
}

/**
 * Client-side logger
 */
export const clientLogger = {
  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context)
    }
  },
  
  info(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, context)
    }
  },
  
  warn(message: string, context?: Record<string, any>, error?: Error) {
    console.warn(`[WARN] ${message}`, context, error)
    
    // Send to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureMessage(message, {
        level: 'warning',
        contexts: {
          custom: context,
        },
      })
    }
  },
  
  error(message: string, error?: Error, context?: Record<string, any>) {
    console.error(`[ERROR] ${message}`, context, error)
    
    // Send to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error || new Error(message), {
        level: 'error',
        contexts: {
          custom: context,
        },
      })
    }
  },
  
  critical(message: string, error?: Error, context?: Record<string, any>) {
    console.error(`[CRITICAL] ${message}`, context, error)
    
    // Always send critical errors to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      ;(window as any).Sentry.captureException(error || new Error(message), {
        level: 'fatal',
        contexts: {
          custom: context,
        },
      })
    }
  },
}

/**
 * Get recent logs (for debugging)
 */
export function getRecentLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
  let logs = logBuffer
  
  if (level) {
    logs = logs.filter((log) => log.level === level)
  }
  
  return logs.slice(-limit)
}

/**
 * Clear log buffer
 */
export function clearLogs() {
  logBuffer.length = 0
}

/**
 * Export logs to JSON (for debugging)
 */
export function exportLogs(): string {
  return JSON.stringify(logBuffer, null, 2)
}




