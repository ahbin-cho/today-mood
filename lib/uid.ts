// 기기별 익명 식별자 — 로그인 없이 이 기기에 랜덤 UUID를 하나 발급해 저장
const UID_KEY = "today-mood:uid:v1";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(UID_KEY);
  if (!id) {
    const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
    id =
      g.crypto?.randomUUID?.() ??
      "uid-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(UID_KEY, id);
  }
  return id;
}
