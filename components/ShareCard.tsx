"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";

export type ShareCardData = {
  imageSrc?: string;
  emoji: string;
  caption: string;
  message: string;
  quoteText: string;
  quoteAuthor: string;
  dateText: string;
  bg: [string, string];
  color: string;
};

function loadImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// 프레임을 꽉 채우되(cover) 세로 정렬 위치를 고를 수 있게 (anchorY: 0=위, 0.5=가운데)
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  anchorY = 0.5
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) * anchorY;
  ctx.drawImage(img, dx, dy, dw, dh);
}

// 캔버스에 세로형 카드 이미지를 그려 반환
async function drawCard(data: ShareCardData): Promise<HTMLCanvasElement | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const illustration = await loadImage(data.imageSrc);

  // 바탕(이미지 실패 시 대비)
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, data.bg[0]);
  grad.addColorStop(1, data.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 카드 전체를 둥근 사각형으로 클립 (프리뷰와 동일한 풀블리드 구성)
  const radius = 40;
  ctx.save();
  roundRect(ctx, 0, 0, W, H, radius);
  ctx.clip();

  // 일러스트를 카드 전체에 깔고 '위쪽'을 기준으로 정렬 → 주인공(상단 40%)이 보이게
  if (illustration) {
    drawCoverImage(ctx, illustration, 0, 0, W, H, 0.04);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(0, 0, W, H);
  }

  // 아래로 갈수록 크림색으로 스며드는 페이드 (프리뷰 ::after 와 동일 톤)
  const fade = ctx.createLinearGradient(0, 0, 0, H);
  fade.addColorStop(0.0, "rgba(249,243,236,0.06)");
  fade.addColorStop(0.42, "rgba(249,243,236,0.5)");
  fade.addColorStop(0.62, "rgba(249,243,236,0.9)");
  fade.addColorStop(1.0, "rgba(249,243,236,0.98)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // 아래쪽 빈 공간 위에 얹는 반투명 시트 (프리뷰의 .share-card-sheet)
  const sheetX = 64;
  const sheetTop = 656;
  const sheetBottom = H - 64;
  const sheetW = W - sheetX * 2;
  const sheetH = sheetBottom - sheetTop;

  ctx.save();
  roundRect(ctx, sheetX, sheetTop, sheetW, sheetH, 34);
  ctx.fillStyle = "rgba(251,248,242,0.92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(183, 163, 138, 0.42)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const centerX = W / 2;
  const contentW = sheetW - 128;

  // 라벨
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(155,136,117,0.95)";
  ctx.font = "700 24px sans-serif";
  ctx.fillText("오 늘 의   마 음   기 록", centerX, sheetTop + 62);

  // 이모지
  ctx.font = "54px sans-serif";
  ctx.fillText(data.emoji, centerX, sheetTop + 140);

  // 캡션(오늘의 상태)
  ctx.fillStyle = "rgba(51,44,38,0.94)";
  ctx.font = "700 42px sans-serif";
  let y = sheetTop + 212;
  y = drawWrapped(ctx, data.caption, centerX, y, contentW, 58);

  // 구분선
  y += 20;
  ctx.strokeStyle = "rgba(184, 163, 136, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sheetX + 90, y);
  ctx.lineTo(sheetX + sheetW - 90, y);
  ctx.stroke();
  y += 56;

  // 위로 한마디(메시지)
  ctx.fillStyle = "rgba(46,41,38,0.92)";
  ctx.font = "400 32px serif";
  drawWrapped(ctx, data.message, centerX, y, contentW, 48);

  // 인용 박스 — 시트 하단에 고정
  const quoteH = 150;
  const quoteX = sheetX + 58;
  const quoteW = sheetW - 116;
  const quoteY = sheetBottom - quoteH - 78;
  ctx.save();
  roundRect(ctx, quoteX, quoteY, quoteW, quoteH, 24);
  ctx.fillStyle = "rgba(255,255,255,0.66)";
  ctx.fill();
  ctx.strokeStyle = "rgba(183, 163, 138, 0.46)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "rgba(69,61,52,0.86)";
  ctx.font = "italic 500 29px serif";
  const qEnd = drawWrapped(
    ctx,
    "“" + data.quoteText + "”",
    centerX,
    quoteY + 54,
    quoteW - 76,
    40
  );
  ctx.fillStyle = "rgba(110,97,83,0.9)";
  ctx.font = "700 22px sans-serif";
  ctx.fillText(
    "— " + data.quoteAuthor,
    centerX,
    Math.min(qEnd + 6, quoteY + quoteH - 22)
  );

  // 날짜 — 맨 아래
  ctx.fillStyle = "rgba(87,74,61,0.92)";
  ctx.font = "700 26px sans-serif";
  ctx.fillText(data.dateText, centerX, sheetBottom - 34);

  return canvas;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 가운데 정렬 줄바꿈. 마지막 줄의 y좌표를 반환
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = Array.from(text);
  const lines: string[] = [];
  let line = "";
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  // 마지막 줄이 문장부호만 남으면 앞 줄에 붙여 홀로 떨어지는 걸 방지
  if (lines.length > 1) {
    const last = lines[lines.length - 1].trim();
    if (/^[.,!?…·"'”’)\]}]+$/.test(last)) {
      lines[lines.length - 2] += lines[lines.length - 1];
      lines.pop();
    }
  }
  let y = startY;
  for (const l of lines) {
    ctx.fillText(l, cx, y);
    y += lineHeight;
  }
  return y; // 다음 블록 시작 y
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ShareCard({ data }: { data: ShareCardData }) {
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setBusy(true);
    const filename = `오늘의기분_${data.dateText.replace(/[^0-9]/g, "")}.png`;
    try {
      // 1순위: 화면에 보이는 카드 영역을 그대로 이미지로 저장 (보이는 그대로 = 폰트/여백 일치)
      const node = previewRef.current;
      if (node) {
        const blob = await toBlob(node, {
          pixelRatio: 3,
          cacheBust: true,
          backgroundColor: "#f4eadc",
        });
        if (blob) {
          download(blob, filename);
          return;
        }
      }
      // 2순위(폴백): 캔버스로 직접 그리기
      const canvas = await drawCard(data);
      if (canvas) {
        await new Promise<void>((resolve) =>
          canvas.toBlob((blob) => {
            if (blob) download(blob, filename);
            resolve();
          }, "image/png")
        );
      }
    } catch {
      const canvas = await drawCard(data);
      if (canvas) {
        await new Promise<void>((resolve) =>
          canvas.toBlob((blob) => {
            if (blob) download(blob, filename);
            resolve();
          }, "image/png")
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="share-card-wrap">
      <div className="share-card-preview" ref={previewRef}>
        {data.imageSrc && (
          <img className="share-card-art" src={data.imageSrc} alt="" crossOrigin="anonymous" />
        )}
        <div className="share-card-sheet">
          <p className="share-card-label">오늘의 마음 기록</p>
          <p className="share-card-emoji">{data.emoji}</p>
          <p className="share-card-caption">{data.caption}</p>
          <p className="share-card-message">{data.message}</p>
          <div className="share-card-quote">
            <p>“{data.quoteText}”</p>
            <span>— {data.quoteAuthor}</span>
          </div>
          <p className="share-card-date">{data.dateText}</p>
        </div>
      </div>
      <button className="btn" onClick={handleSave} disabled={busy}>
        {busy ? "만드는 중…" : "카드로 저장"}
      </button>
    </div>
  );
}
