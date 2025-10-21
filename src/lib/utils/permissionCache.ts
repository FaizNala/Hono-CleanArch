/**
 * Simple in-memory cache for permission checks
 * Only caches for frequently accessed users to avoid memory bloat
 */

interface CacheEntry {
  permissions: Set<string>;
  expiry: number;
  hitCount: number;
}

class PermissionCache {
  private cache = new Map<number, CacheEntry>();
  private readonly TTL = 2 * 60 * 1000; // 2 minutes
  private readonly MIN_HITS = 3; // Only cache after 3 hits
  private readonly MAX_SIZE = 100; // Max 100 users in cache

  get(userId: number, permission: string): boolean | null {
    const entry = this.cache.get(userId);
    if (!entry || Date.now() > entry.expiry) {
      if (entry) this.cache.delete(userId);
      return null;
    }
    
    entry.hitCount++;
    return entry.permissions.has(permission);
  }

  set(userId: number, permissions: string[]) {
    // Only cache if user has enough hits or already cached
    const existing = this.cache.get(userId);
    if (!existing && this.shouldCache(userId)) {
      return;
    }

    // Prevent memory bloat
    if (this.cache.size >= this.MAX_SIZE && !existing) {
      this.evictOldest();
    }

    this.cache.set(userId, {
      permissions: new Set(permissions),
      expiry: Date.now() + this.TTL,
      hitCount: existing?.hitCount || 1
    });
  }

  private shouldCache(userId: number): boolean {
    // Simple heuristic: cache frequently accessed users
    const existing = this.cache.get(userId);
    return existing ? existing.hitCount >= this.MIN_HITS : false;
  }

  private evictOldest() {
    let oldest = Date.now();
    let oldestKey: number | null = null;
    
    for (const [userId, entry] of this.cache.entries()) {
      if (entry.expiry < oldest) {
        oldest = entry.expiry;
        oldestKey = userId;
      }
    }
    
    if (oldestKey !== null) {
      this.cache.delete(oldestKey);
    }
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [userId, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(userId);
      }
    }
  }

  // Get cache stats for monitoring
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([userId, entry]) => ({
        userId,
        hitCount: entry.hitCount,
        permissionCount: entry.permissions.size,
        expiresIn: Math.max(0, entry.expiry - Date.now())
      }))
    };
  }

  // Invalidate cache for specific user (when roles change)
  invalidateUser(userId: number) {
    this.cache.delete(userId);
  }

  // Clear all cache (emergency use)
  clear() {
    this.cache.clear();
  }
}

// Singleton instance
export const permissionCache = new PermissionCache();

// Cleanup every 5 minutes
setInterval(() => {
  permissionCache.cleanup();
}, 5 * 60 * 1000);