// 앱 무관 iframe 자동 높이 규약 — 자식(임베드되는 쪽)에서 사용.
// 콘텐츠 높이를 재서 부모에 { type: "embed:resize", height, app } 를 전송한다.
// 부모는 e.source 로 iframe 을 찾아 높이를 맞추면 됨.
// 규약 전문: docs/embed-resize-protocol.md
//
// 순수 DOM만 사용하므로 React/Vue/바닐라 등 어떤 임베드 앱에도 그대로 복사해 쓸 수 있다.

export type EmbedResizeOptions = {
  /** 위젯 식별자 (디버그/로깅용, 선택) */
  app?: string;
  /**
   * 높이를 잴 요소 또는 CSS 셀렉터 (기본: document.body).
   * body 가 min-height:100vh 등으로 늘어나는 앱은 실제 콘텐츠 래퍼를 지정하세요.
   */
  target?: Element | string;
  /** 부모 origin (기본: "*"). 운영 시 부모 origin 으로 제한 권장 */
  targetOrigin?: string;
};

/**
 * 임베드 자동 높이 시작. iframe 안(부모가 있는 컨텍스트)에서만 동작하며,
 * 최상위 창이면 아무 것도 하지 않는다.
 * @returns 정리(cleanup) 함수 — React 라면 useEffect 에서 그대로 반환하면 됨
 */
export function startEmbedAutoResize(opts: EmbedResizeOptions = {}): () => void {
  const noop = () => {};
  if (typeof window === "undefined" || window.parent === window) return noop;

  const targetOrigin = opts.targetOrigin ?? "*";
  const el: Element | null =
    typeof opts.target === "string"
      ? document.querySelector(opts.target)
      : opts.target ?? document.body;
  if (!el) return noop;

  let last = 0;
  let raf = 0;

  const measure = () => {
    raf = 0;
    const height = Math.ceil(el.getBoundingClientRect().height);
    if (height && Math.abs(height - last) > 1) {
      last = height;
      window.parent.postMessage(
        { type: "embed:resize", height, app: opts.app },
        targetOrigin
      );
    }
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(measure);
  };

  const ro = new ResizeObserver(schedule);
  ro.observe(el);
  window.addEventListener("resize", schedule);
  schedule(); // 초기 1회 전송

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}
