// src/utils/indexedDB.ts

export interface DeviceRecord {
  key: string;
  value: string;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open("DeviceDB", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("deviceStore")) {
        db.createObjectStore("deviceStore", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveUUID(uuid: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readwrite");
    const store = tx.objectStore("deviceStore");
    const record: DeviceRecord = { key: "uuid", value: uuid };

    store.put(record);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUUID(): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readonly");
    const store = tx.objectStore("deviceStore");
    const request = store.get("uuid");

    request.onsuccess = () => {
      const result = request.result as DeviceRecord | undefined;
      if (result) {
        resolve(result.value);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

export async function clearDeviceDB(): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readwrite");
    const store = tx.objectStore("deviceStore");
    const clearReq = store.clear();

    clearReq.onsuccess = () => resolve(true);
    clearReq.onerror = () => reject(clearReq.error);
  });
}