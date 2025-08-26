// src/utils/fingerprint.js
import { v4 as uuidv4 } from "uuid";
import { saveUUID, getUUID } from "./indexedDB";

export async function getOrCreateUUID() {
  let uuid = await getUUID();
  if (!uuid) {
    uuid = uuidv4();
    await saveUUID(uuid);
  }
  return uuid;
}

export function getBrowserFingerprint() {
  const { userAgent, language, platform, hardwareConcurrency } = navigator;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const rawFingerprint = `${userAgent}|${language}|${platform}|${screenRes}|${hardwareConcurrency}|${timezone}`;

  let hash = 0;
  for (let i = 0; i < rawFingerprint.length; i++) {
    const chr = rawFingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return hash.toString();
}
