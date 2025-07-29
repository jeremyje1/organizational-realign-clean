/**
 * ISR (Incremental Static Regeneration) and SSG optimization utilities
 * Provides intelligent caching and regeneration strategies
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { unstable_cache } from 'next/cache'

// Cache configuration for different content types
export const CACHE_CONFIGS = {
  // Static content (rarely changes)
  static: {
    revalidate: 86400, // 24 hours
    tags: ['static-content'],
  },
  // Assessment data (updates periodically)
  assessments: {
    revalidate: 3600, // 1 hour
    tags: ['assessments'],
  },
  // Analytics data (frequently updated)
  analytics: {
    revalidate: 300, // 5 minutes
    tags: ['analytics'],
  },
  // User-specific data (session-based)
  user: {
    revalidate: 60, // 1 minute
    tags: ['user-data'],
  },
  // Real-time data (very frequent updates)
  realtime: {
    revalidate: 30, // 30 seconds
    tags: ['realtime'],
  },
} as const

type CacheType = keyof typeof CACHE_CONFIGS

// Enhanced getStaticProps with intelligent caching
export function createStaticProps<T = any>(
  fetchData: () => Promise<T>,
  cacheType: CacheType = 'static',
  customConfig?: Partial<typeof CACHE_CONFIGS.static>
): GetStaticProps {
  return async () => {
    try {
      const config = { ...CACHE_CONFIGS[cacheType], ...customConfig }
      
      const data = await unstable_cache(
        fetchData,
        [`${cacheType}-data`],
        {
          revalidate: config.revalidate,
          tags: [...config.tags],
        }
      )()

      return {
        props: {
          data,
          timestamp: Date.now(),
          cacheType,
        },
        revalidate: config.revalidate,
      }
    } catch (error) {
      console.error(`Error in getStaticProps for ${cacheType}:`, error)
      
      return {
        props: {
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        },
        revalidate: 60, // Retry in 1 minute on error
      }
    }
  }
}

// Enhanced getStaticPaths with dynamic path generation
export function createStaticPaths<T = any>(
  fetchPaths: () => Promise<T[]>,
  generatePath: (item: T) => string,
  fallback: boolean | 'blocking' = 'blocking'
): GetStaticPaths {
  return async () => {
    try {
      const items = await fetchPaths()
      
      const paths = items.map(item => ({
        params: { slug: generatePath(item) }
      }))

      return {
        paths,
        fallback,
      }
    } catch (error) {
      console.error('Error in getStaticPaths:', error)
      
      return {
        paths: [],
        fallback: true,
      }
    }
  }
}

// Enhanced getServerSideProps with caching headers
export function createServerSideProps<T = any>(
  fetchData: (context: any) => Promise<T>,
  cacheType: CacheType = 'user',
  customHeaders?: Record<string, string>
): GetServerSideProps {
  return async (context) => {
    try {
      const config = CACHE_CONFIGS[cacheType]
      
      // Set cache headers
      context.res.setHeader(
        'Cache-Control',
        `public, s-maxage=${config.revalidate}, stale-while-revalidate=${config.revalidate * 2}`
      )
      
      // Set custom headers
      if (customHeaders) {
        Object.entries(customHeaders).forEach(([key, value]) => {
          context.res.setHeader(key, value)
        })
      }

      const data = await fetchData(context)

      return {
        props: {
          data,
          timestamp: Date.now(),
          cacheType,
        },
      }
    } catch (error) {
      console.error(`Error in getServerSideProps for ${cacheType}:`, error)
      
      return {
        props: {
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        },
      }
    }
  }
}

// Cache invalidation utilities
export class CacheManager {
  static async revalidatePage(path: string): Promise<void> {
    try {
      const response = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to revalidate ${path}`)
      }
    } catch (error) {
      console.error('Cache revalidation failed:', error)
    }
  }

  static async revalidateTag(tag: string): Promise<void> {
    try {
      const response = await fetch(`/api/revalidate?tag=${encodeURIComponent(tag)}`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to revalidate tag ${tag}`)
      }
    } catch (error) {
      console.error('Tag revalidation failed:', error)
    }
  }

  static async purgeCache(): Promise<void> {
    try {
      const response = await fetch('/api/revalidate', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to purge cache')
      }
    } catch (error) {
      console.error('Cache purge failed:', error)
    }
  }
}

// Optimized data fetching utilities
export class DataFetcher {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  static async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data
    }

    // Fetch fresh data
    try {
      const data = await fetcher()
      
      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl,
      })

      return data
    } catch (error) {
      // Return stale data if available during error
      if (cached) {
        console.warn(`Returning stale data for ${key} due to error:`, error)
        return cached.data
      }
      
      throw error
    }
  }

  static clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern)
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Background job scheduler for cache warming
export class CacheWarmer {
  private static intervals = new Map<string, NodeJS.Timeout>()

  static scheduleWarmup(
    name: string,
    fetcher: () => Promise<void>,
    interval: number
  ): void {
    // Clear existing interval
    this.clearWarmup(name)

    // Schedule new interval
    const intervalId = setInterval(async () => {
      try {
        await fetcher()
      } catch (error) {
        console.error(`Cache warmup failed for ${name}:`, error)
      }
    }, interval)

    this.intervals.set(name, intervalId)
  }

  static clearWarmup(name: string): void {
    const intervalId = this.intervals.get(name)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(name)
    }
  }

  static clearAllWarmups(): void {
    for (const [name] of this.intervals) {
      this.clearWarmup(name)
    }
  }

  static getActiveWarmups(): string[] {
    return Array.from(this.intervals.keys())
  }
}

// Performance monitoring for ISR
export class ISRMonitor {
  private static metrics = new Map<string, {
    hits: number
    misses: number
    errors: number
    avgResponseTime: number
    lastAccess: number
  }>()

  static recordHit(path: string, responseTime: number): void {
    const metric = this.metrics.get(path) || {
      hits: 0,
      misses: 0,
      errors: 0,
      avgResponseTime: 0,
      lastAccess: 0,
    }

    metric.hits++
    metric.avgResponseTime = (metric.avgResponseTime + responseTime) / 2
    metric.lastAccess = Date.now()
    
    this.metrics.set(path, metric)
  }

  static recordMiss(path: string): void {
    const metric = this.metrics.get(path) || {
      hits: 0,
      misses: 0,
      errors: 0,
      avgResponseTime: 0,
      lastAccess: 0,
    }

    metric.misses++
    metric.lastAccess = Date.now()
    
    this.metrics.set(path, metric)
  }

  static recordError(path: string): void {
    const metric = this.metrics.get(path) || {
      hits: 0,
      misses: 0,
      errors: 0,
      avgResponseTime: 0,
      lastAccess: 0,
    }

    metric.errors++
    metric.lastAccess = Date.now()
    
    this.metrics.set(path, metric)
  }

  static getMetrics(path?: string) {
    if (path) {
      return this.metrics.get(path) || null
    }
    
    return Object.fromEntries(this.metrics)
  }

  static getCacheHitRatio(path?: string): number {
    if (path) {
      const metric = this.metrics.get(path)
      if (!metric) return 0
      
      const total = metric.hits + metric.misses
      return total > 0 ? metric.hits / total : 0
    }

    let totalHits = 0
    let totalRequests = 0
    
    for (const metric of this.metrics.values()) {
      totalHits += metric.hits
      totalRequests += metric.hits + metric.misses
    }

    return totalRequests > 0 ? totalHits / totalRequests : 0
  }

  static resetMetrics(path?: string): void {
    if (path) {
      this.metrics.delete(path)
    } else {
      this.metrics.clear()
    }
  }
}

// Smart preloading strategy
export class PreloadManager {
  private static queue = new Set<string>()
  private static processing = false

  static addToQueue(path: string): void {
    this.queue.add(path)
    this.processQueue()
  }

  private static async processQueue(): Promise<void> {
    if (this.processing || this.queue.size === 0) return

    this.processing = true

    try {
      const paths = Array.from(this.queue)
      this.queue.clear()

      // Process paths in batches to avoid overwhelming the server
      const batchSize = 5
      for (let i = 0; i < paths.length; i += batchSize) {
        const batch = paths.slice(i, i + batchSize)
        
        await Promise.allSettled(
          batch.map(path => this.preloadPath(path))
        )

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } finally {
      this.processing = false
      
      // Process any new items that were added during processing
      if (this.queue.size > 0) {
        this.processQueue()
      }
    }
  }

  private static async preloadPath(path: string): Promise<void> {
    try {
      const response = await fetch(path, {
        method: 'HEAD', // Use HEAD to avoid transferring body
        headers: {
          'X-Preload': 'true',
        },
      })

      if (!response.ok) {
        console.warn(`Preload failed for ${path}: ${response.status}`)
      }
    } catch (error) {
      console.error(`Preload error for ${path}:`, error)
    }
  }

  static getQueueSize(): number {
    return this.queue.size
  }

  static clearQueue(): void {
    this.queue.clear()
  }
}

// Utility for creating optimized API routes
export function createOptimizedApiRoute(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>,
  cacheType: CacheType = 'analytics'
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now()
    const path = req.url || 'unknown'

    try {
      const config = CACHE_CONFIGS[cacheType]
      
      // Set cache headers
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${config.revalidate}, stale-while-revalidate=${config.revalidate * 2}`
      )
      
      // Set cache tags for Vercel/CDN
      res.setHeader('Cache-Tag', config.tags.join(','))

      const result = await handler(req, res)
      
      const responseTime = Date.now() - startTime
      ISRMonitor.recordHit(path, responseTime)
      
      return result
    } catch (error) {
      ISRMonitor.recordError(path)
      console.error(`API route error for ${path}:`, error)
      
      res.status(500).json({
        error: 'Internal Server Error',
        timestamp: Date.now(),
      })
    }
  }
}
