# 임베드 iframe 자동 높이 규약 — `embed:resize`

**앱 무관 · 무의존 · 무료.** 자식(임베드되는 웹앱)이 콘텐츠 높이를 부모에 알리고,
부모가 iframe 높이를 콘텐츠에 맞춰서 **iframe 내부 스크롤과 여백을 없앤다.**

- 어떤 프레임워크(React/Vue/바닐라…)든, 어떤 위젯이든 같은 메시지를 쓴다.
- 부모는 **리스너 하나**로 페이지의 **모든** 임베드 iframe을 자동 높이 처리한다.

---

## 1. 메시지 규약

**자식 → 부모** (콘텐츠 높이가 바뀔 때마다):

```jsonc
{ "type": "embed:resize", "height": 1234, "app": "today-mood" }
```

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `type` | ✅ | 항상 `"embed:resize"` |
| `height` | ✅ | 콘텐츠 픽셀 높이 (number) |
| `app` | ⬜ | 위젯 식별자 (디버그/로깅용, 라우팅엔 불필요) |

> 부모는 `app` 값에 의존하지 않는다. 어떤 iframe이 보냈는지는 `event.source`로 판별하므로
> 위젯이 몇 개든, 서로 다른 앱이든 **부모 코드 수정 없이** 동작한다.

---

## 2. 부모 프로젝트에서 하는 일 (한 번만)

페이지 어딘가에 리스너를 **딱 한 번** 등록하면, 그 페이지의 모든 임베드 iframe이 자동 높이가 된다.

```html
<iframe
  id="my-widget"
  src="https://위젯주소"
  style="width:100%; max-width:420px; height:600px; border:none; display:block;"
  scrolling="no"
></iframe>

<script>
  window.addEventListener("message", (e) => {
    // 운영 시 origin 검증 권장:
    // const ALLOWED = ["https://위젯주소"];
    // if (!ALLOWED.includes(e.origin)) return;

    const d = e.data;
    if (!d || d.type !== "embed:resize" || typeof d.height !== "number") return;

    // 메시지를 보낸 iframe을 contentWindow로 매칭 → 그 iframe만 높이 조정
    document.querySelectorAll("iframe").forEach((f) => {
      if (f.contentWindow === e.source) {
        f.style.height = d.height + "px";
      }
    });
  });
</script>
```

**포인트**

- iframe에 `height`를 고정하지 말 것. 초기값만 주고(예: `600px`), 나머지는 스크립트가 채운다.
- `scrolling="no"`는 리스너와 **함께** 쓸 것. 리스너 없이 단독으로 주면 콘텐츠가 잘린다.
- 위젯을 여러 개 심어도 이 스크립트 하나면 전부 커버된다.

---

## 3. 다른 child(위젯) 프로젝트에서 하는 일

자식은 콘텐츠 높이를 재서 `embed:resize`를 부모로 쏘면 된다. 두 가지 방법 중 택1.

### 방법 A — 모듈 복사 (권장)

이 저장소의 [`lib/embed-resize.ts`](../lib/embed-resize.ts) 파일을 그대로 복사해서 사용한다. 순수 DOM이라 의존성이 없다.

```ts
import { startEmbedAutoResize } from "./embed-resize";

// 앱 시작 시 한 번 호출. 반환값은 cleanup 함수.
const stop = startEmbedAutoResize({
  app: "my-widget",
  target: "main", // 실제 콘텐츠를 감싸는 요소. 기본은 document.body
});

// React 라면 그대로:
// useEffect(() => startEmbedAutoResize({ app: "my-widget", target: "main" }), []);
```

### 방법 B — 직접 붙이기 (의존 0, 복붙용)

빌드 도구가 없거나 정적 페이지면 이 스니펫만 넣으면 된다.

```html
<script>
  (function () {
    if (window.parent === window) return; // 최상위 창이면 미동작
    var el = document.querySelector("main") || document.body;
    var last = 0, raf = 0;
    function measure() {
      raf = 0;
      var h = Math.ceil(el.getBoundingClientRect().height);
      if (h && Math.abs(h - last) > 1) {
        last = h;
        window.parent.postMessage(
          { type: "embed:resize", height: h, app: "my-widget" },
          "*" // 운영 시 부모 origin으로 제한
        );
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(measure); }
    new ResizeObserver(schedule).observe(el);
    window.addEventListener("resize", schedule);
    schedule();
  })();
</script>
```

---

## 4. 흔한 함정

- **높이를 `body`가 아니라 실제 콘텐츠 요소에서 재라.** `body`가 `min-height:100vh` 등으로 뷰포트만큼
  늘어나는 앱이면, 부모가 그 높이로 iframe을 키우고 → 다시 그만큼 body가 늘고 … 하는 피드백 루프가 생긴다.
  콘텐츠를 감싸는 요소(`main`, `#app` 등)를 `target`으로 지정하면 안전하다.
- **초기 1회 전송**이 필요하다 (콘텐츠가 처음부터 안 바뀌어도 부모가 높이를 알아야 함). 모듈/스니펫 모두 처리돼 있다.
- **origin 검증**은 운영에서 권장. 부모는 `event.origin` 화이트리스트, 자식은 `targetOrigin`을 부모 주소로 제한.
- 부모가 리스너를 안 붙인 경우엔 자식이 메시지를 보내도 아무 일도 안 일어난다(무해). 단독 실행도 정상.
