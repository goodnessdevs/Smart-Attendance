import { v4 as uuidv4 } from "uuid";
import { getFingerprint, getUUID, saveFingerprint, saveUUID } from "./device-storage";

export interface DeviceInfo {
  device_uuid: string;
  fingerprint: string;
}

/**
 * A stable-ish identifier for this browser, persisted in IndexedDB.
 *
 * Note the fingerprint is a 32-bit hash of low-entropy inputs (user agent,
 * language, screen size, timezone). Collisions across a cohort of students on
 * identical handsets are likely, so it is a weak signal at best.
 */
export function getBrowserFingerprint(): string {
  const { userAgent, language, hardwareConcurrency } = navigator;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const raw = `${userAgent}|${language}|${screenRes}|${hardwareConcurrency}|${timezone}`;

  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(index);
    hash |= 0;
  }

  return hash.toString();
}

export async function getOrCreateUUID(): Promise<string> {
  const existing = await getUUID();
  if (existing) return existing;
  const uuid = uuidv4();
  await saveUUID(uuid);
  return uuid;
}

export async function getOrCreateFingerprint(): Promise<string> {
  const existing = await getFingerprint();
  if (existing) return existing;

  const fingerprint = getBrowserFingerprint();
  await saveFingerprint(fingerprint);
  return fingerprint;
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const [device_uuid, fingerprint] = await Promise.all([
    getOrCreateUUID(),
    getOrCreateFingerprint(),
  ]);

  return { device_uuid, fingerprint };
}
