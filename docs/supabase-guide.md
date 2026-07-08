# 오늘의 마음 — DB 연결 & iframe 임베드 가이드

지금 앱은 **로그인 없이** 잘 돌아가요. 기기마다 랜덤 UUID를 하나 발급해서(`lib/uid.ts`) 그걸 열쇠 삼아 기록을 저장합니다. 아래는 (1) 이 기록을 클라우드(Supabase)에 백업하는 법과 (2) 다른 사이트에 iframe으로 넣을 때 어떻게 처리하면 좋은지 정리한 거예요.

---

## 1부. Supabase DB 만들기 (무료)

이미 코드는 **DB가 있으면 자동으로 동기화, 없으면 지금처럼 로컬만** 쓰도록 되어 있어요. 그래서 아래 6단계만 하면 켜집니다. 안 해도 앱은 그대로 작동하고요.

### 1) 프로젝트 만들기

[supabase.com](https://supabase.com) 로그인 → New project → 이름·비밀번호 아무거나 → Region은 `Northeast Asia (Seoul)` 추천 → Create.

### 2) 표(테이블)와 함수 만들기

왼쪽 메뉴 **SQL Editor** → New query → 프로젝트 안에 있는 `supabase-setup.sql` 내용을 통째로 붙여넣고 **Run**.

이 스크립트가 하는 일:

- `mood_state` 테이블 생성 (uid별로 저널·담은문장 저장)
- **RLS(행 보안) 켜기** → 테이블 직접 접근은 막음
- `get_mood_state` / `upsert_mood_state` 두 함수만 열어줌 → **정확한 uid를 아는 사람만** 자기 기록에 접근 가능

### 3) 열쇠 두 개 복사

왼쪽 **Project Settings → API** 에서:

- `Project URL`
- `anon` `public` 키 ← **이건 공개돼도 되는 키예요.** (절대 `service_role` 키는 쓰지 마세요)

### 4) 환경변수 넣기

프로젝트의 `.env.local.example` 파일을 복사해 `.env.local` 로 이름 바꾸고 값 채우기:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 5) 패키지 설치 & 재시작

```bash
npm install
npm run dev
```

### 6) 확인

기분 하나 체크인 → Supabase 대시보드 **Table Editor → mood_state** 에 줄(row)이 생기면 성공. 다른 기기/브라우저에서 같은 uid면 기록이 따라와요.

> **동작 원리:** 앱이 켜질 때 `getDeviceId()`로 uid를 정하고, `pullMoodState(uid)`로 클라우드 기록을 받아 로컬과 **병합**한 뒤, 이후 저장할 때마다 `pushMoodState`로 조용히 백업합니다. 오프라인이거나 DB 미설정이면 전부 무시하고 로컬만 써요.

---

## 2부. 다른 사이트에 iframe으로 넣을 때

핵심 질문은 하나예요: **"이 사람이 누구인지(uid)를 무엇으로 정할 것인가."**

지금은 iframe 안에서 발급한 기기 UUID를 써요. 부모 사이트에 로그인이 있다면 그 사용자와 연결할 수도 있고요. 세 가지 선택지가 있습니다.

### 상황 A — 그냥 그대로 임베드 (로그인 연동 없이)

부모 사이트에 이렇게만 넣으면 지금 로직 그대로 돌아가요:

```html
<iframe
  src="https://내앱주소"
  style="width:420px;height:800px;border:0"
  allow="clipboard-write"
></iframe>
```

- 별도 작업 없이 작동. 기록은 iframe 안 localStorage에 쌓임.
- **주의점 두 가지:**
  1. **사이트마다 따로 쌓여요.** iframe 안 저장소는 "부모 도메인 + 내 앱" 조합으로 격리되기 때문에, A사이트에 심은 것과 B사이트에 심은 건 서로 다른 uid가 됩니다. (같은 사람이라도)
  2. **Safari/브라우저 정책.** 서드파티(iframe) localStorage를 막는 브라우저가 있어요. 이 경우 새로고침하면 기록이 날아갈 수 있습니다. → 이럴 땐 상황 B가 안전해요.

즉, **"가볍게 체험용/부모 로그인 필요 없음"** 이면 상황 A로 충분합니다.

### 상황 B — 부모 사이트의 로그인 사용자와 연결 (권장)

부모 사이트가 "이 사람은 user123" 이라고 알려주고, 그 값을 uid로 쓰면 → **기기·브라우저가 바뀌어도, 어느 사이트에 심겨 있어도 같은 사람의 기록**이 됩니다.

넘기는 방법 두 가지:

**방법 1. URL 파라미터 (가장 간단)**

```html
<iframe src="https://내앱주소?uid=USER_TOKEN"></iframe>
```

**방법 2. postMessage 핸드셰이크 (더 안전, 권장)**

부모 페이지에서:

```html
<iframe id="mood" src="https://내앱주소"></iframe>
<script>
  const frame = document.getElementById("mood");
  frame.addEventListener("load", () => {
    frame.contentWindow.postMessage(
      { type: "mood-auth", uid: "로그인사용자_토큰" },
      "https://내앱주소" // 반드시 정확한 origin 지정
    );
  });
</script>
```

**앱 쪽 코드** — `lib/uid.ts` 에 uid 결정 로직을 하나 추가하고, `MoodApp.tsx`의 `getDeviceId()` 호출을 이걸로 바꾸면 됩니다:

```ts
// lib/uid.ts 에 추가
export function resolveUid(timeoutMs = 400): Promise<string> {
  if (typeof window === "undefined") return Promise.resolve("");

  // 1) URL 파라미터 우선 (?uid=...)
  const fromUrl = new URLSearchParams(window.location.search).get("uid");
  if (fromUrl) return Promise.resolve("ext:" + fromUrl);

  // 2) 부모 사이트의 postMessage 잠깐 대기
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: string) => {
      if (!done) {
        done = true;
        resolve(v);
      }
    };
    const onMsg = (e: MessageEvent) => {
      // 운영 시 e.origin 을 부모 도메인으로 꼭 체크하세요
      if (e.data && e.data.type === "mood-auth" && e.data.uid) {
        window.removeEventListener("message", onMsg);
        finish("ext:" + e.data.uid);
      }
    };
    window.addEventListener("message", onMsg);
    // 3) 아무 신호 없으면 기존 기기 UUID로 폴백 (= 지금 동작)
    setTimeout(() => {
      window.removeEventListener("message", onMsg);
      finish(getDeviceId());
    }, timeoutMs);
  });
}
```

그리고 `MoodApp.tsx`의 마운트 부분에서:

```ts
// 변경 전
const uid = getDeviceId();
// 변경 후
const uid = await resolveUid();
```

이렇게 하면 **부모가 로그인 정보를 주면 그 사용자로, 안 주면 지금처럼 기기 UUID로** 자동 분기됩니다.

---

## 보안 — 꼭 알아둘 점

- **anon 키는 공개돼도 안전합니다.** RLS + 함수 방식이라, 키만으로는 남의 기록을 훑을 수 없어요. 오직 "정확한 uid를 알아야만" 그 한 줄에 접근됩니다.
- **그래서 uid가 곧 비밀번호예요.** 부모 사이트의 `1`, `2`, `user_100` 같은 **순차/추측 가능한 값을 그대로 넘기면 위험**합니다 (남의 uid를 찍어서 열람 가능). 두 가지 중 하나로 막으세요:
  - 부모에서 `user_id`를 그대로 주지 말고 **해시(예: SHA-256(user_id + 비밀 솔트))** 해서 넘기기 → 추측 불가.
  - 또는 부모가 **서명된 토큰(JWT 등)** 을 주고, 검증은 Supabase Edge Function에서 하기 (제대로 하려면 이 방식).
- 마음 기록은 민감도가 아주 높진 않으니, 실무적으로는 **"추측 불가능한 uid(=해시/uuid)"** 만 지켜도 충분한 경우가 많아요. 다만 **의료·개인정보 수준으로 다룰 거면 서명 토큰 방식**으로 가는 걸 권합니다.

---

## 3부. 요약 체크리스트

| 상황 | uid 무엇으로? | 해야 할 일 |
| --- | --- | --- |
| 지금(단독 페이지) | 기기 UUID | 이미 됨. DB 켜려면 1부만. |
| iframe, 로그인 연동 X | iframe 기기 UUID | 그냥 임베드. Safari 저장 이슈만 유의. |
| iframe, 부모 로그인 연동 | 부모가 준 토큰(해시/서명) | `resolveUid()` 추가 + 부모에서 postMessage/URL로 전달 |

**공통 준비물:** Supabase 프로젝트 1개 + `.env.local` 채우기 + `npm install`.
