import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Minimal IndexedDB KV cache for large apiData
 * DB: 'sbn_catch_cache'
 * Store: 'kv'
 */
@Injectable({ providedIn: 'root' })
export class IndexedDbCacheService {
  private readonly DB_NAME = 'sbn_catch_cache';
  private readonly STORE_NAME = 'kv';
  private readonly isBrowser: boolean;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private openDB(): Promise<IDBDatabase> {
    if (!this.isBrowser) return Promise.reject(new Error('Not a browser environment'));
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async get<T = any>(key: string): Promise<T | undefined> {
    if (!this.isBrowser) return undefined;
    try {
      const db = await this.openDB();
      return await new Promise<T | undefined>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result as T | undefined);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IndexedDbCacheService.get error:', e);
      return undefined;
    }
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IndexedDbCacheService.set error:', e);
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IndexedDbCacheService.remove error:', e);
    }
  }

  async clearAll(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const db = await this.openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('IndexedDbCacheService.clearAll error:', e);
    }
  }
}
