// localStorage 기반 기록 유틸 (API/서버 없이 로컬에만 저장)
// - journal: 날짜별 체크인 기록 (마음 날씨 캘린더 + 다시보기)
// - saved: 마음에 담은 문장들

const JOURNAL_KEY = "today-mood:journal:v1";
const SAVED_KEY = "today-mood:saved:v1";

export type QA = { q: string; a: string };

// 날짜별 체크인 기록
export type Entry = {
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

export type JournalMap = Record<string, Entry>;

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

/** YYYY-MM-DD (로컬 기준) */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 예전 버전(문자열 moodId)도 Entry로 변환해 읽어들임 */
export function loadJournal(): JournalMap {
  if (typeof window === "undefined") return {};
  const raw = safeParse<Record<string, unknown>>(
    window.localStorage.getItem(JOURNAL_KEY),
    {}
  );
  const out: JournalMap = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") {
      out[k] = { moodId: v }; // 구버전 마이그레이션
    } else if (v && typeof v === "object" && "moodId" in v) {
      out[k] = v as Entry;
    }
  }
  return out;
}

/** 전체 저널을 통째로 저장 (클라우드 복원용) */
export function saveJournalAll(journal: JournalMap): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  }
}

/** 전체 담은문장을 통째로 저장 (클라우드 복원용) */
export function saveSavedAll(items: SavedItem[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  }
}

export function recordEntry(key: string, entry: Entry): JournalMap {
  const next = { ...loadJournal(), [key]: entry };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
  }
  return next;
}

export function loadSaved(): SavedItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<SavedItem[]>(window.localStorage.getItem(SAVED_KEY), []);
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
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }
  return next;
}

export function removeSaved(id: string): SavedItem[] {
  const next = loadSaved().filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }
  return next;
}

/** 연속 기록(스트릭): 오늘(또는 어제)부터 거슬러 며칠 연속 기록했는지 */
export function calcStreak(journal: JournalMap, today: Date): number {
  let streak = 0;
  const cursor = new Date(today);
  if (!journal[dateKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
    if (!journal[dateKey(cursor)]) return 0;
  }
  while (journal[dateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
