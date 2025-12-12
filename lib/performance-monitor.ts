/**
 * Performance Monitoring
 * Tracks API response times, database queries, and page load metrics
 */

import { logger } from './logger'

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  type: 'api' | 'database' | 'page' | 'cache'
  metadata?: Record<string, any>
}

const metrics: PerformanceMetric[] = []
const MAX_METRICS = 1000

/**
 * Track API response time
 */
export function trackAPIResponse(
  endpoint: string,
  method: string,
  duration: number,
  statusCode: number,
  metadata?: Record<string, any>
) {
  const metric: PerformanceMetric = {
    name: `${method} ${endpoint}`,
    duration,
    timestamp: Date.now(),
    type: 'api',
    metadata: {
      endpoint,
      method,
      statusCode,
      ...metadata,
    },
  }
  
  metrics.push(metric)
  
  // Keep buffer size manageable
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }
  
  // Log slow API calls
  if (duration > 1000) {
    logger.warn(`Slow API call: ${method} ${endpoint} took ${duration}ms`, {
      duration,
      statusCode,
      ...metadata,
    })
  }
  
  // Log errors
  if (statusCode >= 500) {
    logger.error(`API error: ${method} ${endpoint} returned ${statusCode}`, undefined, {
      duration,
      ...metadata,
    })
  }
}

/**
 * Track database query time
 */
export function trackDatabaseQuery(
  operation: string,
  model: string,
  duration: number,
  metadata?: Record<string, any>
) {
  const metric: PerformanceMetric = {
    name: `${operation} ${model}`,
    duration,
    timestamp: Date.now(),
    type: 'database',
    metadata: {
      operation,
      model,
      ...metadata,
    },
  }
  
  metrics.push(metric)
  
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }
  
  // Log slow queries
  if (duration > 500) {
    logger.warn(`Slow database query: ${operation} ${model} took ${duration}ms`, {
      duration,
      ...metadata,
    })
  }
}

/**
 * Track page load time
 */
export function trackPageLoad(
  page: string,
  duration: number,
  metadata?: Record<string, any>
) {
  const metric: PerformanceMetric = {
    name: `Page Load: ${page}`,
    duration,
    timestamp: Date.now(),
    type: 'page',
    metadata: {
      page,
      ...metadata,
    },
  }
  
  metrics.push(metric)
  
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }
  
  // Log slow page loads
  if (duration > 3000) {
    logger.warn(`Slow page load: ${page} took ${duration}ms`, {
      duration,
      ...metadata,
    })
  }
}

/**
 * Track cache operation
 */
export function trackCacheOperation(
  operation: 'hit' | 'miss' | 'set' | 'delete',
  key: string,
  duration: number
) {
  const metric: PerformanceMetric = {
    name: `Cache ${operation}: ${key}`,
    duration,
    timestamp: Date.now(),
    type: 'cache',
    metadata: {
      operation,
      key,
    },
  }
  
  metrics.push(metric)
  
  if (metrics.length > MAX_METRICS) {
    metrics.shift()
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats(timeWindowMs: number = 60 * 60 * 1000): {
  api: {
    average: number
    p95: number
    p99: number
    count: number
    errors: number
  }
  database: {
    average: number
    p95: number
    p99: number
    count: number
    slowQueries: number
  }
  page: {
    average: number
    p95: number
    p99: number
    count: number
    slowPages: number
  }
} {
  const now = Date.now()
  const windowStart = now - timeWindowMs
  
  const recentMetrics = metrics.filter((m) => m.timestamp >= windowStart)
  
  const apiMetrics = recentMetrics.filter((m) => m.type === 'api')
  const dbMetrics = recentMetrics.filter((m) => m.type === 'database')
  const pageMetrics = recentMetrics.filter((m) => m.type === 'page')
  
  const calculateStats = (ms: PerformanceMetric[]) => {
    if (ms.length === 0) {
      return {
        average: 0,
        p95: 0,
        p99: 0,
        count: 0,
        errors: 0,
        slowQueries: 0,
        slowPages: 0,
      }
    }
    
    const durations = ms.map((m) => m.duration).sort((a, b) => a - b)
    const average = durations.reduce((a, b) => a + b, 0) / durations.length
    const p95 = durations[Math.floor(durations.length * 0.95)]
    const p99 = durations[Math.floor(durations.length * 0.99)]
    
    return {
      average: Math.round(average),
      p95: Math.round(p95),
      p99: Math.round(p99),
      count: ms.length,
      errors: ms.filter((m) => m.metadata?.statusCode >= 500).length,
      slowQueries: ms.filter((m) => m.duration > 500).length,
      slowPages: ms.filter((m) => m.duration > 3000).length,
    }
  }
  
  const apiStats = calculateStats(apiMetrics)
  const dbStats = calculateStats(dbMetrics)
  const pageStats = calculateStats(pageMetrics)
  
  return {
    api: {
      average: apiStats.average,
      p95: apiStats.p95,
      p99: apiStats.p99,
      count: apiStats.count,
      errors: apiStats.errors,
    },
    database: {
      average: dbStats.average,
      p95: dbStats.p95,
      p99: dbStats.p99,
      count: dbStats.count,
      slowQueries: dbStats.slowQueries,
    },
    page: {
      average: pageStats.average,
      p95: pageStats.p95,
      p99: pageStats.p99,
      count: pageStats.count,
      slowPages: pageStats.slowPages,
    },
  }
}

/**
 * Performance monitoring middleware for API routes
 */
export function withPerformanceMonitoring<T>(
  handler: () => Promise<T>,
  endpoint: string,
  method: string
): Promise<T> {
  const startTime = Date.now()
  
  return handler()
    .then((result) => {
      const duration = Date.now() - startTime
      trackAPIResponse(endpoint, method, duration, 200)
      return result
    })
    .catch((error) => {
      const duration = Date.now() - startTime
      trackAPIResponse(
        endpoint,
        method,
        duration,
        error.status || 500,
        { error: error.message }
      )
      throw error
    })
}




