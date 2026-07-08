import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "./registry";

export const metadata: Metadata = {
  title: "오늘의 마음 체크인",
  description: "오늘의 마음을 고르고 적으면, 편지 한 통으로 정리해 드려요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 본문: Pretendard (모던·전문) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css"
        />
        {/* 제목·편지: 마루 부리(따뜻한 명조) — 실패 시 고운바탕으로 대체 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/webfontworld/MaruBuri/MaruBuri.css"
        />
        {/* 대체 명조 + 손글씨 서명 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
