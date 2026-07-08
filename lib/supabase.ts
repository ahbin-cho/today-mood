// Supabase 클라이언트 — 환경변수가 있을 때만 생성됩니다.
// 없으면 null → 앱은 지금처럼 localStorage로만 동작해요 (클라우드 백업 off).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

export const cloudEnabled = !!supabase;
