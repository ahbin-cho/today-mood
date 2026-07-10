"use client";

import { useState } from "react";
import tw from "tailwind-styled-components";

const ShareWrap = tw.div`w-full grid gap-3.5`;
const Preview = tw.div`
  relative overflow-hidden rounded-[28px] min-h-[520px]
  border border-[rgba(175,152,123,0.34)]
  bg-[linear-gradient(180deg,#f4eadc_0%,#efe3d2_100%)]
  shadow-[0_22px_54px_rgba(81,61,37,0.12)]
  after:content-[''] after:absolute after:inset-0
  after:bg-[linear-gradient(180deg,rgba(249,243,236,0.08)_0%,rgba(249,243,236,0.82)_48%,rgba(249,243,236,0.96)_100%)]
`;
const Art = tw.img`absolute inset-0 w-full h-full object-cover`;
const Sheet = tw.div`
  relative z-[1] rounded-[24px] text-center
  bg-[rgba(251,248,242,0.9)] border border-[rgba(183,163,138,0.38)]
  shadow-[0_16px_36px_rgba(81,61,37,0.08)]
  mt-[168px] mx-2.5 mb-2.5 pt-4 px-3.5 pb-3.5
  sm:mt-[220px] sm:mx-[26px] sm:mb-[26px] sm:pt-[26px] sm:px-6 sm:pb-[22px]
`;
const Label = tw.p`text-xs font-bold tracking-[0.08em] text-[#9b8875] mb-2.5`;
const Emoji = tw.p`text-[38px] leading-none mb-3`;
const Caption = tw.p`font-soft text-2xl leading-[1.45] tracking-[-0.01em] text-[#332c26] mb-3.5 [word-break:keep-all]`;
const Message = tw.p`text-[15px] leading-[1.75] text-[#5d5146] [word-break:keep-all]`;
const Quote = tw.div`mt-[18px] rounded-[20px] border border-[rgba(183,163,138,0.42)] bg-white/[0.56] py-4 px-[18px]`;
const QuoteP = tw.p`text-[15px] leading-[1.7] text-[#4b4239] [word-break:keep-all]`;
const QuoteSpan = tw.span`block mt-2.5 text-[12.5px] font-bold text-[#7f6e5d]`;
const CardDate = tw.p`mt-[18px] text-[12.5px] font-bold text-[#685a4d]`;
const SaveBtn = tw.button`
  py-[13px] rounded-[14px] text-sm font-bold cursor-pointer
  border border-line bg-white/85 text-ink
  transition-[transform,box-shadow] duration-200 disabled:opacity-60
`;

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

// 저장: 모바일은 공유 시트(사진 앱에 저장 가능), 그 외엔 파일 다운로드
async function saveImage(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (d: unknown) => boolean;
    share?: (d: unknown) => Promise<void>;
  };
  if (nav.canShare && nav.share && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "오늘의 마음 기록" });
      return;
    } catch (e) {
      // 사용자가 취소한 경우엔 그대로 종료, 그 외 실패는 다운로드로 폴백
      if ((e as { name?: string })?.name === "AbortError") return;
    }
  }
  download(blob, filename);
}

export default function ShareCard({ data }: { data: ShareCardData }) {
  const [busy, setBusy] = useState(false);

  // 캔버스로 카드를 그려서 저장/공유 — 모바일/데스크톱 모두 동일하게 동작
  const handleSave = async () => {
    setBusy(true);
    try {
      const filename = `오늘의기분_${data.dateText.replace(/[^0-9]/g, "")}.png`;
      const canvas = await drawCard(data);
      if (!canvas) return;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (blob) await saveImage(blob, filename);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ShareWrap>
      <Preview>
        {data.imageSrc && (
          <Art data-art src={data.imageSrc} alt="" crossOrigin="anonymous" />
        )}
        <Sheet data-sheet>
          <Label>오늘의 마음 기록</Label>
          <Emoji>{data.emoji}</Emoji>
          <Caption>{data.caption}</Caption>
          <Message>{data.message}</Message>
          <Quote>
            <QuoteP>“{data.quoteText}”</QuoteP>
            <QuoteSpan>— {data.quoteAuthor}</QuoteSpan>
          </Quote>
          <CardDate>{data.dateText}</CardDate>
        </Sheet>
      </Preview>
      <SaveBtn onClick={handleSave} disabled={busy}>
        {busy ? "만드는 중…" : "카드로 저장"}
      </SaveBtn>
    </ShareWrap>
  );
}
