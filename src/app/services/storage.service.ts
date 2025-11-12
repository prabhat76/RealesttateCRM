import { Injectable } from '@angular/core';

export enum StorageType {
  SESSION = 'session',
  LOCAL = 'local'
}

export interface StorageOptions {
  type?: StorageType;
  ttl?: number; // Time to live in milliseconds
  encrypt?: boolean;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private memoryCache = new Map<string, CacheItem<any>>();

  constructor() {
    // Clean expired cache on initialization
    this.cleanExpiredCache();
  }

  /**
   * Set item in storage with optional TTL
   */
  setItem<T>(key: string, value: T, options: StorageOptions = {}): void {
    const { type = StorageType.LOCAL, ttl, encrypt = false } = options;

    const cacheItem: CacheItem<T> = {
      data: value,
      timestamp: Date.now(),
      ttl
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheItem);

    // Store in browser storage
    const storage = this.getStorage(type);
    const serialized = JSON.stringify(cacheItem);
    const stored = encrypt ? this.simpleEncrypt(serialized) : serialized;
    
    try {
      storage.setItem(key, stored);
    } catch (error) {
      console.error('Storage error:', error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldest(type);
        storage.setItem(key, stored);
      }
    }
  }

  /**
   * Get item from storage
   */
  getItem<T>(key: string, options: StorageOptions = {}): T | null {
    const { type = StorageType.LOCAL, encrypt = false } = options;

    // Check memory cache first
    const cached = this.memoryCache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached.data as T;
    }

    // Check browser storage
    const storage = this.getStorage(type);
    const stored = storage.getItem(key);

    if (!stored) {
      return null;
    }

    try {
      const decrypted = encrypt ? this.simpleDecrypt(stored) : stored;
      const cacheItem: CacheItem<T> = JSON.parse(decrypted);

      // Check if expired
      if (this.isExpired(cacheItem)) {
        this.removeItem(key, options);
        return null;
      }

      // Update memory cache
      this.memoryCache.set(key, cacheItem);

      return cacheItem.data;
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string, options: StorageOptions = {}): void {
    const { type = StorageType.LOCAL } = options;
    
    this.memoryCache.delete(key);
    this.getStorage(type).removeItem(key);
  }

  /**
   * Clear all items from storage
   */
  clear(type: StorageType = StorageType.LOCAL): void {
    this.memoryCache.clear();
    this.getStorage(type).clear();
  }

  /**
   * Check if item exists
   */
  hasItem(key: string, options: StorageOptions = {}): boolean {
    return this.getItem(key, options) !== null;
  }

  /**
   * Get all keys from storage
   */
  getAllKeys(type: StorageType = StorageType.LOCAL): string[] {
    const storage = this.getStorage(type);
    const keys: string[] = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    
    return keys;
  }

  /**
   * Get storage size in bytes
   */
  getSize(type: StorageType = StorageType.LOCAL): number {
    const storage = this.getStorage(type);
    let size = 0;
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        const value = storage.getItem(key) || '';
        size += key.length + value.length;
      }
    }
    
    return size;
  }

  /**
   * Update TTL for existing item
   */
  updateTTL(key: string, ttl: number, options: StorageOptions = {}): void {
    const item = this.getItem(key, options);
    if (item) {
      this.setItem(key, item, { ...options, ttl });
    }
  }

  private getStorage(type: StorageType): Storage {
    return type === StorageType.SESSION ? sessionStorage : localStorage;
  }

  private isExpired(cacheItem: CacheItem<any>): boolean {
    if (!cacheItem.ttl) {
      return false;
    }
    
    const age = Date.now() - cacheItem.timestamp;
    return age > cacheItem.ttl;
  }

  private cleanExpiredCache(): void {
    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (this.isExpired(item)) {
        this.memoryCache.delete(key);
      }
    }

    // Clean browser storage
    [StorageType.LOCAL, StorageType.SESSION].forEach(type => {
      const storage = this.getStorage(type);
      const keysToRemove: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          try {
            const stored = storage.getItem(key);
            if (stored) {
              const cacheItem: CacheItem<any> = JSON.parse(stored);
              if (this.isExpired(cacheItem)) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // Invalid item, remove it
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => storage.removeItem(key));
    });
  }

  private clearOldest(type: StorageType): void {
    const storage = this.getStorage(type);
    const items: Array<{ key: string; timestamp: number }> = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        try {
          const stored = storage.getItem(key);
          if (stored) {
            const cacheItem: CacheItem<any> = JSON.parse(stored);
            items.push({ key, timestamp: cacheItem.timestamp });
          }
        } catch (error) {
          // Invalid item
        }
      }
    }

    // Sort by timestamp and remove oldest 10%
    items.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = Math.ceil(items.length * 0.1);
    items.slice(0, toRemove).forEach(item => storage.removeItem(item.key));
  }

  private simpleEncrypt(data: string): string {
    // Simple XOR encryption (use proper encryption in production)
    return btoa(data.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) ^ 123)
    ).join(''));
  }

  private simpleDecrypt(data: string): string {
    return atob(data).split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) ^ 123)
    ).join('');
  }
}
