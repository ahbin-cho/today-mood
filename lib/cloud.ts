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

/**
 * iframe 콘텐츠 높이를 부모에 알림 → 부모가 iframe 높이를 콘텐츠에 맞추면
 * 임베드 시 여백/이중 스크롤이 사라진다.
 *
 * 부모 사이트에 아래 3줄만 추가하면 됨:
 *   window.addEventListener("message", (e) => {
 *     if (e.data?.type === "mood-resize") frame.style.height = e.data.height + "px";
 *   });
 */
export function postHeightToParent(height: number): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage({ type: "mood-resize", height }, "*");
}
