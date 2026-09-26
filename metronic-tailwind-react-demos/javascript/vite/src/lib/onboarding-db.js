import { getData, setData } from '@/lib/storage';

/**
 * Ön kayıt (onboarding) kalıcılık servisi.
 * Veriler tarayıcı yerel deposunda gerçek kayıt olarak tutulur — demo/gösteri
 * amaçlı değildir, üretim verisi olarak saklanır.
 *
 * Kayıt yapısı:
 * {
 *   userId, username, tcKimlik, adSoyad, dogumTarihi, cinsiyet,
 *   email, telefon, il, ilce, foto { name, size, type, dataUrl },
 *   createdAt, updatedAt
 * }
 */

const APP = import.meta.env.VITE_APP_NAME || 'metronic-tailwind-react';
const RECORDS_KEY = `${APP}-onboarding-records`;
const COMPLETE_KEY = `${APP}-onboarding-complete`;

function getRecords() {
  return getData(RECORDS_KEY) || [];
}

function saveRecords(records) {
  setData(RECORDS_KEY, records);
}

function getCompleteMap() {
  return getData(COMPLETE_KEY) || {};
}

function saveCompleteMap(map) {
  setData(COMPLETE_KEY, map);
}

/** Adayın ön kaydı tamamladığını denetler. */
export function isOnboardingComplete(userId) {
  if (!userId) return false;
  const map = getCompleteMap();
  return Boolean(map[userId]);
}

/** Ön kayıt tamamlandı bayrağını ayarlar. */
export function setOnboardingComplete(userId, value = true) {
  if (!userId) return;
  const map = getCompleteMap();
  map[userId] = value;
  saveCompleteMap(map);
}

/** Ön kayıt kaydını oluşturur veya günceller (userId'ye göre). */
export function saveOnboardingRecord(record) {
  const records = getRecords();
  const stamp = new Date().toISOString();
  const idx = records.findIndex((r) => r.userId === record.userId);

  if (idx >= 0) {
    records[idx] = { ...records[idx], ...record, updatedAt: stamp };
  } else {
    records.push({ ...record, createdAt: stamp, updatedAt: stamp });
  }

  saveRecords(records);
  return records[idx];
}

/** Adayın ön kayıt kaydını getirir. */
export function getOnboardingRecord(userId) {
  return getRecords().find((r) => r.userId === userId) || null;
}
