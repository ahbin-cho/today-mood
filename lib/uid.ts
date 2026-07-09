// 기기별 익명 식별자 — 로그인 없이 이 기기에 랜덤 UUID를 하나 발급해 저장
import type { JournalMap, SavedItem } from "./storage";

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

/**
 * uid 결정 + 부모 DB 모드 감지
 *
 * 우선순위:
 * 1. 부모의 mood-init 메시지 (부모 DB 모드)
 * 2. URL 파라미터 ?uid=... (Supabase 모드)
 * 3. 부모의 mood-auth 메시지 (Supabase 모드)
 * 4. 기기 UUID 폴백
 */
export type InitResult = {
  uid: string;
  parentDb: boolean;
  initialData?: {
    journal: JournalMap;
    saved: SavedItem[];
  };
};

export function resolveUid(timeoutMs = 500): Promise<InitResult> {
  if (typeof window === "undefined")
    return Promise.resolve({ uid: "", parentDb: false });

  // 1) URL 파라미터
  const fromUrl = new URLSearchParams(window.location.search).get("uid");
  if (fromUrl)
    return Promise.resolve({ uid: "ext:" + fromUrl, parentDb: false });

  // 2) postMessage 대기
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: InitResult) => {
      if (!done) { done = true; resolve(v); }
    };

    const onMsg = (e: MessageEvent) => {
      // mood-init: 부모 DB 모드
      if (e.data?.type === "mood-init" && e.data.uid) {
        window.removeEventListener("message", onMsg);
        finish({
          uid: "ext:" + e.data.uid,
          parentDb: true,
          initialData: e.data.data || undefined,
        });
      }
      // mood-auth: Supabase 모드
      if (e.data?.type === "mood-auth" && e.data.uid) {
        window.removeEventListener("message", onMsg);
        finish({ uid: "ext:" + e.data.uid, parentDb: false });
      }
    };
    window.addEventListener("message", onMsg);

    // 3) 타임아웃 → 기기 UUID 폴백
    setTimeout(() => {
      window.removeEventListener("message", onMsg);
      finish({ uid: getDeviceId(), parentDb: false });
    }, timeoutMs);
  });
}
