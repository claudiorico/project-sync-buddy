/**
 * IndexedDB wrapper for encrypted local storage
 * All financial data is stored locally with zero-knowledge
 */

const DB_NAME = 'investpro_secure';
const DB_VERSION = 1;

export interface DBStores {
  portfolios: string;
  assets: string;
  transactions: string;
  dividends: string;
  settings: string;
  metadata: string;
}

const STORES: (keyof DBStores)[] = [
  'portfolios',
  'assets', 
  'transactions',
  'dividends',
  'settings',
  'metadata',
];

let dbInstance: IDBDatabase | null = null;

/**
 * Opens or creates the IndexedDB database
 */
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores for each data type
      STORES.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };
  });
}

/**
 * Stores encrypted data in IndexedDB
 */
export async function setItem<T extends keyof DBStores>(
  store: T,
  id: string,
  encryptedData: string
): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.put({ id, data: encryptedData, updatedAt: Date.now() });

    request.onerror = () => reject(new Error(`Failed to store ${store}`));
    request.onsuccess = () => resolve();
  });
}

/**
 * Retrieves encrypted data from IndexedDB
 */
export async function getItem<T extends keyof DBStores>(
  store: T,
  id: string
): Promise<string | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readonly');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.get(id);

    request.onerror = () => reject(new Error(`Failed to retrieve ${store}`));
    request.onsuccess = () => {
      resolve(request.result?.data ?? null);
    };
  });
}

/**
 * Gets all items from a store
 */
export async function getAllItems<T extends keyof DBStores>(
  store: T
): Promise<Array<{ id: string; data: string; updatedAt: number }>> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readonly');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.getAll();

    request.onerror = () => reject(new Error(`Failed to retrieve all ${store}`));
    request.onsuccess = () => resolve(request.result ?? []);
  });
}

/**
 * Deletes an item from IndexedDB
 */
export async function deleteItem<T extends keyof DBStores>(
  store: T,
  id: string
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.delete(id);

    request.onerror = () => reject(new Error(`Failed to delete ${store}`));
    request.onsuccess = () => resolve();
  });
}

/**
 * Clears all data from a store
 */
export async function clearStore<T extends keyof DBStores>(store: T): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.clear();

    request.onerror = () => reject(new Error(`Failed to clear ${store}`));
    request.onsuccess = () => resolve();
  });
}

/**
 * Exports all encrypted data for backup
 */
export async function exportAllData(): Promise<Record<string, unknown[]>> {
  const data: Record<string, unknown[]> = {};

  for (const store of STORES) {
    data[store] = await getAllItems(store);
  }

  return data;
}

/**
 * Completely wipes the database
 */
export async function wipeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }

    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onerror = () => reject(new Error('Failed to wipe database'));
    request.onsuccess = () => resolve();
  });
}
