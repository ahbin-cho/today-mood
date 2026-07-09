# 오늘의 마음 — iframe 임베드 & 로그인 연동 가이드

타 사이트에서 "오늘의 마음"을 iframe으로 임베드할 때, 부모 사이트의 로그인 사용자와 연결하는 방법을 정리한 문서입니다.

---

## 핵심 개념

오늘의 마음 앱은 **uid(고유 식별자)** 하나로 사용자를 구분합니다.

- uid가 같으면 → 같은 사람의 기록
- uid가 다르면 → 다른 사람의 기록

부모 사이트가 해야 할 일은 딱 하나: **"로그인한 사용자의 uid를 iframe에 전달하기"**

---

## 데이터 저장 방식 선택

두 가지 방식을 모두 지원합니다. 부모 사이트 상황에 따라 선택하세요.

| 방식 | 데이터 위치 | 부모 사이트 작업량 | 추천 상황 |
| --- | --- | --- | --- |
| **A. 우리 DB (Supabase)** | 오늘의마음 Supabase | uid만 전달하면 끝 | 부모 사이트가 마음 데이터를 직접 관리할 필요 없을 때 |
| **B. 부모 DB** | 부모 사이트 서버 | 저장/조회 API 구현 + 양방향 postMessage | 부모 사이트가 데이터 소유권을 갖고 싶을 때, 자체 대시보드에서 활용할 때 |

---

# 방식 A. 우리 DB (Supabase) 사용

부모 사이트는 uid만 넘기면 됩니다. 저장/조회는 오늘의마음 앱이 Supabase와 직접 통신합니다.

```
[사용자] → 부모 사이트 로그인
              ↓
[부모 서버] → user_id를 해시
              ↓
[부모 프론트] → postMessage({ type: "mood-auth", uid: 해시값 })
              ↓
[오늘의 마음 앱] → Supabase에 저장/조회
```

## A-1. uid 전달 방법

### postMessage (권장)

```html
<iframe id="mood-frame" src="https://오늘의마음주소"></iframe>

<script>
const frame = document.getElementById("mood-frame");

frame.addEventListener("load", async () => {
  try {
    const res = await fetch("/api/mood-uid", { credentials: "include" });
    if (!res.ok) return; // 비로그인 → 기기 UUID로 폴백

    const { moodUid } = await res.json();
    frame.contentWindow.postMessage(
      { type: "mood-auth", uid: moodUid },
      "https://오늘의마음주소"  // "*" 사용 금지
    );
  } catch (e) {
    console.warn("mood-uid fetch failed", e);
  }
});
</script>
```

### URL 파라미터 (간단하지만 uid 노출됨)

```html
<iframe src="https://오늘의마음주소?uid=해시된토큰"></iframe>
```

## A-2. uid 해시 방법

**절대 하면 안 되는 것:**

```
❌ uid=1
❌ uid=user_100
❌ uid=kim@email.com
```

순차적이거나 추측 가능한 값은 남이 바꿔서 다른 사람 기록을 볼 수 있습니다.

### 카카오 로그인

```javascript
// 부모 사이트 서버 (Node.js)
const crypto = require("crypto");
const SALT = process.env.MOOD_UID_SALT; // 서버 환경변수로 관리

function makeMoodUid(kakaoUserId) {
  return crypto
    .createHash("sha256")
    .update(String(kakaoUserId) + SALT)
    .digest("hex")
    .slice(0, 32);
}
// 결과 예시: "a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5"
```

### 일반 로그인 / 소셜 로그인

동일합니다. DB의 user_id를 해시하세요.

```javascript
function makeMoodUid(userId) {
  return crypto
    .createHash("sha256")
    .update(String(userId) + SALT)
    .digest("hex")
    .slice(0, 32);
}
```

### 서버 API 예시

```javascript
// /api/mood-uid (Express)
app.get("/api/mood-uid", (req, res) => {
  const userId = req.user.id; // 카카오든 이메일이든 통합된 user id
  const moodUid = makeMoodUid(userId);
  res.json({ moodUid });
});
```

| 로그인 방식 | 원본 값 | uid로 넘길 값 |
| --- | --- | --- |
| 카카오 | 카카오 user id (숫자) | `SHA-256(카카오id + 솔트)` 앞 32자 |
| 이메일/비밀번호 | DB user id | `SHA-256(userId + 솔트)` 앞 32자 |
| 소셜 (구글 등) | provider + sub | `SHA-256(provider:sub + 솔트)` 앞 32자 |

> 솔트(SALT)는 서버 환경변수로 관리. 프론트엔드에 절대 노출하지 마세요.

---

# 방식 B. 부모 DB 사용

부모 사이트가 데이터를 직접 소유합니다. 오늘의마음 앱은 Supabase 대신 **postMessage로 부모 사이트에 저장/조회를 요청**합니다.

```
[사용자] → 기분 체크인
              ↓
[오늘의 마음 앱] → postMessage({ type: "mood-save", data: {...} })
              ↓
[부모 프론트] → 부모 서버 API 호출
              ↓
[부모 서버] → 부모 DB에 저장
              ↓
[부모 프론트] → postMessage({ type: "mood-save-ok" })
              ↓
[오늘의 마음 앱] → 완료 확인
```

## B-1. 통신 프로토콜

오늘의마음 앱과 부모 사이트 사이에 주고받는 메시지 규격입니다.

### 부모 → 앱 (초기화)

```javascript
// 부모 프론트엔드: iframe 로드 후 사용자 정보 + 기존 기록 전달
frame.contentWindow.postMessage({
  type: "mood-init",
  uid: "사용자식별자",           // 해시 불필요 (부모 DB라 추측해도 부모 API 권한 필요)
  data: {                        // 기존 기록 (없으면 null)
    journal: { "2026-07-08": [{ moodId: "calm", ... }] },
    saved: [{ id: "...", ... }]
  }
}, "https://오늘의마음주소");
```

### 앱 → 부모 (저장 요청)

사용자가 체크인하거나 문장을 담을 때마다 앱이 보냅니다.

```javascript
// 오늘의마음 앱이 보내는 메시지
{
  type: "mood-save",
  data: {
    uid: "사용자식별자",
    journal: { /* 전체 저널 객체 */ },
    saved: [ /* 담은 문장 배열 */ ]
  }
}
```

### 부모 → 앱 (저장 응답)

```javascript
// 부모 프론트엔드가 서버 저장 후 보내는 응답
{
  type: "mood-save-ok"
}
// 또는 실패 시
{
  type: "mood-save-error",
  message: "저장 실패 사유"
}
```

## B-2. 부모 사이트 구현 예시

### 서버 API

```javascript
// POST /api/mood-state (저장)
app.post("/api/mood-state", async (req, res) => {
  const userId = req.user.id; // 세션/JWT에서
  const { journal, saved } = req.body;

  await db.query(
    `INSERT INTO mood_state (user_id, journal, saved, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id) DO UPDATE
     SET journal = $2, saved = $3, updated_at = NOW()`,
    [userId, JSON.stringify(journal), JSON.stringify(saved)]
  );

  res.json({ ok: true });
});

// GET /api/mood-state (조회)
app.get("/api/mood-state", async (req, res) => {
  const userId = req.user.id;
  const row = await db.query(
    "SELECT journal, saved FROM mood_state WHERE user_id = $1",
    [userId]
  );

  if (row.rows.length === 0) {
    return res.json({ journal: {}, saved: [] });
  }
  res.json(row.rows[0]);
});
```

### DB 테이블 (PostgreSQL 예시)

```sql
CREATE TABLE mood_state (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id),
  journal    JSONB NOT NULL DEFAULT '{}'::jsonb,
  saved      JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 프론트엔드 (부모 사이트)

```html
<iframe id="mood-frame" src="https://오늘의마음주소"></iframe>

<script>
const frame = document.getElementById("mood-frame");
const MOOD_ORIGIN = "https://오늘의마음주소";

// 1) iframe 로드 → 기존 기록 보내기
frame.addEventListener("load", async () => {
  try {
    const res = await fetch("/api/mood-state", { credentials: "include" });
    if (!res.ok) return;

    const { journal, saved } = await res.json();

    frame.contentWindow.postMessage({
      type: "mood-init",
      uid: String(currentUser.id),
      data: { journal, saved }
    }, MOOD_ORIGIN);
  } catch (e) {
    console.warn("mood init failed", e);
  }
});

// 2) 앱의 저장 요청 수신 → 서버에 저장
window.addEventListener("message", async (e) => {
  if (e.origin !== MOOD_ORIGIN) return;

  if (e.data?.type === "mood-save") {
    try {
      await fetch("/api/mood-state", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e.data.data)
      });

      frame.contentWindow.postMessage(
        { type: "mood-save-ok" },
        MOOD_ORIGIN
      );
    } catch (err) {
      frame.contentWindow.postMessage(
        { type: "mood-save-error", message: "저장 실패" },
        MOOD_ORIGIN
      );
    }
  }
});
</script>
```

## B-3. 부모 DB에서 활용할 수 있는 것들

부모 DB에 데이터가 쌓이면 자체 서비스에서 활용 가능합니다:

- **마이페이지**: 사용자의 최근 감정 기록 요약 표시
- **관리자 대시보드**: 전체 사용자 감정 통계 (어떤 감정이 많은지 등)
- **알림**: 3일 이상 체크인 안 한 사용자에게 리마인드
- **리포트**: 월별/주별 감정 변화 분석

### journal 데이터 구조

```jsonc
{
  "2026-07-08": [{
    "ts": 1720425600000,       // 타임스탬프
    "moodId": "calm",          // 감정 ID
    "intensity": 3,            // 강도 (1~5)
    "typeLabel": "잔잔히 흘러가는 하루",  // 마음 유형
    "typeEmoji": "🌊",
    "message": "위로 메시지 내용",
    "quoteText": "명언 내용",
    "quoteAuthor": "저자",
    "personaId": "seoa",       // 상담사 ID
    "personaName": "서아",
    "note": "사용자가 남긴 메모",       // 선택
    "selfNote": "나에게 한마디",        // 선택
    "qa": [{ "q": "질문", "a": "답변" }]  // 체크인 질문/답변
  }]
}
```

### saved 데이터 구조

```jsonc
[{
  "id": "2026-07-08-123456",
  "dateKey": "2026-07-08",
  "emoji": "😌",
  "caption": "잔잔히 흘러가는 하루",
  "message": "위로 메시지",
  "quoteText": "명언",
  "quoteAuthor": "저자",
  "color": "#7FB3E8"
}]
```

---

# 오늘의 마음 앱 쪽 수정 사항

두 방식 모두 지원하려면 `lib/uid.ts`에 아래 함수를 추가하세요:

```typescript
// lib/uid.ts 에 추가

/**
 * uid 결정 + 부모 DB 모드 감지
 *
 * 우선순위:
 * 1. 부모의 mood-init 메시지 (부모 DB 모드)
 * 2. URL 파라미터 ?uid=... (Supabase 모드)
 * 3. 부모의 mood-auth 메시지 (Supabase 모드)
 * 4. 기기 UUID 폴백
 */

type InitResult = {
  uid: string;
  parentDb: boolean;              // true면 부모 DB 모드
  initialData?: {                 // 부모가 보내준 기존 기록
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
```

부모 DB 모드일 때 저장하는 함수:

```typescript
// lib/cloud.ts 에 추가

/** 부모 사이트에 postMessage로 저장 요청 */
export function pushToParent(journal: JournalMap, saved: SavedItem[]): void {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage(
    { type: "mood-save", data: { journal, saved } },
    "*" // 운영 시 부모 origin으로 제한
  );
}
```

`MoodApp.tsx`의 `cloudSync`에서 분기:

```typescript
// parentDb가 true면 pushToParent, 아니면 기존 pushMoodState
const cloudSync = () => {
  if (parentDbMode) {
    pushToParent(loadJournal(), loadSaved());
  } else if (uidRef.current) {
    pushMoodState(uidRef.current, loadJournal(), loadSaved());
  }
};
```

---

# 보안 정리

| 항목 | 방식 A (Supabase) | 방식 B (부모 DB) |
| --- | --- | --- |
| uid 추측 방지 | 해시 필수 (uid = 비밀번호) | 해시 불필요 (부모 API 인증이 보호) |
| 데이터 접근 권한 | anon 키 + RLS + uid | 부모 서버 세션/JWT |
| anon 키 노출 | 안전 (RLS 보호) | 해당 없음 |
| origin 검증 | resolveUid에서 e.origin 체크 | 부모 message listener에서 e.origin 체크 |
| SALT 관리 | 서버 환경변수 (필수) | 불필요 |

---

# 요약 체크리스트

## 방식 A (Supabase) 사용 시

부모 사이트:
- [ ] 서버에 `MOOD_UID_SALT` 환경변수 설정
- [ ] `/api/mood-uid` 엔드포인트 구현 (해시된 uid 반환)
- [ ] 프론트에서 iframe load 후 `mood-auth` postMessage 전송
- [ ] targetOrigin에 정확한 오늘의마음 URL 지정

오늘의 마음 앱:
- [ ] `resolveUid()` 함수 추가
- [ ] `MoodApp.tsx`에서 `getDeviceId()` → `resolveUid()` 교체
- [ ] Supabase `.env.local` 설정

## 방식 B (부모 DB) 사용 시

부모 사이트:
- [ ] `mood_state` 테이블 생성 (user_id, journal, saved)
- [ ] `GET /api/mood-state` (조회) 엔드포인트 구현
- [ ] `POST /api/mood-state` (저장) 엔드포인트 구현
- [ ] 프론트에서 iframe load 후 `mood-init` postMessage 전송 (기존 기록 포함)
- [ ] `mood-save` 메시지 수신 → 서버 저장 → `mood-save-ok` 응답
- [ ] message listener에서 e.origin 검증

오늘의 마음 앱:
- [ ] `resolveUid()` 함수 추가 (mood-init 감지)
- [ ] `pushToParent()` 함수 추가
- [ ] `cloudSync`에서 parentDb 모드 분기
- [ ] Supabase 설정 불필요

---

# 자주 묻는 질문

### Q. 두 방식을 동시에 쓸 수 있나요?

네. 부모가 `mood-init`을 보내면 부모 DB, `mood-auth`를 보내면 Supabase, 아무것도 안 보내면 로컬 전용으로 자동 분기됩니다.

### Q. 솔트를 바꾸면 어떻게 되나요?

방식 A에서만 해당. 기존 uid가 전부 달라져 이전 기록과 연결이 끊깁니다. 솔트는 한 번 정하면 바꾸지 마세요.

### Q. 한 사용자가 카카오 + 이메일 두 가지로 로그인하면?

부모 사이트에서 계정 통합(account linking)을 하고, 통합된 하나의 ID를 넘겨야 합니다.

### Q. Safari에서 iframe localStorage가 안 되면?

클라우드 동기화(Supabase든 부모 DB든)가 켜져 있으면 괜찮습니다. localStorage 없이도 매번 클라우드/부모에서 기록을 가져옵니다.

### Q. 부모 DB 방식에서 데이터 크기가 커지면?

journal과 saved를 JSONB 통째로 저장하는 구조라, 1년치 기록이 쌓여도 수십 KB 수준입니다. 대부분의 경우 문제없습니다.
