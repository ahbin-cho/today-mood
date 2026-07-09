// 클라우드 동기화 — 부모 DB 모드 (postMessage 방식)
import type { JournalMap, SavedItem } from "./storage";

export type CloudState = { journal: JournalMap; saved: SavedItem[] };

/** 부모 사이트에 postMessage로 저장 요청 (부모 DB 모드) */
export function pushToParent(journal: JournalMap, saved: SavedItem[]): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(
    { type: "mood-save", data: { journal, saved } },
    "*" // 운영 시 부모 origin으로 제한
  );
}
