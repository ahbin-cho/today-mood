-- ============================================================
-- 오늘의 마음 체크인 — Supabase 설정 (로그인 없이 기기별 익명 저장)
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- 1) 저장 테이블 (uid별로 저널/담은문장을 통째로 보관)
create table if not exists public.mood_state (
  uid        text primary key,
  journal    jsonb not null default '{}'::jsonb,
  saved      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) RLS 켜기 — 테이블 직접 접근은 막고, 아래 함수(정확한 uid를 알아야만)로만 접근
alter table public.mood_state enable row level security;

-- 3) 읽기 함수: 내 uid의 기록 가져오기
create or replace function public.get_mood_state(p_uid text)
returns table(journal jsonb, saved jsonb)
language sql
security definer
set search_path = public
as $$
  select journal, saved from public.mood_state where uid = p_uid;
$$;

-- 4) 저장 함수: 내 uid의 기록 업서트
create or replace function public.upsert_mood_state(p_uid text, p_journal jsonb, p_saved jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.mood_state(uid, journal, saved, updated_at)
  values (p_uid, coalesce(p_journal, '{}'::jsonb), coalesce(p_saved, '[]'::jsonb), now())
  on conflict (uid) do update
    set journal = excluded.journal,
        saved   = excluded.saved,
        updated_at = now();
$$;

-- 5) 익명(anon) 키로 이 두 함수만 실행 가능하게 권한 부여 (테이블 직접 접근은 불가)
revoke all on function public.get_mood_state(text) from public;
revoke all on function public.upsert_mood_state(text, jsonb, jsonb) from public;
grant execute on function public.get_mood_state(text) to anon, authenticated;
grant execute on function public.upsert_mood_state(text, jsonb, jsonb) to anon, authenticated;
