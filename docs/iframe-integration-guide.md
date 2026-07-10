# 오늘의 마음 — iframe 임베드 & 부모 DB 연동 가이드

타 사이트에서 "오늘의 마음"을 iframe으로 임베드하고, 부모 사이트의 DB에 기록을 저장하는 방법입니다.

---

## 전체 흐름

```
[사용자] → 부모 사이트에 로그인 (카카오/이메일 등)
              ↓
[부모 프론트] → iframe 로드 완료 후 postMessage로 사용자 정보 + 기존 기록 전달
              ↓
[오늘의 마음 앱] → 기록과 로컬 병합 → 화면 표시
              ↓
[사용자] → 기분 체크인 / 문장 담기
              ↓
[오늘의 마음 앱] → postMessage로 저장 요청 (mood-save)
              ↓
[부모 프론트] → 부모 서버 API 호출 → DB 저장 → 응답 (mood-save-ok)
```

---

## 1. 부모 프론트엔드 구현

### iframe 삽입

```html
<iframe
  id="mood-frame"
  src="https://오늘의마음주소"
  style="width: 100%; max-width: 420px; height: 800px; border: none; border-radius: 16px;"
  allow="clipboard-write"
></iframe>
```

### 초기화 — iframe 로드 후 사용자 정보 전달

```javascript
const frame = document.getElementById("mood-frame");
const MOOD_ORIGIN = "https://오늘의마음주소";

frame.addEventListener("load", async () => {
  // 비로그인이면 아무것도 안 보내면 됨 → 앱이 기기 UUID로 로컬 전용 동작
  if (!currentUser) return;

  try {
    // 서버에서 기존 기록 조회
    const res = await fetch("/api/mood-state", { credentials: "include" });
    const { journal, saved } = res.ok ? await res.json() : { journal: {}, saved: [] };

    // iframe에 전달
    frame.contentWindow.postMessage({
      type: "mood-init",
      uid: String(currentUser.id),
      data: { journal, saved }
    }, MOOD_ORIGIN);
  } catch (e) {
    console.warn("mood init failed", e);
  }
});
```

### 저장 요청 수신 — 앱이 보내는 mood-save 처리

```javascript
window.addEventListener("message", async (e) => {
  // origin 검증 필수
  if (e.origin !== MOOD_ORIGIN) return;

  if (e.data?.type === "mood-save") {
    try {
      await fetch("/api/mood-state", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e.data.data)
      });

      frame.contentWindow.postMessage({ type: "mood-save-ok" }, MOOD_ORIGIN);
    } catch (err) {
      frame.contentWindow.postMessage(
        { type: "mood-save-error", message: "저장 실패" },
        MOOD_ORIGIN
      );
    }
  }
});
```

### 전체 코드 (복붙용)

> **중요 — 이중 스크롤/여백 없애기:** iframe에 `height`를 고정하지 말고,
> 앱이 보내주는 `mood-resize` 높이에 맞춰 동적으로 세팅하세요. 그러면 iframe이
> 콘텐츠에 딱 맞아 **iframe 내부 스크롤이 사라지고, 부모 페이지 스크롤 하나만** 남습니다.

```html
<div id="mood-container">
  <iframe
    id="mood-frame"
    src="https://오늘의마음주소"
    style="width: 100%; max-width: 420px; height: 600px; border: none; border-radius: 16px; display: block;"
    scrolling="no"
    allow="clipboard-write"
  ></iframe>
</div>

<script>
  const frame = document.getElementById("mood-frame");
  const MOOD_ORIGIN = "https://오늘의마음주소";

  // 0) 자동 높이: 앱이 콘텐츠 높이를 보내면 iframe을 그 높이로 맞춤 (이중 스크롤 제거)
  window.addEventListener("message", (e) => {
    if (e.origin !== MOOD_ORIGIN) return;
    if (e.data?.type === "mood-resize" && e.data.height) {
      frame.style.height = e.data.height + "px";
    }
  });

  // 1) 초기화: 기존 기록 전달
  frame.addEventListener("load", async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/mood-state", { credentials: "include" });
      const { journal, saved } = res.ok ? await res.json() : { journal: {}, saved: [] };
      frame.contentWindow.postMessage({
        type: "mood-init",
        uid: String(currentUser.id),
        data: { journal, saved }
      }, MOOD_ORIGIN);
    } catch (e) {
      console.warn("mood init failed", e);
    }
  });

  // 2) 저장 요청 수신
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
        frame.contentWindow.postMessage({ type: "mood-save-ok" }, MOOD_ORIGIN);
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

---

## 2. 부모 서버 API 구현

### DB 테이블 (PostgreSQL 예시)

```sql
CREATE TABLE mood_state (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id),
  journal    JSONB NOT NULL DEFAULT '{}'::jsonb,
  saved      JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### GET /api/mood-state (조회)

```javascript
// Node.js / Express
app.get("/api/mood-state", async (req, res) => {
  const userId = req.user.id; // 세션/JWT에서

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

### POST /api/mood-state (저장)

```javascript
app.post("/api/mood-state", async (req, res) => {
  const userId = req.user.id;
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
```

---

## 3. postMessage 프로토콜 정리

### 부모 → 앱

| type | 언제 | 내용 |
| --- | --- | --- |
| `mood-init` | iframe 로드 직후 | `{ uid, data: { journal, saved } }` |

### 앱 → 부모

| type | 언제 | 내용 |
| --- | --- | --- |
| `mood-save` | 체크인/문장담기/삭제 시 | `{ data: { journal, saved } }` |
| `mood-resize` | 콘텐츠 높이가 바뀔 때마다 | `{ height: number }` — iframe 높이를 이 값으로 맞추면 이중 스크롤/여백이 사라짐 |

### 부모 → 앱 (응답)

| type | 언제 | 내용 |
| --- | --- | --- |
| `mood-save-ok` | 저장 성공 | (없음) |
| `mood-save-error` | 저장 실패 | `{ message: "사유" }` |

---

## 4. 데이터 구조 참고

### journal (체크인 기록)

```jsonc
{
  "2026-07-08": [{
    "ts": 1720425600000,       // 타임스탬프
    "moodId": "calm",          // 감정 ID (happy, calm, down, anxious 등)
    "intensity": 3,            // 강도 (1~5)
    "typeLabel": "잔잔히 흘러가는 하루",
    "typeEmoji": "🌊",
    "message": "위로 메시지",
    "quoteText": "명언",
    "quoteAuthor": "저자",
    "personaId": "seoa",
    "personaName": "서아",
    "note": "사용자 메모",          // 선택
    "selfNote": "나에게 한마디",     // 선택
    "qa": [{ "q": "질문", "a": "답변" }]
  }]
}
```

### saved (담은 문장)

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

## 5. 비로그인 / 단독 사용

부모가 `mood-init`을 보내지 않으면 앱은 자동으로:
- 기기 UUID를 uid로 사용
- localStorage에만 기록 저장 (클라우드 동기화 없음)

별도 처리 불필요합니다.

---

## 6. 체크리스트

부모 사이트:
- [ ] `mood_state` 테이블 생성
- [ ] `GET /api/mood-state` 엔드포인트 구현
- [ ] `POST /api/mood-state` 엔드포인트 구현
- [ ] iframe 삽입 + `mood-init` postMessage 전송
- [ ] `mood-save` 메시지 수신 → 서버 저장 → `mood-save-ok` 응답
- [ ] `e.origin` 검증 (보안)

오늘의 마음 앱:
- [x] `resolveUid()` — mood-init 수신 시 부모 DB 모드 전환 (구현 완료)
- [x] `pushToParent()` — 저장 시 부모에게 postMessage 전송 (구현 완료)
- [x] Supabase 의존성 제거 (완료)

---

## 7. 부모 DB에서 활용할 수 있는 것들

부모 DB에 데이터가 쌓이면 자체 서비스에서 활용 가능합니다:

- **마이페이지**: 사용자의 최근 감정 기록 요약
- **관리자 대시보드**: 전체 사용자 감정 통계
- **알림**: 체크인 안 한 사용자에게 리마인드
- **리포트**: 월별/주별 감정 변화 분석
