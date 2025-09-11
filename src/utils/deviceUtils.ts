// src/utils/deviceUtils.ts
import { getOrCreateUUID } from "./browserfingerprint";
import { getOrCreateFingerprint } from "./indexedDB";

export interface DeviceInfo {
  device_uuid: string;
  fingerprint: string;
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const [device_uuid, fingerprint] = await Promise.all([
    getOrCreateUUID(),
    getOrCreateFingerprint(),
  ]);

  return {
    device_uuid,
    fingerprint,
  };
}
