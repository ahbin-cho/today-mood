"use client";

import { useState } from "react";

export type ShareCardData = {
  emoji: string;
  caption: string;
  message: string;
  quoteText: string;
  quoteAuthor: string;
  dateText: string;
  bg: [string, string];
  color: string;
};

// 캔버스에 세로형(스토리 비율) 카드 이미지를 그려 반환
function drawCard(data: ShareCardData): HTMLCanvasElement | null {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 배경 그라데이션
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, data.bg[0]);
  grad.addColorStop(1, data.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 반투명 카드 패널
  const pad = 90;
  const panelX = pad;
  const panelY = 150;
  const panelW = W - pad * 2;
  const panelH = H - 300;
  ctx.save();
  roundRect(ctx, panelX, panelY, panelW, panelH, 48);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.fill();
  ctx.restore();

  const centerX = W / 2;
  const contentW = panelW - 116;

  // 상단 라벨
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(60,55,50,0.55)";
  ctx.font = "600 34px sans-serif";
  ctx.fillText("오늘의 기분", centerX, panelY + 90);

  // 이모지
  ctx.font = "150px sans-serif";
  ctx.fillText(data.emoji, centerX, panelY + 290);

  // 공감 문구(caption)
  ctx.fillStyle = "rgba(50,45,40,0.9)";
  ctx.font = "700 46px sans-serif";
  let y = panelY + 400;
  y = drawWrapped(ctx, data.caption, centerX, y, contentW, 62);

  // 구분선
  y += 30;
  ctx.strokeStyle = data.color + "55";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 60, y);
  ctx.lineTo(centerX + 60, y);
  ctx.stroke();
  y += 70;

  // 위로 한마디(message)
  ctx.fillStyle = "rgba(45,40,38,0.92)";
  ctx.font = "400 40px sans-serif";
  y = drawWrapped(ctx, data.message, centerX, y, contentW, 58);

  // 명언
  y += 46;
  ctx.fillStyle = "rgba(60,55,50,0.78)";
  ctx.font = "italic 500 38px serif";
  y = drawWrapped(ctx, "“" + data.quoteText + "”", centerX, y, contentW, 54);
  y += 20;
  ctx.fillStyle = data.color;
  ctx.font = "600 32px sans-serif";
  ctx.fillText("— " + data.quoteAuthor, centerX, y + 30);

  // 하단 날짜
  ctx.fillStyle = "rgba(60,55,50,0.45)";
  ctx.font = "500 30px sans-serif";
  ctx.fillText(data.dateText, centerX, panelY + panelH - 46);

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

export default function ShareCard({ data }: { data: ShareCardData }) {
  const [busy, setBusy] = useState(false);

  const handleSave = () => {
    setBusy(true);
    const canvas = drawCard(data);
    if (!canvas) {
      setBusy(false);
      return;
    }
    const filename = `오늘의기분_${data.dateText.replace(/[^0-9]/g, "")}.png`;
    canvas.toBlob((blob) => {
      try {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } finally {
        setBusy(false);
      }
    }, "image/png");
  };

  return (
    <button className="btn" onClick={handleSave} disabled={busy}>
      {busy ? "만드는 중…" : "카드로 저장 🖼️"}
    </button>
  );
}
