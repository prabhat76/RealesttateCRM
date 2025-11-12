import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, shareReplay, catchError, tap } from 'rxjs/operators';

export interface CacheConfig {
  maxAge?: number; // milliseconds
  maxSize?: number; // number of items
  strategy?: 'LRU' | 'LFU' | 'FIFO';
}

interface CacheEntry<T> {
  data: Observable<T>;
  timestamp: number;
  accessCount: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultConfig: CacheConfig = {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    strategy: 'LRU'
  };

  constructor() {
    // Clean expired cache every minute
    setInterval(() => this.cleanExpiredEntries(), 60000);
  }

  /**
   * Get cached data or fetch if not available
   */
  get<T>(
    key: string,
    fetchFn: () => Observable<T>,
    config: CacheConfig = {}
  ): Observable<T> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const entry = this.cache.get(key);

    // Check if cache exists and is valid
    if (entry && this.isValid(entry, mergedConfig)) {
      entry.accessCount++;
      return entry.data;
    }

    // Fetch new data and cache it
    const data$ = fetchFn().pipe(
      tap(data => {
        // Calculate approximate size
        const size = this.estimateSize(data);
        
        this.cache.set(key, {
          data: of(data),
          timestamp: Date.now(),
          accessCount: 1,
          size
        });

        // Enforce cache size limit
        this.enforceSizeLimit(mergedConfig);
      }),
      shareReplay(1), // Share the same observable with all subscribers
      catchError(error => {
        this.cache.delete(key);
        return throwError(() => error);
      })
    );

    // Store the observable immediately (before it completes)
    this.cache.set(key, {
      data: data$,
      timestamp: Date.now(),
      accessCount: 1,
      size: 0
    });

    return data$;
  }

  /**
   * Set cache entry directly
   */
  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const size = this.estimateSize(data);
    
    this.cache.set(key, {
      data: of(data),
      timestamp: Date.now(),
      accessCount: 0,
      size
    });

    this.enforceSizeLimit({ ...this.defaultConfig, ...config });
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string, config: CacheConfig = {}): boolean {
    const entry = this.cache.get(key);
    return entry ? this.isValid(entry, { ...this.defaultConfig, ...config }) : false;
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate multiple cache entries by pattern
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    totalMemory: number;
    entries: Array<{ key: string; age: number; accessCount: number }>;
  } {
    const now = Date.now();
    let totalMemory = 0;
    const entries: Array<{ key: string; age: number; accessCount: number }> = [];

    this.cache.forEach((entry, key) => {
      totalMemory += entry.size;
      entries.push({
        key,
        age: now - entry.timestamp,
        accessCount: entry.accessCount
      });
    });

    return {
      size: this.cache.size,
      totalMemory,
      entries
    };
  }

  /**
   * Preload cache with data
   */
  preload<T>(key: string, fetchFn: () => Observable<T>, config: CacheConfig = {}): void {
    this.get(key, fetchFn, config).subscribe({
      next: () => console.log(`Preloaded cache: ${key}`),
      error: (error) => console.error(`Failed to preload cache: ${key}`, error)
    });
  }

  private isValid(entry: CacheEntry<any>, config: CacheConfig): boolean {
    if (!config.maxAge) {
      return true;
    }

    const age = Date.now() - entry.timestamp;
    return age < config.maxAge;
  }

  private enforceSizeLimit(config: CacheConfig): void {
    if (!config.maxSize || this.cache.size <= config.maxSize) {
      return;
    }

    const entriesToRemove = this.cache.size - config.maxSize;
    const entries = Array.from(this.cache.entries());

    // Sort based on strategy
    switch (config.strategy) {
      case 'LRU': // Least Recently Used
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        break;
      case 'LFU': // Least Frequently Used
        entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
        break;
      case 'FIFO': // First In First Out
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        break;
    }

    // Remove entries
    entries.slice(0, entriesToRemove).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (this.defaultConfig.maxAge && age > this.defaultConfig.maxAge) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Approximate bytes (UTF-16)
    } catch {
      return 0;
    }
  }
}
