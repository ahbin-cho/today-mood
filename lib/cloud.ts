// 클라우드 동기화 (Supabase RPC). 미설정이면 전부 no-op → 로컬만 사용.
import { supabase } from "./supabase";
import type { JournalMap, SavedItem } from "./storage";

export type CloudState = { journal: JournalMap; saved: SavedItem[] };

/** uid의 저장 상태를 클라우드에서 가져오기 (없으면 null) */
export async function pullMoodState(uid: string): Promise<CloudState | null> {
  if (!supabase || !uid) return null;
  try {
    const { data, error } = await supabase.rpc("get_mood_state", { p_uid: uid });
    if (error || !data) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    return {
      journal: (row.journal as JournalMap) || {},
      saved: (row.saved as SavedItem[]) || [],
    };
  } catch {
    return null;
  }
}

/** uid의 저장 상태를 클라우드에 저장 (fire-and-forget) */
export async function pushMoodState(
  uid: string,
  journal: JournalMap,
  saved: SavedItem[]
): Promise<void> {
  if (!supabase || !uid) return;
  try {
    await supabase.rpc("upsert_mood_state", {
      p_uid: uid,
      p_journal: journal,
      p_saved: saved,
    });
  } catch {
    /* 오프라인/미설정: 로컬 저장은 이미 됐으니 조용히 무시 */
  }
}
