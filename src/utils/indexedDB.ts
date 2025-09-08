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
    const record: DeviceRecord = { key: "device_uuid", value: uuid };

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
    const request = store.get("device_uuid");

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

export async function saveFingerprint(fingerprint: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readwrite");
    const store = tx.objectStore("deviceStore");
    const record: DeviceRecord = { key: "fingerprint", value: fingerprint };

    store.put(record);

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFingerprint(): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readonly");
    const store = tx.objectStore("deviceStore");
    const request = store.get("fingerprint");

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

export async function getOrCreateFingerprint(): Promise<string> {
  const { getBrowserFingerprint } = await import("./browserfingerprint");
  
  let fingerprint = await getFingerprint();
  if (!fingerprint) {
    fingerprint = getBrowserFingerprint();
    await saveFingerprint(fingerprint);
  }
  return fingerprint;
}

export async function clearDeviceData(): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readwrite");
    const store = tx.objectStore("deviceStore");
    
    // Clear all device-related data
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => resolve(true);
    clearRequest.onerror = () => reject(clearRequest.error);
  });
}

// Alternative function to delete specific keys if you prefer selective deletion
export async function deleteDeviceKeys(): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deviceStore", "readwrite");
    const store = tx.objectStore("deviceStore");
    
    // Delete specific keys
    const deleteUUID = store.delete("uuid");
    const deleteFingerprint = store.delete("fingerprint");

    let completedOperations = 0;
    const totalOperations = 2;

    const checkCompletion = () => {
      completedOperations++;
      if (completedOperations === totalOperations) {
        resolve(true);
      }
    };

    deleteUUID.onsuccess = checkCompletion;
    deleteFingerprint.onsuccess = checkCompletion;
    
    deleteUUID.onerror = () => reject(deleteUUID.error);
    deleteFingerprint.onerror = () => reject(deleteFingerprint.error);
  });
}