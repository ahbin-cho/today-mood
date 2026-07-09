// localStorage 기반 기록 유틸 (API/서버 없이 로컬에만 저장)
// - journal: 날짜별 체크인 기록 (마음 날씨 캘린더 + 다시보기)
// - saved: 마음에 담은 문장들
import { dateKey as kstDateKey } from "./time";

const JOURNAL_KEY = "today-mood:journal:v1";
const SAVED_KEY = "today-mood:saved:v1";

// sandbox iframe 등에서 localStorage 접근이 막힐 수 있으므로 안전하게 감싼다
function lsGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* 무시 */ }
}

export type QA = { q: string; a: string };

// 날짜별 체크인 기록
export type Entry = {
  ts?: number; // 기록 시각(epoch ms) — 같은 날 여러 기록의 순서·시간 표시용
  moodId: string;
  intensity?: number; // 1~5 (선택 강도)
  qa?: QA[]; // 기분별 맞춤 질문에 답한 내용
  note?: string; // 한 줄 메모
  typeLabel?: string; // 오늘의 마음 상태 유형
  typeEmoji?: string;
  message?: string; // 그날 건넨 위로 한마디
  quoteText?: string;
  quoteAuthor?: string;
  personaId?: string; // 편지를 써준 페르소나
  personaName?: string;
  selfNote?: string; // 오늘의 나에게 한마디
  analysisRead?: string; // 상담 소견 (답변 기반)
  analysisSuggestion?: string; // 오늘의 제안
  analysisCaution?: string; // 주의 신호(있을 때만)
};

// 하루에 여러 번 체크인해도 모두 보관 → 날짜별 기록 배열
export type JournalMap = Record<string, Entry[]>;

export type SavedItem = {
  id: string;
  dateKey: string;
  emoji: string;
  caption: string;
  message: string;
  quoteText: string;
  quoteAuthor: string;
  color: string;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** YYYY-MM-DD (한국 시간 기준) */
export function dateKey(d: Date): string {
  return kstDateKey(d);
}

/**
 * 어떤 포맷이든(구버전 문자열 / 단일 Entry 객체 / Entry 배열) 배열 형태로 정규화.
 * 로컬·클라우드 어디서 온 데이터든 이걸 통과시키면 항상 Record<날짜, Entry[]>가 됨.
 */
export function normalizeJournal(raw: Record<string, unknown>): JournalMap {
  const out: JournalMap = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v)) {
      const arr = v.filter(
        (e): e is Entry => !!e && typeof e === "object" && "moodId" in e
      );
      if (arr.length) out[k] = arr;
    } else if (typeof v === "string") {
      out[k] = [{ moodId: v }]; // v0: 문자열 moodId
    } else if (v && typeof v === "object" && "moodId" in v) {
      out[k] = [v as Entry]; // v1: 단일 Entry 객체
    }
  }
  return out;
}

/** 예전 버전(문자열/단일 객체)도 Entry[]로 변환해 읽어들임 */
export function loadJournal(): JournalMap {
  if (typeof window === "undefined") return {};
  const raw = safeParse<Record<string, unknown>>(
    lsGet(JOURNAL_KEY),
    {}
  );
  return normalizeJournal(raw);
}

/** 두 저널을 병합 — 같은 날 기록은 합치고 중복만 제거(한쪽이 덮어쓰지 않음) */
export function mergeJournals(a: JournalMap, b: JournalMap): JournalMap {
  const out: JournalMap = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const sig = (e: Entry) =>
    `${e.ts ?? ""}|${e.moodId}|${e.intensity ?? ""}|${e.note ?? ""}|${e.message ?? ""}|${e.selfNote ?? ""}`;
  for (const k of keys) {
    const merged: Entry[] = [];
    const seen = new Set<string>();
    for (const e of [...(a[k] || []), ...(b[k] || [])]) {
      const s = sig(e);
      if (seen.has(s)) continue;
      seen.add(s);
      merged.push(e);
    }
    merged.sort((x, y) => (x.ts ?? 0) - (y.ts ?? 0));
    if (merged.length) out[k] = merged;
  }
  return out;
}

/** 전체 저널을 통째로 저장 (클라우드 복원용) */
export function saveJournalAll(journal: JournalMap): void {
  if (typeof window !== "undefined") {
    lsSet(JOURNAL_KEY, JSON.stringify(journal));
  }
}

/** 전체 담은문장을 통째로 저장 (클라우드 복원용) */
export function saveSavedAll(items: SavedItem[]): void {
  if (typeof window !== "undefined") {
    lsSet(SAVED_KEY, JSON.stringify(items));
  }
}

/** 그날 기록 배열에 append (덮어쓰지 않고 계속 쌓임) */
export function recordEntry(key: string, entry: Entry): JournalMap {
  const current = loadJournal();
  const next = { ...current, [key]: [...(current[key] || []), entry] };
  if (typeof window !== "undefined") {
    lsSet(JOURNAL_KEY, JSON.stringify(next));
  }
  return next;
}

export function loadSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<SavedItem[]>(lsGet(SAVED_KEY), []);
}

export function addSaved(item: SavedItem): SavedItem[] {
  const current = loadSaved();
  if (
    current.some((s) => s.message === item.message && s.quoteText === item.quoteText)
  ) {
    return current;
  }
  const next = [item, ...current];
  if (typeof window !== "undefined") {
    lsSet(SAVED_KEY, JSON.stringify(next));
  }
  return next;
}

export function removeSaved(id: string): SavedItem[] {
  const next = loadSaved().filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    lsSet(SAVED_KEY, JSON.stringify(next));
  }
  return next;
}

/** 연속 기록(스트릭): 오늘(또는 어제)부터 거슬러 며칠 연속 기록했는지 */
export function calcStreak(journal: JournalMap, today: Date): number {
  let streak = 0;
  const cursor = new Date(today);
  const has = (d: Date) => (journal[dateKey(d)]?.length ?? 0) > 0;
  if (!has(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!has(cursor)) return 0;
  }
  while (has(cursor)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
